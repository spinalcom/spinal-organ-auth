<template>
  <v-card class="userListCard" elevation="4">
    <form class="formulaire" novalidate @submit.prevent="submitForm">
      <div class="formContainer">
        <div class="formTitle">AJOUTER UN UTILISATEUR</div>
        <!-- <p style="margin: 0">Saisissez les informations de l’utilisateur.</p>
      <p style="margin: 0">Un e-mail lui sera envoyé pour confirmer son inscription. </p> -->
        <InputUser title="NOM DE L'UTILISATEUR" id="userName" v-model="formUser.userName" />
        <span class="errors" v-if="$v.formUser.userName.$error && !$v.formUser.userName.required">Un nom est
          requis</span>
        <span class="errors" v-else-if="$v.formUser.userName.$error && !$v.formUser.userName.minLength">Le nom
          d'utilisateur doit contenir au moins 3 caractères.
        </span>

        <InputPass title="MOT DE PASSE" id="password" v-model="formUser.password" :generate="true"
          @generate="generatePassword" />
        <span class="errors" v-if="$v.formUser.password.$error && !$v.formUser.password.required">Le mot de passe est
          obligatoire.</span>
        <span class="errors" v-else-if="$v.formUser.password.$error && !$v.formUser.password.minLength">Le mot de passe
          doit contenir au moins 8 caractères.</span>

        <InputPass title="CONFIRMER MOT DE PASSE" id="confirmPassword" v-model="formUser.confirm_password" />
        <span class="errors" v-if="$v.formUser.confirm_password.$error && !$v.formUser.confirm_password.required">La
          confirmation de mot de passe est obligatoire.</span>
        <span class="errors"
          v-else-if="$v.formUser.confirm_password.$error && !$v.formUser.confirm_password.minLength">La
          confirmation doit contenir au moins 8 caractères.</span>
        <span class="errors" v-else-if="conf_pass">
          La confirmation de mot de passe doit être identique au mot de passe.
        </span>

        <SelectUser title="TYPE D'UTILISATEUR" id="userType" :tab="userType" v-model="formUser.userType"
          :value="formUser.userType" />

        <InputUser title="EMAIL" id="Email" v-model="formUser.email" />
        <span class="errors" v-if="$v.formUser.email.$dirty && formUser.email && !$v.formUser.email.email">Format
          d'email
          incorrect.</span>

        <InputUser title="TELEPHONE" id="telephone" v-model="formUser.telephone" />
        <span class="errors"
          v-if="$v.formUser.telephone.$dirty && formUser.telephone && !$v.formUser.telephone.numeric">Le numéro de
          téléphone doit être composé uniquement de
          chiffre.</span>

        <TextareaUser title="INFORMATION" id="information" v-model="formUser.info" />

        <div class="platformsAuthorized">
          <!-- <AddPlatform :types="'user'" ref="refplatform" @maFonction="validateUser" /> -->
          <AddPlatform :types="'user'" @change="setPlatformList" />
          <span class="errors platformError" v-if="error_platform">
            Les accès aux utilisateurs sont incorrects.
          </span>
        </div>
      </div>

      <div class="buttons">
        <v-btn color="red" outlined class="btn-retour" @click="goBack()">ANNULER</v-btn>
        <v-btn type="submit" color="success" dark outlined class="btn-creer">CRÉER L'UTILISATEUR</v-btn>
      </div>
    </form>
  </v-card>
</template>

<script>
import InputUser from "../Components/InputUser";
import SelectUser from "../Components/SelectUser.vue";
import TextareaUser from "../Components/TextareaUser.vue";
import InputPass from "../Components/InputPassword";
import AddPlatform from "../Components/AddPlatform";
import { validationMixin } from "vuelidate";
import { required, minLength, email, numeric } from "vuelidate/lib/validators";
import { mapActions } from "vuex";
import { USER_TYPES } from "../services/formUtils";

export default {
  mixins: [validationMixin],
  components: {
    InputUser,
    SelectUser,
    TextareaUser,
    InputPass,
    AddPlatform,
  },

  data() {
    return {
      formUser: {
        userName: "",
        password: "",
        confirm_password: "",
        telephone: "",
        email: "",
        info: "",
        userType: { name: "Simple User" },
      },
      error_platform: false,
      userType: USER_TYPES,
      conf_pass: false,
      platformList: [],
    };
  },

  validations: {
    formUser: {
      userName: {
        required,
        minLength: minLength(3),
      },
      password: {
        required,
        minLength: minLength(8),
      },
      confirm_password: {
        required,
        minLength: minLength(8),
      },
      email: {
        email,
      },
      // info: {
      //   // required,
      // },
      telephone: {
        numeric,
      },
      // userType: {
      //   required,
      // },
    },
  },

  methods: {
    generatePassword() {
      const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      const lower = "abcdefghijkmnopqrstuvwxyz";
      const numbers = "23456789";
      const symbols = "!@#$%*_-";
      const allChars = upper + lower + numbers + symbols;

      const pick = (chars) => chars[Math.floor(Math.random() * chars.length)];
      const passwordChars = [
        pick(upper),
        pick(lower),
        pick(numbers),
        pick(symbols),
      ];

      for (let i = passwordChars.length; i < 12; i += 1) {
        passwordChars.push(pick(allChars));
      }

      for (let i = passwordChars.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = passwordChars[i];
        passwordChars[i] = passwordChars[j];
        passwordChars[j] = tmp;
      }

      const generatedPassword = passwordChars.join("");
      this.formUser.password = generatedPassword;
      this.formUser.confirm_password = generatedPassword;
      this.conf_pass = false;
    },

    buildUserPayload() {
      return {
        userName: this.formUser.userName,
        password: this.formUser.password,
        email: this.formUser.email,
        telephone: this.formUser.telephone,
        info: this.formUser.info,
        userType: this.getUserType(this.formUser.userType) || "Simple User",
        platformList: this.platformList,
      };
    },

    goBack() {
      this.$router.go("-1");
      // this.$router.push("/UsersList");
    },

    ...mapActions({ saveUser: "users/saveUser" }),

    setPlatformList(list) {
      this.platformList = list.map(({ platformSelected, profileSelected }) => {
        return {
          platformId: platformSelected.id,
          platformName: platformSelected.name,
          userProfile: {
            name: profileSelected.name,
            userProfileId: profileSelected.userProfileId,
          },
        };
      });
    },
    async submitForm() {
      this.$v.$touch();
      this.conf_pass =
        this.formUser.confirm_password !== this.formUser.password;

      if (this.platformList.length === 0) {
        this.error_platform = true;
      } else {
        this.error_platform = false;
      }

      if (this.$v.$invalid || this.conf_pass || this.error_platform) return;

      this.saveUser(this.buildUserPayload());
    },

    getUserType(userType) {
      if (!userType) return "Simple User";
      if (userType.name) return userType.name;
      return userType;
    },
  },
};
</script>

<style scoped>
@import "../assets/form-common.css";

.userListCard {
  width: calc(100% - 30px);
  margin: auto;
  height: calc(100vh - 100px);
  background: transparent !important;
  display: flex;
  align-content: center;
}

.formulaire {
  width: 50%;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.formContainer {
  width: 100%;
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  overflow: auto;
}

.formTitle {
  font-size: 1.5em;
  margin-bottom: 10px;
  margin-top: 10px;
  text-align: center;
}

.platformsAuthorized {
  min-height: 300px;
  height: 350px;
  overflow: auto;
}

.errors {
  position: static;
  display: block;
  margin: 2px 0 6px;
  transform: none;
  font-size: 10px;
  padding-left: 4px;
  letter-spacing: 1.1px;
}

.platformError {
  margin-top: 8px;
}

.v-application {
  background-color: #d6e2e600;
}

.buttons {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.btn-retour {
  opacity: 1;
  margin-right: 5px;
  font-size: 10px;
  transition: 0.1s;
}

.btn-retour:hover {
  background-color: #e2e2e2;
}

.btn-creer {
  margin-left: 5px;
  font-size: 10px;
  transition: 0.1s;
  border: 1px solid #14202c;
  transition: 0.1s;
}

.btn-creer:hover {
  background-color: #e2e2e2;
  color: #14202c;
}
</style>
