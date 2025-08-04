<template>
  <v-app>
    <BackupInformation title="">
      <form class="formulaire" novalidate @submit.prevent="validateApp">
        <div class="formContainer">
          <div class="title">Ajouter une application</div>
          <InputUser title="NOM DE L'APPLICATION" id="appName" v-model="formApp.appName" />
          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.appName.required">le nom de
            l'application est requis</span>

          <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formApp.appName.minLength">Le nom doit
            contenir au moins 3 caractères</span>

          <InputUser title="URL DE REDIRECTION L'APPLICATION" id="redirectUri" v-model="formApp.redirectUri" />

          <!-- <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.redirectUri.required">l'url de
            redirection d'application est requis</span> -->
          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.redirectUri.invalid">
            l'url est invalid
          </span>

          <InputPass readonly="true" title="CLIENT ID" id="clientId" v-model="formApp.clientId" />
          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.clientId.required">
            un id client est requis
          </span>

          <InputPass readonly="true" title="CLIENT SECRET" id="clientSecret" v-model="formApp.clientSecret" />
          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.clientSecret.required">Le mot de
            passe
            est nécessaire</span>

          <SelectGrant title="GRANT TYPES" id="grant_types" v-model="formApp.grant_types" />
          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.grant_types.isValid">Au moins un type
            d'autorisation est nécessaire</span>

          <div class="accessList">
            <!-- <p class="mt-6">Sélectionnez les accès de plateformes.</p> -->
            <span style="position: absolute; margin-top: -45px" class="errors" :class="{ showspan: !error_platform }">
              Les accès aux utilisateurs sont incorrects.
            </span>
            <AddPlatform :types="'app'" @change="setPlatformList" />
          </div>

        </div>


        <div class="d-flex justify-end">
          <button class="btn-retour" @click="cancelAdd()">RETOUR</button>
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
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";

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
        clientId: this.generateRegisterKey(),
        clientSecret: this.generateRegisterKey(),
        appType: "app",
        grant_types: [],
      },
      platformList: [],

      iserrors: true,
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
        invalid(value) {
          if (!value) return true; // If no value, skip validation
          const regex =
            /https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))/gm;
          return regex.test(value);
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
    cancelAdd() {
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
            appProfileId: profileSelected.appProfileId

          }
        }
      });
    },

    generateRegisterKey() {
      const generator = require("generate-password");
      var registerKey = generator.generate({
        length: 30,
        numbers: true,
      });
      return registerKey;
    },

    ...mapActions({ saveApp: "applications/saveApp" }),

    async validateApp() {
      // await this.$refs.refplatform.maFonction();

      if (this.platformList.length == 0) {
        this.error_platform = true;
        return;
      }

      if (!this.$v.$invalid) {
        var objectBody = {
          name: this.formApp.appName,
          clientId: this.formApp.clientId,
          clientSecret: this.formApp.clientSecret,
          grant_types: this.formApp.grant_types,
          // appType: this.formApp.appType,
          redirectUri: this.formApp.redirectUri,
          platformList: this.platformList
          // platformList: this.platformObjectList.map((el) => {
          //   return {
          //     platformId: el.platformId,
          //     appProfile: {
          //       name: el.appProfile.name,
          //       appProfileId: el.appProfile.appProfileId,
          //     },
          //   };
          // }),
        };
        this.saveApp(objectBody);
      } else {
        this.iserrors = false;
      }
    },
  },
  computed: {
    ...mapGetters({
      platformObjectList: "applications/selectedplatformObjectList",
    }),
  },
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
  /* min-height: 200px; */
}
</style>