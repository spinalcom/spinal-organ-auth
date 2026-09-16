<template>
  <v-app>
    <v-main>
      <BachupInformation title="">
        <form class="formulaire" novalidate @submit.prevent="submitForm">
          <div class="formContainer">
            <div class="title">Modifier un utilisateur</div>
            <InputUser title="NOM DE L'UTILISATEUR" id="userName" v-model="formUser.userName" />
            <span class="errors" v-if="$v.formUser.userName.$error && !$v.formUser.userName.required">Un nom est
              requis</span>
            <span class="errors" v-else-if="$v.formUser.userName.$error && !$v.formUser.userName.minLength">Le nom
              d'utilisateur doit contenir au moins 3 caractères.
            </span>

            <SelectUser title="TYPE D'UTILISATEUR" id="userType" :tab="userType" v-model="formUser.userType"
              :value="formUser.userType" />

            <InputUser title="EMAIL" id="email" v-model="formUser.email" />
            <span class="errors" v-if="$v.formUser.email.$dirty && formUser.email && !$v.formUser.email.email">Format
              d'email incorrect.</span>

            <InputUser title="TELEPHONE" id="telephone" v-model="formUser.telephone" />
            <span class="errors"
              v-if="$v.formUser.telephone.$dirty && formUser.telephone && !$v.formUser.telephone.numeric">Le numéro de
              téléphone doit être composé uniquement de
              chiffre.</span>

            <TextareaUser title="INFORMATION" id="information" v-model="formUser.info" />

            <div v-for="(platform, index) in newuserplatform" :key="platform.platformId || index"
              class="mt-5 platform-valid">
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
            <span class="errors" v-if="error_platform">
              Les accès aux utilisateurs sont incorrects.
            </span>
          </div>

          <div class="footer">
            <button type="button" class="btn-retour" @click="goBack()">
              ANNULER
            </button>
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
import SelectUser from "../Components/SelectUser.vue";
import TextareaUser from "../Components/TextareaUser.vue";

import { validationMixin } from "vuelidate";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { USER_TYPES } from "../services/formUtils";

export default {
  components: {
    TextareaUser,
    BachupInformation,
    InputUser,
    SelectUser,
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
      userType: USER_TYPES,
      error_platform: false,
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
      telephone: {
        numeric,
      },
    },
  },
  methods: {
    buildPlatformList(platformList = []) {
      return platformList.map((el) => {
        return {
          platformId: el.platformId,
          platformName: el.platformName,
          userProfile: {
            userProfileAdminId: el.userProfile.userProfileAdminId,
            userProfileBosConfigId: el.userProfile.userProfileBosConfigId,
            userProfileName: el.userProfile.userProfileName,
          },
        };
      });
    },

    deletePlatformObjectitem(index) {
      if (Object.prototype.hasOwnProperty.call(this.newuserplatform, index)) {
        this.newuserplatform.splice(index, 1);
      }
    },

    goBack() {
      // this.$router.push("/UsersList");
      this.$router.go(-1);
    },

    async loadFormData() {
      await this.$store.dispatch("users/getUser", this.$route.query.id);
      this.formUser.userName = this.detailUser.userName;
      this.formUser.telephone = this.detailUser.telephone;
      this.formUser.email = this.detailUser.email;
      this.formUser.info = this.detailUser.info;
      this.formUser.userType = this.detailUser.userType;
      this.newuserplatform = [...(this.detailUser.platformList || [])];
    },

    ...mapActions({ updateUser: "users/updateUser" }),

    async submitForm() {
      this.$v.$touch();
      this.error_platform = this.newuserplatform.length === 0;

      if (this.$v.$invalid || this.error_platform) return;

      const payload = {
        userName: this.formUser.userName,
        email: this.formUser.email,
        telephone: this.formUser.telephone,
        info: this.formUser.info,
        userType: this.getUserType(this.formUser.userType),
        platformList: this.buildPlatformList(this.newuserplatform),
      };

      const updateArgs = [payload, this.$route.query.id];
      await this.updateUser(updateArgs);
    },

    getUserType(userType) {
      if (!userType) return "Simple User";
      if (userType.name) return userType.name;
      return userType;
    },
  },
  computed: {
    ...mapGetters({
      detailUser: "users/detailUser",
    }),
  },
  created() {
    this.loadFormData();
  },
};
</script>

<style scoped>
@import "../assets/form-common.css";

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
  letter-spacing: 0.0125em !important;
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
  font-size: 15px;
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
  margin-right: 10px;
}

.btn-creer {
  min-height: 35px;
}

.fade_in {
  animation: fadeIn 0.4s ease-in-out;
}

.errors {
  position: static;
  display: block;
  margin: 2px 0 6px;
  transform: none;
  font-size: 10px;
  padding-left: 4px;
  letter-spacing: 1.1px;
  color: rgb(255, 0, 0);
}
</style>
