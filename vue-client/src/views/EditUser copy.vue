<template>
  <v-app>
    <v-main>
      <BachupInformation title="MODIFIER UTILISATEUR">
        <form class="formulaire" novalidate @submit.prevent="submitForm">
          <InputUser title="NOM D'UTILISATEUR" id="telephone" v-model="formUser.userName" />
          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.userName.required">Un nom est
            requis</span>
          <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formUser.userName.minLength">Le nom
            d'utilisateur doit contenir au moins 3 caractères.</span>
          <!-- <InputPass title="ANCIEN MOT DE PASSE" id="password" v-model="formUser.oldPassword" />
                    <span class="errors" :class="{ 'showspan': iserrors }" v-if="!$v.formUser.oldPassword.required">Le
                        mot
                        de passe
                        est obligatoire.</span>
                    <span class="errors" :class="{ 'showspan': iserrors }"
                        v-else-if="!$v.formUser.oldPassword.minLength">Mot de
                        passe invalide</span>
                    <InputPass title="NOUVEAU MOT DE PASSE" id="password" v-model="formUser.password" />
                    <span class="errors" :class="{ 'showspan': iserrors }" v-if="!$v.formUser.password.required">La
                        confirmation de mot de passe est obligatoire.</span>
                    <span class="errors" :class="{ 'showspan': iserrors }"
                        v-else-if="!$v.formUser.password.minLength">Mot
                        de passe invalide</span> -->

          <!-- <button @click="modif_mdp = true" type="button" class="btn-creer">MODIFIER LE MOT DE PASSE</button>
                    <button v-if="modif_mdp" @click="generatePassword" type="button" class="btn-creer fade_in">GENERER
                        UN MOT DE PASSE</button>
                    <InputPass v-if="modif_mdp" class="entrance" title="NOUVEAU MOT DE PASSE" id="password"
                        v-model="formUser.password" /> -->

          <InputUser title="EMAIL" id="email" v-model="formUser.email" />
          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.email.required">Un Email est
            requis</span>
          <InputUser title="TELEPHONE" id="telephone" v-model="formUser.telephone" />
          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.telephone.required">Un numéro de
            téléphone est requis.</span>
          <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formUser.telephone.numeric">Le numéro de
            téléphone doit être composé uniquement de
            chiffre.</span>
          <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formUser.telephone.minLength">Le numéro de
            téléphone est invalide.</span>
          <InputUser title="INFO" id="info" v-model="formUser.info" />
          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.info.required">Une information est
            requise.</span>
          <SelectUser title="TYPE D'UTILISATEUR" id="userType" :tab="userType" v-model="formUser.userType"
            :value="formUser.userType" />

          <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formUser.userType.required">
            Le type d'utilisateur est requis.
          </span>
          <AddPlatform :types="'user'" ref="refplatform" :sendplatform="detailUser.platformList" />
          <span style="position: absolute; margin-top: -45px" class="errors" :class="{ showspan: !error_platform }">
            Les accès aux utilisateurs sont incorrects.
          </span>
          <div class="d-flex justify-end">
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
import AddPlatform from "../Components/AddPlatform";
import { validationMixin } from "vuelidate";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { USER_TYPES } from "../services/formUtils";

export default {
  components: {
    BachupInformation,
    InputUser,
    SelectUser,
    AddPlatform,
  },
  data() {
    return {
      formUser: {
        userName: null,
        telephone: null,
        email: null,
        info: null,
        userType: null,
        platformList: null,
      },
      userType: USER_TYPES,
      iserrors: true,
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
        required,
        email,
      },
      info: {
        required,
      },
      telephone: {
        required,
        numeric,
        minLength: minLength(8),
      },
      userType: {
        required,
      },
    },
  },
  methods: {
    getUserType(userType) {
      if (!userType) return "Simple User";
      if (userType.name) return userType.name;
      return userType;
    },

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

    goBack() {
      this.$router.push("/UsersList");
    },

    async loadFormData() {
      await this.$store.dispatch("users/getUser", this.$route.query.id);
      this.formUser.userName = this.detailUser.userName || this.detailUser.name;
      this.formUser.telephone = this.detailUser.telephone;
      this.formUser.email = this.detailUser.email;
      this.formUser.info = this.detailUser.info;
      this.formUser.userType = this.detailUser.userType;
    },

    ...mapActions({ updateUser: "users/updateUser" }),

    async submitForm() {
      await this.$refs.refplatform.maFonction();
      this.$v.$touch();

      if ((this.platformObjectList || []).length === 0) {
        this.error_platform = true;
        return;
      }

      this.error_platform = false;

      if (!this.$v.$invalid) {
        const payload = {
          userName: this.formUser.userName,
          email: this.formUser.email,
          telephone: this.formUser.telephone,
          info: this.formUser.info,
          userType: this.getUserType(this.formUser.userType),
          platformList: this.buildPlatformList(this.platformObjectList),
        };

        const updateArgs = [payload, this.$route.query.id];
        this.updateUser(updateArgs);
      } else {
        this.iserrors = false;
      }
    },
  },
  computed: {
    ...mapGetters({
      detailUser: "users/detailUser",
      platformObjectList: "users/selectedplatformObjectList",
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
</style>
