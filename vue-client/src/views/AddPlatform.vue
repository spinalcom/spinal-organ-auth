<template>
  <v-app>
    <v-main>
      <BackupInformation title="" class="add_platform_card">
        <form class="formulaire" novalidate @submit.prevent="submitForm">
          <div class="formulaire_info">
            <div class="title">AJOUTER UNE PLATEFORME</div>

            <div class="left_side">
              <!-- <p>Saisissez les informations de la plateforme.</p> -->
              <InputUser title="NOM DE LA PLATEFORME" id="appName" v-model="formApp.name" />

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.name.required">Un nom est
                requis</span>
              <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formApp.name.minLength">Le nom doit
                contenir au moins 3 caractères.</span>

              <InputUser title="L'URL  DE LA PLATEFORME" id="appName" v-model="formApp.url" />

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.url.required">L'URL de la
                plateforme est requise.</span>

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.url.format">L'URL de la plateforme
                est invalide.</span>

              <!-- <InputUser title="L'URL DE MIS A JOUR DE LA PLATEFORME" id="appName" v-model="formApp.url"
                :placeholder="'http://lienApi/api/v1/update_data'" />

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.url.required">L'url de mis à jour
                est requis</span>

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.url.format">l'url de mis à jour est
                invalide</span> -->

              <!-- <InputUser title="L'URL DE REDIRECTION DE LA PLATEFORME" id="appName" v-model="formApp.redirectUrl"
                :placeholder="'http://lienApi/callback'" />

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.redirectUrl.required">L'url de
                redirection est requis</span>

              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.redirectUrl.format">l'url de
                redirection est invalide</span> -->

              <InputPass readonly="true" title="CLIENT ID" id="clientId" v-model="formApp.clientId" />
              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.clientId.required">Un ID client est
                requis.</span>

              <InputPass readonly="true" title="CLIENT SECRET" id="clientSecret" v-model="formApp.clientSecret" />
              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.clientSecret.required">
                Le secret client est requis.
              </span>

              <SelectGrant title="GRANT TYPES" id="grant_types" v-model="formApp.grant_types" />
              <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.grant_types.isValid">Au moins un
                type d'autorisation est requis.</span>

              <div class="loginServerContainer">
                <h5 class="title">
                  Ajouter le(s) serveur(s) d'authentification
                </h5>

                <div v-for="item in servers" :key="item.id" class="serverItem">
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
                    <v-icon color="red">mdi-trash-can-outline</v-icon>
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
          </div>

          <div class="footer">
            <button type="button" class="btn-retour" @click="goBack()">
              ANNULER
            </button>
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
import InputPass from "../Components/InputPassword";
import BackupInformation from "../Components/BackupInformation.vue";
import SelectGrant from "../Components/SelectGrants.vue";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { URL_REGEX, generateRegisterKey } from "../services/formUtils";

export default {
  mixins: [validationMixin],
  components: {
    InputUser,
    InputPass,
    BackupInformation,
    SelectGrant,
  },
  data() {
    return {
      formApp: {
        grant_types: [],
        name: null,
        clientId: generateRegisterKey(),
        clientSecret: generateRegisterKey(),
        redirectUrl: null,
        url: null,
        loginServerIds: [],
        // authentication_method: "",
        // authentication_info: {}
      },
      iserrors: true,
    };
  },
  async mounted() {
    await this.getAllServers();
    this.selectLocalServer();
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
      /*redirectUrl: {
        required,
        format: (value) => {
          const regex =
            /https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))/gm;
          return regex.test(value);
        },
      },*/
      url: {
        required,
        format: (value) => {
          return URL_REGEX.test(value);
        },
      },
      grant_types: {
        required,
        format: (value) => {
          return value.length > 0;
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
    ...mapActions({
      savePlatform: "platforms/savePlatform",
      getAllServers: "serverLogin/getAllServers",
    }),

    goBack() {
      // this.$router.push("/PlatformsList");
      this.$router.go(-1);
    },
    cleanUrl(url) {
      if (!url) return url;
      let sanitized = url.trim();
      if (!/^https?:\/\//i.test(sanitized)) {
        sanitized = `https://${sanitized}`;
      }
      sanitized = sanitized.replace(/\/+$/, "");
      return sanitized;
    },

    async submitForm() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.iserrors = false;
        return;
      }

      const cleanedUrl = this.cleanUrl(this.formApp.url);
      const payload = {
        ...this.formApp,
        url: `${cleanedUrl}/api/v1/update_data`,
        redirectUrl: `${cleanedUrl}/callback`,
      };

      this.savePlatform(payload)
        .then(() => {
          // this.$router.push("/PlatformsList");
          this.$router.go(-1);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    selectLocalServer() {
      const found = this.servers.find(
        (server) => server.authentication_method === "local"
      );
      if (found) this.linkItem(found);
    },

    isLinked(item) {
      return this.formApp.loginServerIds.indexOf(item.id) !== -1;
    },

    linkItem(item) {
      this.formApp.loginServerIds = [...this.formApp.loginServerIds, item.id];
    },

    unlinkItem(item) {
      this.formApp.loginServerIds = this.formApp.loginServerIds.filter(
        (el) => el !== item.id
      );
    },
  },

  computed: {
    ...mapGetters({ servers: "serverLogin/servers" }),
  },
};
</script>

<style scoped>
@import "../assets/form-common.css";

.add_platform_card {
  height: calc(100% - 150px) !important;
}

.btn-retour {
  opacity: 1;
  margin-right: 5px;
}

.btn-creer {
  margin-left: 5px;
}

.errors {
  margin: 0;
  transform: translate(0, -10%);
  font-size: 10px;
  padding-left: 2px;
  letter-spacing: 1.1px;
}

.error {
  position: absolute;
  color: rgb(255, 0, 0);
  font: normal normal normal 11px/13px Charlevoix Pro;
}

.v-application {
  background-color: #21435300;
}

.formulaire {
  width: 50%;
  height: 100%;
  font-size: 14px;
  margin: auto;
}

.formulaire .formulaire_info {
  width: 100%;
  height: calc(100% - 160px);
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.formulaire .footer {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-content: center;
}

.formulaire .formulaire_info .left_side,
.formulaire .formulaire_info .right_side {
  width: 100%;
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
