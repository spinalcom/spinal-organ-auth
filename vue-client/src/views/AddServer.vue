<template>
  <v-card class="creationCardContent" elevation="4">
    <form class="formulaire" novalidate @submit.prevent="validateServerInfo">
      <div class="formulaire_info">
        <h4>Saisissez les informations du serveur</h4>

        <div class="errorSummary" v-if="formErrors.length > 0">
          <div class="errorSummaryTitle">Veuillez corriger les erreurs suivantes :</div>
          <ul>
            <li v-for="error in formErrors" :key="error">{{ error }}</li>
          </ul>
        </div>

        <div class="formItem">
          <InputUser title="NOM DU SERVEUR" id="serverName" v-model="serverInfo.name" />
          <span class="errors" v-if="$v.serverInfo.name.$error && !$v.serverInfo.name.required">
            Le nom est requis
          </span>
          <span class="errors" v-else-if="$v.serverInfo.name.$error && !$v.serverInfo.name.minLength">
            Le nom doit contenir au moins 3 caractères
          </span>
        </div>

        <div class="formItem">
          <SelectConnectionType title="METHODE DE CONNEXION" id="connectionMethod" :tab="connectionMethods"
            v-model="serverInfo.authentication_method" :default_value="defaultAuthenticationMethod"
            :edit="isEditPage" />
          <span class="errors"
            v-if="$v.serverInfo.authentication_method.$error && !$v.serverInfo.authentication_method.required">
            Le mode d'authentification est obligatoire
          </span>
          <span class="errors"
            v-else-if="$v.serverInfo.authentication_method.$error && !$v.serverInfo.authentication_method.format">
            Le mode d'authentification est invalide
          </span>
        </div>

        <div class="server_info" v-if="serverInfo.authentication_method === 'saml'">
          <div class="formItem">
            <InputUser title="Emetteur (Issuer EntityID)" id="issuer" v-model="serverInfo.authentication_info.issuer" />
          </div>

          <div class="formItem">
            <InputUser title="Entity ID du serveur (SP Entity ID)" id="serverEntityId"
              v-model="serverInfo.authentication_info.serverEntityId" />
          </div>

          <div class="formItem">
            <InputUser title="url de connexion" id="entryPoint" v-model="serverInfo.authentication_info.entryPoint" />
          </div>

          <div class="formItem">
            <InputUser title="url de retour" id="callbackUrl" v-model="serverInfo.authentication_info.callbackUrl" />
          </div>

          <div class="formItem">
            <InputUser title="url de deconnexion" id="logoutUrl" v-model="serverInfo.authentication_info.logoutUrl" />
          </div>

          <div class="formItem">
            <InputUser title="Saisissez les profils par ordre de priorité, séparés par un espace."
              id="profileClassifyByPriority" v-model="serverInfo.authentication_info.profileClassifyByPriority" />
          </div>

          <div class="formItem">
            <TextareaUser title="certificat de l'emetteur" id="cert" v-model="serverInfo.authentication_info.cert" />
          </div>

        </div>

        <div class="server_info" v-else-if="serverInfo.authentication_method === 'oauth2'">
          <div class="formItem">
            <InputUser title="App Client Id" id="appClientId" v-model="serverInfo.authentication_info.clientId" />
          </div>

          <div class="formItem">
            <InputPass title="App Client Secret" id="appClientSecret"
              v-model="serverInfo.authentication_info.clientSecret" />
          </div>

          <div class="formItem">
            <InputUser title="Scopes (separés par un espace)" id="scopes"
              v-model="serverInfo.authentication_info.scopes" />
          </div>

          <div class="formItem">
            <InputUser title="url de connexion" id="endpoint" v-model="serverInfo.authentication_info.endpoint" />
          </div>

          <div class="formItem">
            <InputUser title="url de connexion" id="tokenUrl" v-model="serverInfo.authentication_info.tokenUrl" />
          </div>

          <div class="formItem">
            <InputUser title="url de retour" id="callbackUrl" v-model="serverInfo.authentication_info.callbackUrl" />
          </div>

          <div class="formItem">
            <InputUser title="url de deconnexion" id="logoutUrl" v-model="serverInfo.authentication_info.logoutUrl" />
          </div>

          <div class="formItem">
            <SelectGrant title="GRANT TYPES" id="grant_types" v-model="serverInfo.authentication_info.grant_type" />
          </div>

          <div class="formItem">
            <InputUser title="Saisissez les profils par ordre de priorité, séparés par un espace."
              id="profileClassifyByPriority" v-model="serverInfo.authentication_info.profileClassifyByPriority" />
          </div>

        </div>

        <div class="server_info" v-else-if="serverInfo.authentication_method === 'openid connect'">
          <div class="formItem">
            <InputUser title="Emetteur (Issuer EntityID)" id="issuer" v-model="serverInfo.authentication_info.issuer" />
          </div>

          <div class="formItem">
            <InputUser title="App Client Id" id="appClientId" v-model="serverInfo.authentication_info.clientId" />
          </div>

          <div class="formItem">
            <InputPass title="App Client Secret" id="appClientSecret"
              v-model="serverInfo.authentication_info.clientSecret" />
          </div>

          <div class="formItem">
            <InputUser title="Scopes (separés par un espace)" id="scopes"
              v-model="serverInfo.authentication_info.scopes" />
          </div>

          <div class="formItem">
            <InputUser title="url d'information d'utilisateur" id="userInfoUrl"
              v-model="serverInfo.authentication_info.userInfoUrl" />
          </div>

          <div class="formItem">
            <InputUser title="url d'authorization" id="authorizationUrl"
              v-model="serverInfo.authentication_info.authorizationUrl" />
          </div>

          <div class="formItem">
            <InputUser title="url de recuperation de token" id="tokenUrl"
              v-model="serverInfo.authentication_info.tokenUrl" />
          </div>

          <div class="formItem">
            <InputUser title="url de retour" id="callbackUrl" v-model="serverInfo.authentication_info.callbackUrl" />
          </div>

          <div class="formItem">
            <InputUser title="url de deconnexion" id="logoutUrl" v-model="serverInfo.authentication_info.logoutUrl" />
          </div>

          <div class="formItem">
            <InputUser title="Saisissez les profils par ordre de priorité, séparés par un espace."
              id="profileClassifyByPriority" v-model="serverInfo.authentication_info.profileClassifyByPriority" />
          </div>

        </div>
      </div>

      <div class="validation-btn">
        <button class="btn-retour" type="reset" @click="cancelAdd()">
          ANNULER
        </button>

        <button type="submit" class="btn-creer">
          {{ isEditPage ? "MODIFIER LE SERVEUR" : "AJOUTER LE SERVEUR" }}
        </button>
      </div>
    </form>
  </v-card>
</template>

<script>
import SelectGrant from "../Components/SelectGrants.vue";
import SelectConnectionType from "../Components/SelectPatformConnexionType.vue";
import InputUser from "../Components/InputUser";
import InputPass from "../Components/InputPassword";
import TextareaUser from "../Components/TextareaUser";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { mapActions } from "vuex";

const connection_methods = [
  { name: "saml", value: "saml" },
  { name: "oauth2", value: "oauth2" },
  { name: "openid connect", value: "openid connect" },
];

export default {
  name: "ServerList",
  mixins: [validationMixin],
  components: {
    SelectGrant,
    SelectConnectionType,
    InputUser,
    TextareaUser,
    InputPass,
  },
  async mounted() {
    if (this.$route.name === "EditServer") {
      this.editChargement = true;
      this.isEditPage = true;

      const id = this.$route.query.id;
      this.serverInfo = await this.getServerById(id);
      this.defaultAuthenticationMethod = {
        name: this.serverInfo.authentication_method,
        value: this.serverInfo.authentication_method,
      };
    }
  },
  data() {
    return {
      serverInfo: {
        name: "",
        authentication_method: "",
        authentication_info: {},
      },
      connectionMethods: connection_methods,
      editChargement: false,
      isEditPage: false,
      authInfoErrors: [],
      defaultAuthenticationMethod: connection_methods[0],
    };
  },
  validations: {
    serverInfo: {
      name: {
        required,
        minLength: minLength(3),
      },

      authentication_method: {
        required,
        format: (value) => {
          if (!value || typeof value !== "string") return false;
          return connection_methods.some(
            (el) => el.value.toLowerCase() === value.toLowerCase()
          );
        },
      },
    },
  },

  methods: {
    ...mapActions({
      addServer: "serverLogin/addServer",
      getServerById: "serverLogin/getServerById",
      editServer: "serverLogin/editServer",
    }),

    cancelAdd() {
      // this.$router.push("/Servers");
      this.$router.go(-1);
    },

    async validateServerInfo() {
      this.$v.$touch();
      this.authInfoErrors = this.validateAuthInfoByMethod();

      if (this.$v.$invalid) {
        return;
      }

      if (this.authInfoErrors.length > 0) return;

      this.createOrEdit()
        .then(() => {
          // this.$router.push("/Servers");
          this.$router.go(-1);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    validateAuthInfoByMethod() {
      const method = this.serverInfo.authentication_method;
      const info = this.serverInfo.authentication_info || {};
      const errors = [];
      const isEmpty = (value) => {
        if (Array.isArray(value)) return value.length === 0;
        return !String(value || "").trim();
      };

      if (method === "saml") {
        if (isEmpty(info.issuer)) errors.push("L'emetteur (Issuer EntityID) est obligatoire.");
        if (isEmpty(info.serverEntityId)) errors.push("L'Entity ID du serveur est obligatoire.");
        if (isEmpty(info.entryPoint)) errors.push("L'url de connexion est obligatoire.");
        if (isEmpty(info.callbackUrl)) errors.push("L'url de retour est obligatoire.");
        if (isEmpty(info.cert)) errors.push("Le certificat de l'emetteur est obligatoire.");
      }

      if (method === "oauth2") {
        if (isEmpty(info.clientId)) errors.push("L'App Client Id est obligatoire.");
        if (isEmpty(info.clientSecret)) errors.push("L'App Client Secret est obligatoire.");
        if (isEmpty(info.endpoint)) errors.push("L'url de connexion est obligatoire.");
        if (isEmpty(info.tokenUrl)) errors.push("L'url de recuperation de token est obligatoire.");
        if (isEmpty(info.callbackUrl)) errors.push("L'url de retour est obligatoire.");
        if (isEmpty(info.grant_type)) errors.push("Au moins un grant type est obligatoire.");
      }

      if (method === "openid connect") {
        if (isEmpty(info.issuer)) errors.push("L'emetteur (Issuer EntityID) est obligatoire.");
        if (isEmpty(info.clientId)) errors.push("L'App Client Id est obligatoire.");
        if (isEmpty(info.clientSecret)) errors.push("L'App Client Secret est obligatoire.");
        if (isEmpty(info.authorizationUrl)) errors.push("L'url d'authorization est obligatoire.");
        if (isEmpty(info.tokenUrl)) errors.push("L'url de recuperation de token est obligatoire.");
        if (isEmpty(info.userInfoUrl)) errors.push("L'url d'information d'utilisateur est obligatoire.");
        if (isEmpty(info.callbackUrl)) errors.push("L'url de retour est obligatoire.");
      }

      return errors;
    },

    async createOrEdit() {
      if (!this.isEditPage) return this.addServer(this.serverInfo);

      const editValue = {
        authentication_info: this.serverInfo.authentication_info,
        authentication_method: this.serverInfo.authentication_method,
        name: this.serverInfo.name,
      };
      return this.editServer({
        serverId: this.$route.query.id,
        server: editValue,
      });
    },

    _getSamlDefaultValue() {
      return {
        issuer: "",
        entryPoint: "",
        cert: "",
        callbackUrl: "",
        logoutUrl: "",
        serverEntityId: "",
        profileClassifyByPriority: "",
      };
    },

    _getOauth2DefaultValue() {
      return {
        clientId: "",
        clientSecret: "",
        callbackUrl: "",
        endpoint: "",
        logoutUrl: "",
        grant_type: "",
        scopes: "",
        tokenUrl: "",
        profileClassifyByPriority: "",
      };
    },

    _getOpenIdDefaultValue() {
      return {
        issuer: "",
        authorizationUrl: "",
        tokenUrl: "",
        userInfoUrl: "",
        clientId: "",
        clientSecret: "",
        callbackUrl: "",
        scopes: "",
        profileClassifyByPriority: "",
      };
    },
  },

  watch: {
    "serverInfo.authentication_method": function () {
      this.authInfoErrors = [];
      // cette partie permet de ne pas continuer l'execution du watcher
      // lors du chargement de l'edit
      if (this.editChargement) {
        this.editChargement = false;
        return;
      }

      switch (this.serverInfo.authentication_method) {
        case "saml":
          this.serverInfo.authentication_info = this._getSamlDefaultValue();
          break;
        case "oauth2":
          this.serverInfo.authentication_info = this._getOauth2DefaultValue();
          break;

        case "openid connect":
          this.serverInfo.authentication_info = this._getOpenIdDefaultValue();
          break;

        default:
          break;
      }
    },
  },
  computed: {
    formErrors() {
      const errors = [];

      if (this.$v.serverInfo.name.$error) {
        if (!this.$v.serverInfo.name.required) {
          errors.push("Le nom est requis.");
        } else if (!this.$v.serverInfo.name.minLength) {
          errors.push("Le nom doit contenir au moins 3 caractères.");
        }
      }

      if (this.$v.serverInfo.authentication_method.$error) {
        if (!this.$v.serverInfo.authentication_method.required) {
          errors.push("Le mode d'authentification est obligatoire.");
        } else if (!this.$v.serverInfo.authentication_method.format) {
          errors.push("Le mode d'authentification est invalide.");
        }
      }

      return [...new Set([...errors, ...this.authInfoErrors])];
    },
  },
};
</script>

<style scoped>
.creationCardContent {
  width: calc(100% - 20px);
  height: calc(100vh - 100px) !important;
  margin: auto;
  display: flex;
  justify-content: center;
  background: transparent !important;
}

.formulaire {
  /* padding-left: 25%;
  padding-right: 25%;
  padding-bottom: 20px; */
  width: 60%;
  height: 100%;
  font-size: 14px;
  margin: auto;
}

.validation-btn {
  height: 60px;
  display: flex;
  justify-content: flex-end;
}

.formulaire .formulaire_info {
  width: 100%;
  height: calc(100% - 100px);
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.creationCardContent .errorSummary {
  margin: 0 0 14px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fff1f1;
  border: 1px solid #f2c4c4;
}

.creationCardContent .errorSummaryTitle {
  color: #a50000;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
}

.creationCardContent .errorSummary ul {
  margin: 0;
  padding-left: 18px;
  color: #a50000;
  font-size: 11px;
}

.formulaire .formItem {
  margin-bottom: 20px;
}

.creationCardContent .btn-retour {
  border: 1px solid #14202c;
  border-radius: 6px;
  opacity: 1;
  width: 120px;
  height: 40px;
  margin-right: 5px;
  margin-top: 20px;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
}

.creationCardContent .btn-creer {
  height: 40px;
  border: 0px;
  padding-left: 30px;
  padding-right: 30px;
  background: #14202c;
  border-radius: 6px;
  color: white;
  margin-left: 5px;
  margin-top: 20px;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
}

.creationCardContent .errors {
  margin: 4px 0 10px;
  position: static;
  display: block;
  transform: none;
  font-size: 11px;
  color: #c00000;
  padding-left: 4px;
  letter-spacing: 1.1px;
}

.creationCardContent .error {
  position: absolute;
  color: rgb(255, 0, 0);
  font: normal normal normal 11px/13px Charlevoix Pro;
}
</style>
