<template>
  <v-app>
    <v-main>
      <BackupInformation title="AJOUTER UNE PLATEFORME">
        <form class="formulaire" novalidate @submit.prevent="validateApp">
          <p>Rentrez les informations de la plateforme.</p>
          <InputUser
            title="NOM DE LA PLATEFORME"
            id="appName"
            v-model="formApp.name"
          />

          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formApp.name.required"
            >Un nom est requis</span
          >
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-else-if="!$v.formApp.name.minLength"
            >Le doit contenir au moins 2 caractères</span
          >

          <InputUser
            title="L'URL DE MIS A JOUR DE LA PLATEFORME"
            id="appName"
            v-model="formApp.url"
          />

          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formApp.url.required"
            >L'url de mis à jour est requis</span
          >

          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formApp.url.minLength && $v.formApp.url.format"
            >l'url de mis à jour est invalide</span
          >

          <InputUser
            title="L'URL DE REDIRECTION DE LA PLATEFORME"
            id="appName"
            v-model="formApp.redirectUrl"
          />

          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formApp.redirectUrl.required"
            >L'url de redirection est requis</span
          >

          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="
              !$v.formApp.redirectUrl.minLength && $v.formApp.redirectUrl.format
            "
            >l'url de redirection est invalide</span
          >

          <InputPass
            readonly="true"
            title="CLIENT ID"
            id="clientId"
            v-model="formApp.clientId"
          />
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formApp.clientId.required"
            >un id client est requis</span
          >

          <InputPass
            readonly="true"
            title="CLIENT SECRET"
            id="clientSecret"
            v-model="formApp.clientSecret"
          />
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formApp.clientSecret.required"
          >
            Le mot de passe est nécessaire
          </span>

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
import InputPass from "../Components/InputPassword";
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
  },
  data() {
    return {
      formApp: {
        name: null,
        clientId: this.generateRegisterKey(),
        clientSecret: this.generateRegisterKey(),
        redirectUrl: null,
        url: null,
      },
      iserrors: true,
      error_platform: false,
    };
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
    },
  },

  methods: {
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
    ...mapActions({ savePlatform: "platforms/savePlatform" }),

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

.v-application {
  background-color: #21435300;
}

.formulaire {
  padding-left: 25%;
  padding-right: 25%;
  padding-bottom: 20px;
  font-size: 14px;
}
</style>