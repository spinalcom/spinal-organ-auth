<template>
  <v-app>
    <BackupInformation title="">
      <form class="formulaire" novalidate @submit.prevent="submitForm">
        <div class="formContainer">
          <div class="title">Ajouter une application</div>
          <InputUser title="NOM DE L'APPLICATION" id="appName" v-model="formApp.appName" />
          <span class="errors" v-if="$v.formApp.appName.$error && !$v.formApp.appName.required">Le nom de
            l'application est requis.</span>

          <span class="errors" v-else-if="$v.formApp.appName.$error && !$v.formApp.appName.minLength">Le nom doit
            contenir au moins 3 caractères</span>

          <InputUser title="URL DE REDIRECTION L'APPLICATION" id="redirectUri" v-model="formApp.redirectUri" />

          <!-- <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.redirectUri.required">l'url de
            redirection d'application est requis</span> -->
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
            <!-- <p class="mt-6">Sélectionnez les accès de plateformes.</p> -->
            <span class="errors" v-if="error_platform">
              Les accès aux utilisateurs sont incorrects.
            </span>
            <AddPlatform :types="'app'" @change="setPlatformList" />
          </div>
        </div>

        <div class="d-flex justify-end">
          <button type="button" class="btn-retour" @click="goBack()">
            ANNULER
          </button>
          <button type="submit" class="btn-creer">CRÉER L’APPLICATION</button>
        </div>
      </form>
    </BackupInformation>
  </v-app>
</template>

<script>
import InputUser from "../Components/InputUser";
import InputPass from "../Components/InputPassword";
import SelectGrant from "../Components/SelectGrants.vue";
import AddPlatform from "../Components/AddPlatform.vue";
import BackupInformation from "../Components/BackupInformation.vue";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { mapActions } from "vuex";
import { URL_REGEX, generateRegisterKey } from "../services/formUtils";

export default {
  mixins: [validationMixin],
  components: {
    InputUser,
    InputPass,
    AddPlatform,
    BackupInformation,
    SelectGrant,
  },
  data() {
    return {
      formApp: {
        appName: "",
        redirectUri: "",
        clientId: generateRegisterKey(),
        clientSecret: generateRegisterKey(),
        appType: "app",
        grant_types: [],
      },
      platformList: [],
      error_platform: false,
    };
  },

  validations: {
    formApp: {
      appName: {
        required,
        minLength: minLength(3),
      },
      redirectUri: {
        isValidUrl(value) {
          if (!value) return true; // If no value, skip validation
          return URL_REGEX.test(value);
        },
      },
      clientId: {
        required,
      },
      clientSecret: {
        required,
      },
      grant_types: {
        isValid(value) {
          return value.length > 0;
        },
      },
      // appType: {
      //   required,
      // },
    },
  },

  methods: {
    goBack() {
      // this.$router.push("/UsersList");
      this.$router.go("-1");
    },

    setPlatformList(list) {
      this.platformList = list.map(({ platformSelected, profileSelected }) => {
        return {
          platformId: platformSelected.id,
          // platformName: platformSelected.name,
          appProfile: {
            name: profileSelected.name,
            appProfileId: profileSelected.appProfileId,
          },
        };
      });
    },

    ...mapActions({ saveApp: "applications/saveApp" }),

    async submitForm() {
      this.$v.$touch();
      this.error_platform = this.platformList.length === 0;

      if (this.$v.$invalid || this.error_platform) return;

      const payload = {
        name: this.formApp.appName,
        clientId: this.formApp.clientId,
        clientSecret: this.formApp.clientSecret,
        grant_types: this.formApp.grant_types,
        redirectUri: this.formApp.redirectUri,
        platformList: this.platformList,
      };
      this.saveApp(payload);
    },
  },
};
</script>

<style scoped>
@import "../assets/form-common.css";

.btn-retour {
  opacity: 1;
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

.error {
  position: absolute;
  color: rgb(255, 0, 0);
  font: normal normal normal 11px/13px Charlevoix Pro;
}

.formulaire {
  width: 50%;
  height: 100%;
  margin: auto;
}

.formulaire .formContainer {
  width: 100%;
  height: calc(100% - 100px);
  overflow: auto;
  padding: 20px;
}

.formulaire .footer {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.accessList {
  width: 100%;
  height: 230px;
  overflow: auto;
}
</style>
