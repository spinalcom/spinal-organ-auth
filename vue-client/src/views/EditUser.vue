<template>
  <v-app>
    <v-main>
      <BachupInformation title="">
        <form class="formulaire" novalidate @submit.prevent="validateUser">
          <div class="formContainer">
            <div class="title">Modifier un utilisateur</div>
            <InputUser title="NOM DE L'UTILISATEUR" id="userName" v-model="formUser.userName" />
            <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.userName.required">Un nom est
              requis</span>
            <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formUser.userName.minLength">Le nom
              d'utilisateur contenir au moins 3 caractères.
            </span>

            <SelectUser title="TYPE D'UTILISATEUR" id="userType" :tab="userType" v-model="formUser.userType"
              :value="formUser.userType" />

            <InputUser title="EMAIL" id="email" v-model="formUser.email" />
            <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.email.required">Un Email est
              requis</span>
            <InputUser title="TELEPHONE" id="telephone" v-model="formUser.telephone" />
            <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.telephone.required">Un numero de
              téléphone est requis</span>
            <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formUser.telephone.numeric">Le numéro de
              téléphone doit être composé uniquement de
              chiffre.</span>
            <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formUser.telephone.minLength">Le numero
              de
              telephone est invalide</span>
            <TextareaUser title="INFORMATION" id="information" v-model="formUser.info" />
            <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.info.required">Une information est
              requise</span>

            <div v-for="(platform, index) in newuserplatform" class="mt-5 platform-valid">
              <!-- <span style="position: absolute; margin-top: -45px" class="errors" :class="{ showspan: !error_platform }">
                Liez au moins un profile à cet utilisateur.
              </span> -->

              <div class="selector">
                <InputUser :readonly="true" title="PLATEFORME" id="telephone" :value="platform.platformName" />
                <InputUser :readonly="true" title="PROFIL D'UTILISATEUR" id="telephone"
                  :value="platform.userProfile.userProfileName" />
              </div>
              <button @click="deletePlatformObjectitem(index)" type="button" class="red-cross">
                X
              </button>
            </div>


            <div class="noPlatform" v-if="newuserplatform.length === 0">
              Aucune plateforme n'est liée à cet utilisateur.
            </div>

          </div>


          <div class="footer">
            <div class="btn-retour" @click="cancelAdd()">RETOUR</div>
            <button type="submit" class="btn-creer">
              MODIFIER L'UTILISATEUR
            </button>
          </div>
        </form>
      </BachupInformation>
    </v-main>
  </v-app>
</template>

<script>
import BachupInformation from "../Components/BackupInformation.vue";
import InputUser from "../Components/InputUser";
import InputPass from "../Components/InputPassword";
import SelectUser from "../Components/SelectUser.vue";
import AddPlatform from "../Components/AddPlatform";
import TextareaUser from "../Components/TextareaUser.vue";

import { validationMixin } from "vuelidate";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    TextareaUser,
    BachupInformation,
    InputUser,
    InputPass,
    SelectUser,
    AddPlatform,
  },
  data() {
    return {
      newuserplatform: [],
      formUser: {
        userName: null,
        telephone: null,
        email: null,
        info: null,
        userType: null,
        platformList: null,
      },
      userType: [
        {
          name: "Simple User",
        },
        {
          name: "Super User",
        },
      ],
      iserrors: true,
    };
  },
  validations: {
    formUser: {
      userName: {
        required,
        minLength: minLength(3),
      },
      email: {
        email,
      },
      info: {
        // required,
      },
      telephone: {
        // required,
        numeric,
        minLength: minLength(8),
      },
      userType: {
        required,
      },
    },
  },
  methods: {
    deletePlatformObjectitem(index) {
      if (this.newuserplatform.hasOwnProperty(index)) {
        this.newuserplatform.splice(index, 1);
      }
      console.log(this.newuserplatform);
    },

    cancelAdd() {
      // this.$router.push("/UsersList");
      this.$router.go(-1);
    },

    async updateUserform() {
      await this.$store.dispatch("users/getUser", this.$route.query.id);
      console.log("this.detailUser", this.detailUser);
      this.formUser.userName = this.detailUser.userName;
      this.formUser.telephone = this.detailUser.telephone;
      this.formUser.email = this.detailUser.email;
      this.formUser.info = this.detailUser.info;
      this.formUser.userType = this.detailUser.userType;
      this.newuserplatform = this.detailUser.platformList;
    },

    ...mapActions({ updateUser: "users/updateUser" }),

    async validateUser() {
      // await this.$refs.refplatform.maFonction();
      this.$v.$touch();

      if (!this.$v.$invalid) {
        var objectBody = {
          userName: this.formUser.userName,
          email: this.formUser.email,
          telephone: this.formUser.telephone,
          info: this.formUser.info,
          userType: this.getUserType(this.formUser.userType),
          platformList: this.newuserplatform.map((el) => {
            return {
              platformId: el.platformId,
              platformName: el.platformName,
              userProfile: {
                userProfileAdminId: el.userProfile.userProfileAdminId,
                userProfileBosConfigId: el.userProfile.userProfileBosConfigId,
                userProfileName: el.userProfile.userProfileName,
              },
            };
          }),
        };

        var profile = [objectBody, this.$route.query.id];
        await this.updateUser(profile);
      } else {
        this.iserrors = false;
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
      detailUser: "users/detailUser",
      platformObjectList: "users/selectedplatformObjectList",
    }),
  },
  created() {
    this.updateUserform();
  },
};
</script>

<style scoped>
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

.formulaire {
  width: 50%;
  height: 100%;
  margin: auto;
}

.formulaire .title {
  font-size: 2em !important;
  font-weight: 500;
  letter-spacing: .0125em !important;
  text-align: center;
}

.formulaire .formContainer {
  width: 100%;
  height: calc(100% - 100px);
  overflow: auto;
}

.formulaire .footer {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}


.noPlatform {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  color: #14202c;
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
  font-siplatform_copiee: 15px;
  padding-top: 2px;
  transition: 0.2s;
}

.entrance {
  animation: slideInFromTop 0.4s ease-in-out;
}

@keyframes slideInFromTop {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.btn-retour {
  border: 1px solid #14202c;
  border-radius: 6px;
  width: 120px;
  height: 40px;
  margin-right: 10px;
  margin-top: 20px;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.btn-creer {
  min-height: 35px;
  border: 0px;
  padding-left: 30px;
  padding-right: 30px;
  background: #14202c;
  border-radius: 6px;
  color: white;
  /* margin-left: 5px; */
  margin-top: 20px;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
}

.fade_in {
  animation: fadeIn 0.4s ease-in-out;
}

.errors {
  position: absolute;
  color: rgb(255, 0, 0);
  font: normal normal normal 11px/13px Charlevoix Pro;
}

.showspan {
  display: none;
}
</style>