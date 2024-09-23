<template>
  <v-app>
    <v-main>
      <BackupInformation title="AJOUTER UNE PLATEFORME" class="add_platform_card">
        <form class="formulaire" novalidate @submit.prevent="validateApp">
          <div class="formulaire_info">
            <div class="left_side">
              <p>Saisissez les informations de la plateforme.</p>
              <InputUser title="NOM DE LA PLATEFORME" id="appName" v-model="formApp.name" />

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.name.required">Un nom est
                requis</span>
              <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formApp.name.minLength">Le doit
                contenir au moins 2 caractères</span>

              <InputUser title="L'URL DE MIS A JOUR DE LA PLATEFORME" id="appName" v-model="formApp.url" />

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.url.required">L'url de mis à jour
                est requis</span>

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.url.format">l'url de mis à jour est
                invalide</span>

              <InputUser title="L'URL DE REDIRECTION DE LA PLATEFORME" id="appName" v-model="formApp.redirectUrl" />

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.redirectUrl.required">L'url de
                redirection est requis</span>

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.redirectUrl.format">l'url de
                redirection est invalide</span>

              <InputPass readonly="true" title="CLIENT ID" id="clientId" v-model="formApp.clientId" />
              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.clientId.required">un id client est
                requis</span>

              <InputPass readonly="true" title="CLIENT SECRET" id="clientSecret" v-model="formApp.clientSecret" />
              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.clientSecret.required">
                Le mot de passe est nécessaire
              </span>

              <div class="loginServerContainer">
                <h5 class="title">Ajouter le(s) serveur(s) d'authentification</h5>

                <div v-for="(item, index) in servers" :key="item.id" class="serverItem">
                  <div class="selector">
                    <div class="icon">
                      <v-icon>mdi-server-security</v-icon>
                    </div>
                    <div class="name">{{ item.name }}</div>
                    <!-- <SelectUser :id=index class="platform" @select="getAppProfileList()" :tab="platformList"
                      v-model="formPlatformObjectapp.platform" title="PLATFORM"
                      :disabled="disableobjet[index] ? disableobjet[index].plat == true ? true : false : false" /> -->
                  </div>


                  <button type="button" class="serverBtn delete" v-if="isLinked(item)" @click="unlinkItem(item)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </button>

                  <button type="button" class="serverBtn add" v-else @click="linkItem(item)">
                    <v-icon>mdi-plus</v-icon>
                  </button>

                </div>
              </div>

              <!-- <SelectConnectionType title="METHODE DE CONNEXION" id="connectionMethod" :tab="connectionMethods"
                v-model="formApp.authentication_method" />
              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.authentication_method.required">
                Le mode d'authentification est obligatoire
              </span> -->
            </div>





            <!--
            <div class="right_side" v-if="formApp.authentication_method && formApp.authentication_method !== 'local'">
              <p>Saisissez les informations de connexion au serveur SSO</p>

              <div class="server_info" v-if="formApp.authentication_method === 'saml'">
                <InputUser title="Emetteur (Entity ID)" id="issuer" v-model="formApp.authentication_info.issuer" />
                <InputUser title="url de connexion" id="entryPoint" v-model="formApp.authentication_info.entryPoint" />
                <InputUser title="url de retour" id="callbackUrl" v-model="formApp.authentication_info.callbackUrl" />
                <InputUser title="url de deconnexion" id="logoutUrl" v-model="formApp.authentication_info.logoutUrl" />
                <TextareaUser title="certificat de l'emetteur" id="cert" v-model="formApp.authentication_info.cert" />
              </div>

              <div class="server_info" v-else-if="formApp.authentication_method === 'oauth2'">
                <InputUser title="App Client Id" id="appClientId" v-model="formApp.authentication_info.clientId" />

                <InputPass title="App Client Secret" id="appClientSecret"
                  v-model="formApp.authentication_info.clientSecret" />

                <InputUser title="Scopes (separés par une ',')" id="scopes"
                  v-model="formApp.authentication_info.scopes" />


                <SelectGrant title="GRANT TYPES" id="grant_types" v-model="formApp.authentication_info.grant_types" />

                <InputUser title="url de connexion" id="endpoint" v-model="formApp.authentication_info.endpoint" />

                <InputUser title="url de retour" id="callbackUrl" v-model="formApp.authentication_info.callbackUrl" />

                <InputUser title="url de deconnexion" id="logoutUrl" v-model="formApp.authentication_info.logoutUrl" />

              </div>
            </div>
            -->
          </div>


          <div class="d-flex justify-end">
            <button class="btn-retour" @click="cancelAdd()">RETOUR</button>
            <button type="submit" class="btn-creer">
              AJOUTER LA PLATEFORME
            </button>
          </div>
        </form>
      </BackupInformation>
    </v-main>
  </v-app>
</template>

<script>
import InputUser from "../Components/InputUser";
import TextareaUser from "../Components/TextareaUser"
import InputPass from "../Components/InputPassword";
import AddPlatform from "../Components/AddPlatform.vue";
import BackupInformation from "../Components/BackupInformation.vue";
import SelectConnectionType from "../Components/SelectPatformConnexionType.vue";
import SelectGrant from "../Components/SelectGrants.vue";
import { validationMixin } from "vuelidate";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { unlink } from "fs";

export default {
  mixins: [validationMixin],
  components: {
    InputUser,
    InputPass,
    AddPlatform,
    BackupInformation,
    SelectConnectionType,
    TextareaUser,
    SelectGrant
  },
  data() {
    return {
      formApp: {
        name: null,
        clientId: this.generateRegisterKey(),
        clientSecret: this.generateRegisterKey(),
        redirectUrl: null,
        url: null,
        loginServerIds: []
        // authentication_method: "",
        // authentication_info: {}
      },
      iserrors: true,
      error_platform: false,
      connectionMethods: [
        { name: "local", value: "local" },
        { name: "saml", value: "saml" },
        { name: "oauth2", value: "oauth2" }
      ],
    };
  },
  async mounted() {
    await this.getAllServers()
  },

  validations: {
    formApp: {
      name: {
        required,
        minLength: minLength(3),
      },
      clientId: {
        required,
      },
      clientSecret: {
        required,
      },
      redirectUrl: {
        required,
        format: (value) => {
          const regex =
            /https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))/gm;
          return regex.test(value);
        },
      },
      url: {
        required,
        format: (value) => {
          const regex =
            /https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))/gm;
          return regex.test(value);
        },
      },

      // authentication_method: {
      //   required,
      //   format: (value) => {
      //     return ["local", "saml", "oauth2"].some(el => el == value);
      //   }
      // }
    },
  },

  methods: {
    ...mapActions({ savePlatform: "platforms/savePlatform", getAllServers: "serverLogin/getAllServers" }),

    cancelAdd() {
      this.$router.push("/Platforms");
    },
    generateRegisterKey() {
      const generator = require("generate-password");
      var registerKey = generator.generate({
        length: 30,
        numbers: true,
      });
      return registerKey;
    },

    async validateApp() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.savePlatform(this.formApp)
          .then((result) => {
            this.$router.push("/Platforms");
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.iserrors = false;
      }
    },

    isLinked(item) {
      return this.formApp.loginServerIds.indexOf(item.id) !== -1;
    },

    linkItem(item) {
      this.formApp.loginServerIds = [...this.formApp.loginServerIds, item.id];
    },

    unlinkItem(item) {
      this.formApp.loginServerIds = this.formApp.loginServerIds.filter(el => el !== item.id);
    }
  },

  computed: {
    ...mapGetters({ servers: "serverLogin/servers" })
  },
  watch: {
    // "formApp.authentication_method": function () {
    //   if (this.formApp.authentication_method === 'saml') {
    //     this.formApp.authentication_info = {
    //       issuer: "",
    //       entryPoint: "",
    //       cert: "",
    //       callbackUrl: "",
    //       logoutUrl: "",
    //     }
    //   } else if (this.formApp.authentication_method === 'oauth2') {
    //     this.formApp.authentication_info = {
    //       clientId: "",
    //       clientSecret: "",
    //       callbackUrl: "",
    //       endpoint: "",
    //       logoutUrl: "",
    //       grant_type: [],
    //       scopes: ""
    //     }
    //   } else {
    //     delete this.formApp.authentication_info;
    //   }
    // }
  }
};
</script>

<style scoped>
.btn-retour {
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

.btn-creer {
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

.errors {
  margin: 0;
  position: absolute;
  /* background-color: red; */
  /* position: absolute; */
  transform: translate(0, -10%);
  font-size: 10px;
  color: red;
  padding-left: 2px;
  letter-spacing: 1.1px;
}

.error {
  position: absolute;
  color: rgb(255, 0, 0);
  font: normal normal normal 11px/13px Charlevoix Pro;
}

.showspan {
  display: none;
}

.v-application {
  background-color: #21435300;
}

.formulaire {
  /* padding-left: 25%;
  padding-right: 25%;
  padding-bottom: 20px; */
  width: 100%;
  height: 100%;
  font-size: 14px;
}

.formulaire .formulaire_info {
  width: 100%;
  height: calc(100% - 100px);
  display: flex;
  justify-content: space-around;
}

.formulaire .formulaire_info .left_side,
.formulaire .formulaire_info .right_side {
  width: calc(50% - 20px);
  height: 100%;
}

.loginServerContainer {
  width: 100%;
  height: 350px;
  margin-top: 20px;
  padding: 5px;
  overflow: auto;
}

.serverItem {
  display: flex;
  border: 1px solid grey;
  align-items: center;
  padding: 5px;
  margin-top: 5px;
  border-radius: 10px;
}

.selector {
  display: flex;
  align-items: center;
}

.selector .icon {
  margin-right: 10px;
}

.selector .name {
  font-size: 1em;
}

.serverBtn {
  border-radius: 10px;
  height: 42px;
  width: 45px;
}

.serverBtn.delete {
  color: #ff4500 !important;
  border: 1px solid #ff4500;
}

.serverBtn.add {
  color: #14202c !important;
  border: 1px solid #14202c;
}
</style>