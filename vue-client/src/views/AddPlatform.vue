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
            v-if="!$v.formApp.name.minLength"
            >Nom invalide</span
          >
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-else-if="!$v.formApp.name.required"
            >Un nom est requis</span
          >

          <InputUser
            title="L'URL DE LA PLATEFORME"
            id="appName"
            v-model="formApp.redirectURI"
          />
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="
              !$v.formApp.redirectURI.minLength && $v.formApp.redirectURI.format
            "
            >le lien de redirection est invalide</span
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
        redirectURI: null,
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
      redirectURI: {
        minLength: minLength(3),
        format: (value) => {
          return /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/.test(
            value
          );
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
    ...mapActions({ saveApp: "applications/saveApp" }),

    async validateApp() {
      await this.$refs.refplatform.maFonction();
      this.$v.$touch();
      if (!this.$v.$invalid) {
        var objectBody = {
          name: this.formApp.appName,
          clientId: this.formApp.clientId,
          clientSecret: this.formApp.clientSecret,
          appType: this.formApp.appType,
          platformList: this.platformObjectList.map((el) => {
            return {
              platformId: el.platformId,
              appProfile: {
                name: el.appProfile.name,
                appProfileId: el.appProfile.appProfileId,
              },
            };
          }),
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