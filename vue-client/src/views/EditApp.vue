<template>
  <v-app>
    <BackupInformation title="">
      <form class="formulaire" novalidate @submit.prevent="submitForm">
        <div class="formContainer">
          <div class="title">Modifier une application</div>
          <InputUser title="NOM DE L'APPLICATION" id="appName" v-model="formApp.appName" />
          <span class="errors" v-if="$v.formApp.appName.$error && !$v.formApp.appName.required">Le nom de
            l'application est requis.</span>

          <span class="errors" v-else-if="$v.formApp.appName.$error && !$v.formApp.appName.minLength">Le nom doit
            contenir au moins 3 caractères</span>

          <InputUser title="URL DE REDIRECTION L'APPLICATION" id="redirectUri" v-model="formApp.redirectUri" />

          <span class="errors" v-if="$v.formApp.redirectUri.$dirty && !$v.formApp.redirectUri.isValidUrl">
            L'URL est invalide.
          </span>

          <InputPass readonly="true" title="CLIENT ID" id="clientId" v-model="formApp.clientId" />
          <span class="errors" v-if="$v.formApp.clientId.$error && !$v.formApp.clientId.required">
            Un ID client est requis.
          </span>

          <InputPass readonly="true" title="CLIENT SECRET" id="clientSecret" v-model="formApp.clientSecret" />
          <span class="errors" v-if="$v.formApp.clientSecret.$error && !$v.formApp.clientSecret.required">Le secret
            client
            est requis.</span>

          <SelectGrant title="GRANT TYPES" id="grant_types" v-model="formApp.grant_types" />
          <span class="errors" v-if="$v.formApp.grant_types.$error && !$v.formApp.grant_types.isValid">Au moins un type
            d'autorisation est requis.</span>

          <div class="accessList">
            <div v-for="(platform, index) in newappplatform" :key="platform.platformId || index"
              class="mt-5 platform-valid">
              <div class="selector">
                <InputUser :readonly="true" title="PLATEFORME" id="telephone" :value="platform.platformName" />
                <InputUser :readonly="true" title="PROFIL D'UTILISATEUR" id="telephone"
                  :value="platform.appProfile.appProfileName" />
              </div>
              <button @click="deletePlatformObjectitem(index)" type="button" class="red-cross">
                X
              </button>
            </div>
            <span class="errors" v-if="error_platform">
              Les accès aux utilisateurs sont incorrects.
            </span>
          </div>
        </div>

        <div class="d-flex justify-end">
          <button type="button" class="btn-retour" @click="goBack()">
            ANNULER
          </button>
          <button type="submit" class="btn-creer">
            Modifier L'APPLICATION
          </button>
        </div>
      </form>
    </BackupInformation>
  </v-app>
</template>

<script>
import BackupInformation from "../Components/BackupInformation.vue";
import InputUser from "../Components/InputUser";
import InputPass from "../Components/InputPassword";
import SelectGrant from "../Components/SelectGrants.vue";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { URL_REGEX } from "../services/formUtils";

export default {
  name: "App",
  mixins: [validationMixin],
  components: {
    BackupInformation,
    InputUser,
    InputPass,
    SelectGrant,
  },
  data() {
    return {
      newappplatform: [],
      formApp: {
        appName: "",
        redirectUri: "",
        clientId: "",
        clientSecret: "",
        appType: "app",
        grant_types: [],
      },
      error_platform: false,
    };
  },
  validations: {
    formApp: {
      appName: {
        required,
        minLength: minLength(3),
      },
      clientId: {
        required,
      },
      clientSecret: {
        required,
      },
      redirectUri: {
        isValidUrl(value) {
          if (!value) return true;
          return URL_REGEX.test(value);
        },
      },
      grant_types: {
        isValid(value) {
          return value.length > 0;
        },
      },
    },
  },
  methods: {
    ...mapActions({ updateApp: "applications/updateApp" }),

    deletePlatformObjectitem(index) {
      if (Object.prototype.hasOwnProperty.call(this.newappplatform, index)) {
        this.newappplatform.splice(index, 1);
      }
    },

    goBack() {
      this.$router.go(-1);
    },

    async loadFormData() {
      await this.$store.dispatch("applications/getApp", this.$route.query.id);
      this.formApp.appName = this.detailApp.name;
      this.formApp.clientId = this.detailApp.clientId;
      this.formApp.clientSecret = this.detailApp.clientSecret;
      this.formApp.redirectUri = this.detailApp.redirectUrl || this.detailApp.redirectUri;
      this.formApp.grant_types = this.detailApp.grant_types;
      this.newappplatform = [...(this.detailApp.platformList || [])];
    },

    async submitForm() {
      this.$v.$touch();
      this.error_platform = this.newappplatform.length === 0;

      if (this.$v.$invalid || this.error_platform) return;

      const payload = {
        name: this.formApp.appName,
        clientId: this.formApp.clientId,
        clientSecret: this.formApp.clientSecret,
        grant_types: this.formApp.grant_types,
        redirectUri: this.formApp.redirectUri,
        platformList: this.newappplatform.map((el) => {
          return {
            platformId: el.platformId,
            appProfile: {
              appProfileAdminId: el.appProfile.appProfileAdminId,
              appProfileBosConfigId: el.appProfile.appProfileBosConfigId,
              appProfileName: el.appProfile.appProfileName,
            },
          };
        }),
      };

      const updateArgs = [payload, this.$route.query.id];
      this.updateApp(updateArgs);
    },
  },
  computed: {
    ...mapGetters({
      detailApp: "applications/detailApp",
    }),
  },
  created() {
    this.loadFormData();
  },
};
</script>

<style scoped>
@import "../assets/form-common.css";

.v-application {
  background-color: #d6e2e600;
}

.formulaire {
  padding-left: 25%;
  padding-right: 25%;
  padding-bottom: 20px;
}

.btn-retour {
  margin-right: 5px;
}

.btn-creer {
  margin-left: 5px;
}

.errors {
  position: static;
  display: block;
  margin: 0;
  transform: none;
  font-size: 10px;
  padding-left: 4px;
  letter-spacing: 1.1px;
}

.red-cross {
  margin-top: 22px;
  margin-left: 10px;
  border-radius: 10px;
  height: 42px;
  width: 45px;
  color: orangered;
  border: 1px solid orangered;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 15px;
  padding-top: 2px;
  transition: 0.2s;
}

.platform-valid {
  width: 99%;
  height: 150px;
  background-color: #e0eee5;
  border-radius: 6px;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
}

.selector {
  position: relative;
  width: 100%;
}
</style>
