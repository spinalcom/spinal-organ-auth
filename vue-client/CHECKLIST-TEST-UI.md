# Checklist de test UI

## 1. Preparation

- [x] Le front demarre sans erreur
- [x] L'API est disponible
- [x] DevTools ouverts (Network + Console)
- [x] Tests faits sur desktop et mobile/tablette

## 2. Authentification

- [x] Login avec compte valide -> redirection dashboard
- [x] Login invalide -> message d'erreur clair
- [x] Acces direct a une page protegee sans login -> redirection login
- [x] Deconnexion -> appel /tokens/revokeToken avant retour login
- [x] Apres logout, retour arriere navigateur ne re-ouvre pas une page protegee

## 3. Navigation generale

- [x] Chaque item du menu lateral ouvre la bonne page
- [x] L'item actif est bien selectionne/surligne
- [x] Les boutons retour/navigation fonctionnent
- [x] URL inconnue -> page 404

## 4. Loader global

- [x] Le loader s'affiche a chaque changement de page
- [x] Le loader disparait apres affichage complet de la vue
- [x] Pas de blocage permanent du loader en cas d'erreur API
- [x] Loader correct sur login et sur pages authentifiees

## 5. CRUD plateformes

- [x] Liste plateformes: affichage + recherche
- [x] Ajout/edition plateforme: validations des champs
- [x] Meme plateforme non ajoutable 2 fois
- [x] Suppression plateforme: confirmation + rafraichissement liste

## 6. CRUD utilisateurs

- [x] Liste utilisateurs: chargement + recherche
- [x] Ajout utilisateur: validations formulaire
- [x] Edition utilisateur: pre-remplissage + sauvegarde
- [x] Suppression utilisateur: confirmation en francais
- [x] Cas protege (admin): suppression interdite

## 7. CRUD applications

- [x] Liste applications: chargement + recherche
- [x] Ajout/edition application: validations + messages
- [x] Suppression application: confirmation + redirection correcte
- [x] Ajout de plateforme deja existante -> message cohérent

## 9. Serveurs / logs / codes uniques

- [ ] Liste serveurs: affichage + actions (detail/edition/suppression)
- [ ] Detail serveur: suppression fonctionnelle
- [ ] Logs: chargement + filtres de base
- [ ] Codes uniques: recherche, statut, suppression

## 10. Qualite UI/UX

- [ ] Messages utilisateur en francais
- [ ] Aucun composant casse visuellement
- [ ] Aucune erreur JavaScript en console sur parcours complet
- [ ] Focus clavier visible et actions accessibles

## 11. Smoke test final

- [ ] Login
- [ ] Navigation: Dashboard -> Utilisateurs -> Applications -> Plateformes -> Tokens
- [ ] Une action de modification simple
- [ ] Logout
- [ ] Test URL inconnue (404)
