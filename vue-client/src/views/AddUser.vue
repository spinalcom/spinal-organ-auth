<template>

  <v-card class="userListCard" elevation="4">

    <form class="formulaire" novalidate @submit.prevent="validateUser">
      <div class="formContainer">
        <div class="formTitle">
          AJOUTER UN UTILISATEUR
        </div>
        <!-- <p style="margin: 0">Saisissez les informations de l’utilisateur.</p>
      <p style="margin: 0">Un e-mail lui sera envoyé pour confirmer son inscription. </p> -->


        <InputUser title="NOM DE L'UTILISATEUR" id="userName" v-model="formUser.userName" />
        <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.userName.required">Un nom est
          requis</span>
        <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formUser.userName.minLength">Le nom
          d'utilisateur contenir au moins 3 caractères.
        </span>

        <InputPass title="MOT DE PASSE" id="password" v-model="formUser.password" />
        <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.password.required">Le mot de passe est
          obligatoire.</span>
        <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formUser.password.minLength">Mot de passe
          doit contenir au moins 8 caractères</span>

        <InputPass title="CONFIRMER MOT DE PASSE" id="confirmPassword" v-model="formUser.confirm_password" />
        <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.confirm_password.required">La
          confirmation de mot de passe est obligatoire.</span>
        <span class="errors" :class="{ showspan: iserrors }" v-if="conf_pass">
          La confirmation de mot de passe doit être identique au mot de passe.
        </span>
        <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formUser.confirm_password.minLength">Mot
          de passe doit contenir au moins 8 caractères</span>


        <SelectUser title="TYPE D'UTILISATEUR" id="userType" :tab="userType" v-model="formUser.userType"
          :value="formUser.userType" />
        <!-- <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.userType.required">
        The user type is required
      </span> -->


        <InputUser title="EMAIL" id="Email" v-model="formUser.email" />
        <!-- <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.email.required">Un Email est
        requis</span> -->



        <InputUser title="TELEPHONE" id="telephone" v-model="formUser.telephone" />
        <!-- <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.telephone.numeric">Le numéro de
        téléphone doit être composé uniquement de
        chiffre.</span>
      <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formUser.telephone.minLength">Le numero de
        telephone doit contenir au moins 8 caractères</span> -->


        <TextareaUser title="INFORMATION" id="information" v-model="formUser.info" />


        <!-- <div class="mt-6">
        <span> Sélectionner les accès de l'utilisateur</span>
      </div> -->

        <div class="platformsAuthorized">
          <!-- <AddPlatform :types="'user'" ref="refplatform" @maFonction="validateUser" /> -->
          <AddPlatform :types="'user'" @change="setPlatformList" />
          <span style="position: absolute; margin-top: -45px" class="errors" :class="{ showspan: !error_platform }">
            Les accès aux utilisateurs sont incorrects.
          </span>
        </div>
      </div>

      <div class="buttons">
        <v-btn color="red" outlined class="btn-retour" @click="cancelAdd()">RETOUR</v-btn>
        <v-btn type="submit" color="success" dark outlined class="btn-creer">CRÉER L'UTILISATEUR</v-btn>
      </div>
    </form>

  </v-card>

</template>

<script>
import InputUser from "../Components/InputUser";
import SelectUser from "../Components/SelectUser.vue";
import TextareaUser from "../Components/TextareaUser.vue";
import BachupInformation from "../Components/BackupInformation.vue";
import InputPass from "../Components/InputPassword";
import AddPlatform from "../Components/AddPlatform";
import { validationMixin } from "vuelidate";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";

export default {
  mixins: [validationMixin],
  components: {
    InputUser,
    SelectUser,
    TextareaUser,
    BachupInformation,
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
      iserrors: true,
      userType: [
        {
          name: "Simple User",
        },
        {
          name: "Super User",
        },
      ],
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
      // email: {
      //   required,
      //   email,
      // },
      // info: {
      //   // required,
      // },
      // telephone: {
      //   // required,
      //   numeric,
      //   minLength: minLength(8),
      // },
      // userType: {
      //   required,
      // },
    },
  },

  methods: {
    cancelAdd() {
      this.$router.push("/UsersList");
    },

    ...mapActions({ saveUser: "users/saveUser" }),

    setPlatformList(list) {
      this.platformList = list.map(({ platformSelected, profileSelected }) => {
        return {
          platformId: platformSelected.id,
          platformName: platformSelected.name,
          userProfile: {
            name: profileSelected.name,
            userProfileId: profileSelected.userProfileId

          }
        }
      });
    },
    async validateUser() {
      // await this.$refs.refplatform.maFonction();

      if (this.platformList.length == 0) {
        this.error_platform = true;
        return;
      }

      this.$v.$touch();

      if (!this.$v.$invalid && this.formUser.confirm_password == this.formUser.password) {
        var objectBody = {
          userName: this.formUser.userName,
          password: this.formUser.password,
          email: this.formUser.email,
          telephone: this.formUser.telephone,
          info: this.formUser.info,
          userType: this.getUserType(this.formUser.userType) || "Simple User",
          platformList: this.platformList

          // platformList: this.platformObjectList.map((el) => {
          //   return {
          //     platformId: el.platformId,
          //     userProfile: {
          //       name: el.userProfile.name,
          //       userProfileId: el.userProfile.userProfileId,
          //     },
          //   };
          // }),
        };

        this.saveUser(objectBody);
      } else {
        this.iserrors = false;
        if (this.formUser.confirm_password != this.formUser.password) {
          this.conf_pass = true;
        } else {
          this.conf_pass = false;
        }
      }
    },

    getUserType(userType) {
      if (!userType) return 'Simple User';
      if (userType.name) return userType.name;
      return userType;
    }
  },
  computed: {
    ...mapGetters({
      platformObjectList: "users/selectedplatformObjectList",
    }),
  },
};
</script>

<style scoped>
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
  justify-content: center;
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
  margin: 0;
  position: absolute;
  transform: translate(0, -10%);
  font-size: 10px;
  color: red;
  padding-left: 2px;
  letter-spacing: 1.1px;
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
  border: 1px solid #14202c;
  border-radius: 6px;
  opacity: 1;
  width: 120px;
  height: 40px;
  margin-right: 5px;
  margin-top: 20px;
  font-size: 10px;
  letter-spacing: 1.1px;
  transition: 0.1s;
}

.btn-retour:hover {
  background-color: #e2e2e2;
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
  font-size: 10px;
  letter-spacing: 1.1px;
  transition: 0.1s;
  border: 1px solid #14202c;
  transition: 0.1s;
}

.btn-creer:hover {
  background-color: #e2e2e2;
  color: #14202c;
}

.showspan {
  display: none;
}



.showspan {
  display: none;
}
</style>