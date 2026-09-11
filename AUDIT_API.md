# Analyse de l’API et suggestions d’amélioration

Date : 10 septembre 2026.

## Périmètre et méthode

Cette analyse porte sur les contrôleurs, les services, les tokens, les flux SSO et la configuration Express de l’API. Elle repose sur la lecture du code et quelques vérifications isolées en mémoire, sans démarrer l’API ni se connecter au hub. Aucun code applicatif n’a été modifié.

La vérification TypeScript avec `tsc --noEmit --incremental false --pretty false` a réussi. Les contrôles isolés ont confirmé l’acceptation d’un token arbitraire par le middleware, le refus d’une requête sans token, le défaut de purge des tokens expirés et l’absence d’échappement des apostrophes dans le HTML de redirection.

Les protections éventuellement mises en place dans l’infrastructure, le proxy ou les systèmes externes n’ont pas été vérifiées. Ce rapport ne constitue pas un test d’intrusion complet. Les numéros de ligne correspondent au code examiné à la date de l’analyse.

## 1. Critique — Rétablir l’authentification et le contrôle d’accès

**Références :** [middleware de sécurité](api/src/security/index.ts#L34), [contrôleur utilisateurs](api/src/routes/authUser/userController.ts#L61).

### Constat

`expressAuthentication()` retourne le token dès qu’il est présent. La validation et le contrôle des scopes sont commentés. Une chaîne arbitraire a été acceptée lors d’un contrôle isolé demandant le scope `authAdmin:delete`.

Les décorateurs `@Security` des routes administrateur donnent donc une impression de protection que le middleware n’assure pas. Les opérations du contrôleur utilisateurs examinées ne compensent pas ce défaut.

### Améliorations proposées

- Valider le token selon son format et son mécanisme d’émission ; pour un JWT, vérifier sa signature, son expiration et les claims requis.
- Vérifier sa révocation ainsi que les droits de l’acteur authentifié.
- Définir explicitement la sémantique des scopes : permissions cumulatives ou alternatives, selon la route.
- Pour les permissions `ownData`, vérifier que la ressource demandée appartient à l’utilisateur connecté. La présence d’un scope ne prouve pas cette appartenance.
- Retourner `401` pour une authentification invalide et `403` pour un accès interdit à un acteur authentifié.
- Appliquer ces règles à toutes les routes protégées, y compris celles utilisant les tokens de plateforme ou d’application.

### Vérifications à prévoir

Tester les tokens absents, arbitraires, expirés et révoqués ; les permissions insuffisantes ; l’accès d’un utilisateur aux données d’un autre ; et les accès administrateur autorisés.

Référence externe : [OWASP — REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html).

## 2. Critique — Retirer les secrets des réponses de consultation

**Références :** [route publique des serveurs de connexion](api/src/routes/platform/platformController.ts#L79), [formatage des serveurs](api/src/routes/loginServer/loginServerService.ts#L114), [formatage des plateformes](api/src/routes/platform/platformServices.ts#L459).

### Constat

`GET /platforms/{platformId}/loginServers` est public et retourne les serveurs via un formateur qui expose intégralement `node.info.get()`. Cela inclut `authentication_info.clientSecret` lorsqu’il est configuré.

Le formateur des plateformes renvoie également `clientSecret`, `TokenBosAdmin` et `TokenAdminBos` dans les réponses de consultation. Le défaut de contrôle d’accès décrit au point 1 aggrave cette exposition.

### Améliorations proposées

- Créer un modèle de réponse public limité à l’identifiant, au nom et à la méthode de connexion.
- Définir des modèles de réponse distincts des objets stockés dans le graphe.
- Exclure les secrets et les tokens des listes et des réponses de consultation ordinaires.
- Réserver leur délivrance aux opérations explicites qui en ont besoin, avec les permissions correspondantes.
- Ajouter des tests vérifiant l’absence de champs sensibles dans les réponses publiques et les listes administratives.

## 3. Élevée — Corriger la purge, la révocation et la durée des tokens

**Références :** [validation des tokens](api/src/routes/tokens/tokenService.ts#L257), [suppression et purge](api/src/routes/tokens/tokenService.ts#L412), [durées de validité](api/src/routes/tokens/tokenService.ts#L507), [token BOS administrateur](api/src/routes/platform/platformServices.ts#L278).

### Constat

`removeToken()` n’affecte pas `tokenNode` lorsque son argument est déjà un `SpinalNode`. Or `purgeInvalidToken()` lui passe précisément des nœuds. Un contrôle isolé a confirmé qu’un token expiré reste présent après la purge.

Par ailleurs, `verifyToken()` ne vérifie plus la présence du token dans le stockage : ce contrôle est commenté. Supprimer un token du graphe ne suffit donc pas à le rendre invalide sur ce chemin de vérification.

Les tokens issus des codes ont une durée de validité de **1 000 ans**. Les tokens BOS administrateur ont une durée de **50 ans**.

### Améliorations proposées

- Corriger la prise en charge des arguments `string` et `SpinalNode` dans la suppression.
- Définir une stratégie de révocation réellement consultée par les chemins de validation.
- Choisir des durées adaptées à chaque usage et prévoir un renouvellement contrôlé.
- Invalider les accès concernés lors d’une suppression de compte, d’un changement de droits ou d’une réinitialisation de mot de passe, selon la politique retenue.
- Vérifier que les droits et la plateforme demandés restent cohérents avec le token présenté.
- Couvrir la purge et la révocation par des tests, indépendamment de la seule vérification de signature.

## 4. Élevée — Garantir la consommation unique des codes

**Référence :** [service des codes](api/src/routes/uniqueCode/codeService.ts#L41).

### Constat

Des opérations asynchrones séparent la vérification de `used` de son passage à `true`. Deux requêtes concurrentes peuvent donc franchir cette vérification avant qu’une consommation soit enregistrée.

Les codes font cinq caractères et aucune expiration n’est vérifiée dans leur consommation. Aucune limitation de débit n’a été trouvée dans le code de l’API ; une protection au niveau du proxy reste à vérifier.

### Améliorations proposées

- Rendre atomique la réservation ou la consommation d’un code, avec un mécanisme compatible avec le stockage et le nombre d’instances de l’API.
- Prévoir explicitement le comportement en cas d’échec après réservation.
- Ajouter une expiration aux codes et la vérifier à la consommation.
- Adapter la longueur et l’aléa des codes au niveau de protection attendu.
- Limiter les tentatives sur la consommation des codes et sur les routes de connexion.
- Tester deux consommations simultanées : une seule doit aboutir.

## 5. Élevée — Échapper les données dans le HTML de redirection

**Référence :** [génération du formulaire HTML](api/src/utilities/formatResponseHtml.ts#L9).

### Constat

L’URL de retour et le résultat de `JSON.stringify(data)` sont insérés directement dans des attributs HTML délimités par des apostrophes. Une valeur comme `O'Connor` suffit à casser cet encodage. Une valeur malveillante atteignant cette fonction peut permettre une injection HTML ou JavaScript.

### Améliorations proposées

- Utiliser un template assurant l’échappement adapté au contexte des attributs HTML.
- Ne pas considérer `JSON.stringify()` comme un mécanisme d’échappement HTML.
- Valider les URL de retour contre les destinations autorisées.
- Tester les apostrophes, les guillemets, les caractères HTML et les valeurs contenant des balises.

Référence externe : [OWASP — Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

## 6. Élevée — Isoler le contexte de chaque connexion SSO

**Références :** [contexte SAML](api/src/SSO/saml/index.ts#L66), [contexte OpenID Connect](api/src/SSO/openid/index.ts#L38).

### Constat

Le flux SAML stocke la plateforme cible dans une table globale indexée par fournisseur d’identité. Une autre connexion utilisant ce fournisseur peut remplacer cette valeur avant le retour de la première connexion. OpenID Connect utilise une association globale comparable entre fournisseur et plateforme.

Ce fonctionnement expose à des erreurs de sélection de plateforme lorsque plusieurs connexions utilisent le même fournisseur. Le scénario n’a pas été exécuté contre un fournisseur SSO réel.

### Améliorations proposées

- Attacher la plateforme cible à chaque transaction d’authentification.
- Vérifier la corrélation de cette transaction au retour du fournisseur.
- Éviter de stocker le contexte d’une connexion dans une variable globale indexée uniquement par fournisseur.
- Tester deux connexions simultanées vers deux plateformes partageant un fournisseur.
- Vérifier également le comportement après expiration de session et avec plusieurs instances de l’API.

## 7. Importante — Durcir les sessions et la configuration TLS

**Références :** [configuration Express](api/src/server.ts#L65), [configuration documentée](README.md).

### Constat

Les sessions utilisent un secret fixe, `secure: false` et le stockage mémoire par défaut. Le README propose `NODE_TLS_REJECT_UNAUTHORIZED=0`, qui désactive la vérification des certificats TLS si cette configuration est appliquée.

### Améliorations proposées

- Externaliser le secret de session et utiliser une valeur aléatoire appropriée.
- Configurer les cookies pour HTTPS et choisir les attributs adaptés aux flux SSO utilisés.
- Configurer la confiance dans le proxy en fonction du déploiement réel.
- Utiliser un stockage de sessions adapté à la production et partagé si plusieurs instances servent les requêtes.
- Revoir `resave`, `saveUninitialized` et la durée de session selon le besoin réel.
- Conserver la validation des certificats TLS et configurer les autorités de confiance nécessaires.

Référence externe : [Express — Session middleware](https://expressjs.com/en/resources/middleware/session/). Cette documentation déconseille explicitement `MemoryStore` en production.

## 8. Importante — Aligner la validation et les écritures métier

**Références :** [modèle de création utilisateur](api/src/routes/authUser/user.model.ts#L63), [création utilisateur](api/src/routes/authUser/userService.ts#L84), [mise à jour utilisateur](api/src/routes/authUser/userService.ts#L217).

### Constat

`platformList` est optionnel dans le modèle de création, mais le service l’itère sans valeur par défaut, après avoir créé le nœud utilisateur. Une requête sans cette propriété peut donc échouer tout en laissant un compte créé.

La vérification d’unicité lors du renommage est également incorrecte : elle compare l’identifiant de l’utilisateur sélectionné avec l’identifiant utilisé pour le sélectionner. Elle ne recherche pas correctement un autre utilisateur portant le nom demandé.

### Améliorations proposées

- Valider les données et les références aux profils avant les écritures.
- Aligner les champs optionnels du contrat avec le comportement du service : valeur par défaut ou obligation explicite.
- Définir une stratégie d’annulation ou de compensation en cas d’échec d’une opération comportant plusieurs écritures.
- Vérifier l’unicité des noms en excluant l’utilisateur en cours de modification.
- Garantir cette unicité en concurrence, et pas seulement par une lecture préalable.
- Tester l’absence de `platformList`, un profil inexistant, un renommage vers un nom déjà utilisé et un échec au milieu d’une création.

## 9. Maintenabilité — Uniformiser la gestion des erreurs

**Références :** [gestionnaire d’erreurs commun](api/src/utilities/apiErrorResponse.ts#L123), [contrôleur utilisateurs](api/src/routes/authUser/userController.ts#L48), [lecture des utilisateurs](api/src/routes/authUser/userService.ts#L179).

### Constat

Un gestionnaire central existe, mais les contrôleurs renvoient souvent leurs propres objets `{ error: error.message }`. Certains services masquent les erreurs : `getUsers()` retourne une liste vide en cas d’exception, ce qui rend une panne indiscernable d’une absence d’utilisateurs.

### Améliorations proposées

- Utiliser systématiquement un contrat d’erreur commun.
- Préserver les erreurs des services au lieu de les convertir en résultats apparemment valides.
- Employer des codes d’erreur métier stables et des statuts HTTP cohérents.
- Conserver les détails techniques nécessaires au diagnostic dans les logs ; éviter d’exposer les messages internes inattendus aux clients.
- Tester la distinction entre une collection vide, une ressource absente, une entrée invalide et une panne du stockage.

## 10. Performances — Réduire les parcours complets du graphe

**Références :** [liste des utilisateurs](api/src/routes/authUser/userService.ts#L179), [recherche par nom](api/src/routes/authUser/userService.ts#L479), [recherche des tokens](api/src/routes/tokens/tokenService.ts#L427).

### Constat

Plusieurs recherches chargent tous les utilisateurs ou tous les tokens avant de filtrer. La liste des utilisateurs charge également les plateformes associées à chaque utilisateur. Ces parcours peuvent devenir coûteux lorsque le volume augmente.

### Améliorations proposées

- Paginer les listes et définir une taille maximale de page.
- Indexer les recherches fréquentes : identifiant, nom utilisateur, identifiant client et token, selon les possibilités du stockage.
- Réduire les lectures répétées de relations et limiter la concurrence des opérations volumineuses.
- Mesurer les temps de réponse et le nombre de lectures du graphe avec des volumes représentatifs avant de choisir les optimisations.

## 11. Qualité — Ajouter des tests ciblés sur les garanties de l’API

**Référence :** [scripts de l’API](api/package.json).

### Constat

Aucune suite de tests API ni aucun script `test` n’a été trouvé dans le périmètre examiné. La compilation TypeScript réussit, mais elle ne détecte pas les défauts fonctionnels et les problèmes de sécurité décrits dans ce rapport.

### Améliorations proposées

Commencer par les garanties qui protègent les données et les accès :

1. Refus des tokens invalides, expirés et révoqués.
2. Contrôle des permissions et de l’appartenance des ressources.
3. Absence de secrets dans les réponses publiques et les listes.
4. Purge des tokens et révocation effective.
5. Consommation concurrente d’un code à usage unique.
6. Isolation de deux transactions SSO simultanées.
7. Validation des entrées avant création et absence d’écritures partielles inattendues.

Rendre ces tests exécutables sans données de production et intégrer leur exécution, ainsi que la vérification TypeScript, dans les contrôles du projet.

## 12. Exploitation — Encadrer les appels externes et le cycle du serveur

**Références :** [appel de synchronisation de plateforme](api/src/routes/platform/platformServices.ts#L338), [démarrage et tâche planifiée](api/src/index.ts#L33), [serveur HTTP](api/src/server.ts#L101).

### Améliorations proposées

- Définir des délais explicites pour les appels externes, notamment l’appel `axios.put()` de synchronisation.
- Ajouter des contrôles de disponibilité permettant de distinguer le processus actif de l’API prête à servir avec ses dépendances.
- Prévoir un arrêt propre du serveur et des tâches planifiées lors de l’arrêt du processus.
- Journaliser les échecs de démarrage, de connexion au hub, de synchronisation et de purge afin qu’ils soient diagnostiquables.

## Ordre de traitement conseillé

| Ordre | Travaux | Résultat attendu |
| --- | --- | --- |
| 1 | Authentification, autorisations et réponses contenant des secrets | Empêcher les accès non autorisés et l’exposition de secrets |
| 2 | Révocation, purge, codes uniques, HTML de redirection et contexte SSO | Fiabiliser l’émission et l’utilisation des accès |
| 3 | Sessions, TLS, validation métier et gestion des erreurs | Renforcer la fiabilité des requêtes et du déploiement |
| 4 | Pagination, indexation et exploitation | Maîtriser la montée en charge et faciliter le diagnostic |

Les tests doivent accompagner chaque correction, en commençant par les constats critiques.

## Éléments existants à conserver

La séparation entre contrôleurs et services, le hachage des mots de passe avec bcrypt et la validation générée par TSOA constituent des bases utiles. Le gestionnaire d’erreurs commun peut aussi servir de point de départ pour uniformiser les réponses.
