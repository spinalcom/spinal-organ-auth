<template>
  <v-app>
    <v-main>

      <!-- Modal 1, Autoriser une plateforme -->
      <div v-if="show" class="popup_platform">
        <v-card class="popup">
          <div @click="show = false" class="popup-closebtn">
            <span>X</span>
          </div>
          <p class="mb-6">AUTORISER UNE PLATFORME</p>
          <div class="choix_platform">
            <SelectUser style="z-index: 99" v-model="formPlatformObject.platform" @select="getuserfromplatform()"
              title="PLATFORME" id="userType" :tab="platformList" :value="formPlatformObject.platform" />

            <SelectUser v-model="formPlatformObject.userProfileValue" :tab="userProfileList"
              title="PROFILE D'UTILISATEUR" id="userType" :value="formPlatformObject.userProfileValue" />
          </div>
          <div @click="editUserPlatform()" class="mt-4 ml-1 popup-btn-ajouter">
            <span>AJOUTER</span>
          </div>
          <div @click="show = false" class="mt-4 ml-1 popup-btn-fermer">
            <span>FERMER</span>
          </div>
        </v-card>
      </div>


      <!-- Modal 2, Modifier le mot de passe -->
      <div v-if="showrestpass" class="popup_platform">
        <v-card class="popup">
          <div class="mb-3">MODIFIER LE MOT DE PASSE</div>

          <v-alert dense outlined type="error" v-if="passwordError">
            {{ passwordErrorMessages[passwordError] }}
          </v-alert>

          <InputPass :required="true" v-model="auth_password" class="entrance" title="MOT DE PASSE DE l'ADMINISTRATEUR"
            id="password" @input="passwordError = null" />

          <InputPass :required="true" :generate="true" v-model="password" class="entrance" title="NOUVEAU MOT DE PASSE"
            id="password" @input="passwordError = null" @generate="generatePassword" />

          <div @click="editUserPassWord" class="mt-2 ml-1 popup-btn-ajouter">
            <span>MODIFIER</span>
          </div>

          <div @click="showrestpass = false" class="mt-2 ml-1 popup-btn-fermer">
            <span>ANNULER</span>
          </div>
        </v-card>
      </div>

      <!-- Fin des modals -->

      <InformationBar v-on:btn1="showplatform()" v-on:btn2="displayEditUser()" v-on:btn3="deletebtn()"
        v-on:btn4="showrestpass = true" :title="this.detailUser.userName"
        :icon="require('../assets/image/USE_icon.svg')">
        <div class="d-flex flex-column">
          <div class="textDiv d-flex  mr-16">
            <span class="bar-sub-title">NOM D'UTILISATEUR</span>
            <span class="bar-information">{{ this.detailUser.userName || "-" }}</span>
          </div>
          <div class="textDiv d-flex  mr-16" :title="this.detailUser.email">
            <span class="bar-sub-title">EMAIL</span>
            <span class="bar-information">{{ this.detailUser.email || "-" }}</span>
          </div>
          <!-- <div class="d-flex flex-column mr-16" :title="this.detailUser.email">
            <span class="bar-sub-title">TYPE</span>
            <span class="bar-information">{{ this.detailUser.type }}</span>
          </div> -->
          <div class="textDiv d-flex  mr-16" :title="this.detailUser.telephone">
            <span class="bar-sub-title">TELEPHONE</span>
            <span class="bar-information">{{ this.detailUser.telephone || "-" }}</span>
          </div>

        </div>
        <!-- <div class="d-flex flex-column mr-16">
          <span class="bar-sub-title">INFO</span>
          <span class="bar-information">{{ this.detailUser.info }}</span>
        </div> -->
      </InformationBar>

      <BackupInformation class="backupInfo" title="DÉTAIL PROFIL D'UTILISATEUR">
        <Tabs :items="items">
          <v-tab-item>
            <v-card style="background-color: #f7f7f7">
              <div @click="affichage()">
                <v-data-table fixed-header style="background-color: #f7f7f7" :footer-props="{
                  'items-per-page-options': [10, -1],
                }" :items-per-page="30" height="45vh" :headers="headers1" :items="this.platformObjectList"
                  :search="search">
                </v-data-table>
              </div>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <!-- <v-card style="background-color: #f7f7f7"> -->
            <div @click="affichage()">
              <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Rechercher" outlined hide-details>
                </v-text-field>
              </v-card-title>
              <v-data-table fixed-header :footer-props="{
                'items-per-page-options': [10, -1],
              }" :items-per-page="30" height="45vh" :headers="headers" :items="this.formattedLogList" :search="search">
              </v-data-table>
            </div>
            <!-- </v-card> -->
          </v-tab-item>
        </Tabs>
      </BackupInformation>
    </v-main>
  </v-app>
</template>

<script>
import InformationBar from "../Components/InformationBar.vue";
import BackupInformation from "../Components/BackupInformation.vue";
import BlueButton from "../Components/BlueButton.vue";
import Tabs from "../Components/Tabs.vue";
import FiltreBar from "../Components/FiltreBar.vue";
import SelectUser from "../Components/SelectUser.vue";
import { mapActions, mapGetters } from "vuex";
import InputPass from "../Components/InputPassword.vue";

export default {
  name: "App",
  components: {
    InformationBar,
    BackupInformation,
    Tabs,
    FiltreBar,
    SelectUser,
    BlueButton,
    InputPass,
  },
  data() {
    this.passwordErrorTypes = {
      minLength: "minLength",
      authPassword: "authPassword",
    };

    this.passwordErrorMessages = {
      [this.passwordErrorTypes.minLength]:
        "Le mot de passe doit contenir au moins 8 caractères.",

      [this.passwordErrorTypes.authPassword]:
        "Le mot de passe de l'admin est incorrect.",
    };

    return {
      passwordError: null,
      newuser: {},
      password: "",
      auth_password: "",

      formPlatformObject: {
        platform: [],
        userProfileValue: [],
        plat: [],
      },
      userProfileList: [],
      logListFormatted: [],
      search: "",
      show: false,
      showrestpass: false,
      headers1: [
        { text: "Nom", value: "_platform.name" },
        { text: "Statut", value: "_platform.statusPlatform" },
        { text: "Message", value: "userProfile.name" },
        { text: "Id Acteur", value: "userProfile.userProfileId" },
        { text: "Nom Acteur", value: "_platform.name" },
      ],
      headers: [
        { text: "Nom", value: "name" },
        { text: "Date", value: "date" },
        { text: "Message", value: "message" },
        { text: "Acteur", value: "actor.actorName" },
        { text: "Id Acteur", value: "actor.actorId" },
      ],
      items: ["PLATFORME", "LOGS"],
    };
  },
  methods: {
    ...mapActions({
      editUserPass: "users/updateUser",
      updateUserPassWord: "users/updateUserPassword",
    }),

    copiepass() {
      const dummyElement = document.createElement("input");
      dummyElement.value = this.password;
      document.body.appendChild(dummyElement);
      dummyElement.select();
      document.execCommand("copy");
      document.body.removeChild(dummyElement);
    },

    editUserPassWord() {
      if (this.auth_password.length >= 8 && this.password.length >= 8) {
        const body = {
          authAdminPassword: this.auth_password,
          newPassword: this.password,
        };

        const userId = this.$route.query.id;

        return this.updateUserPassWord({ userId, body })
          .then(() => {
            this.passwordError = null;
            this.showrestpass = false;
          })
          .catch((error) => {
            this.passwordError = this.passwordErrorTypes.authPassword;
            console.log(error);
          });

      } else {
        this.passwordError = this.passwordErrorTypes.minLength;
      }

    },

    editUser() {
      if (this.auth_password.length > 8 && this.password.length > 8) {
        this.newuser = this.detailUser;
        this.newuser.password = this.password;
        this.formateduser();
        var profile = [this.newuser, this.$route.query.id];
        this.editUserPass(profile);
        this.showrestpass = false;
      }
    },

    editUserPlatform() {
      // console.log('toto');
      this.show = false;
      this.newuser = this.detailUser;
      this.formateduser();
      // console.log(this.formPlatformObject.userProfileValue);

      let newPlatform = {
        platformId: this.formPlatformObject.platform.id,
        platformName: this.formPlatformObject.platform.name,
        userProfile: {
          userProfileAdminId: this.formPlatformObject.userProfileValue.id,
          userProfileBosConfigId:
            this.formPlatformObject.userProfileValue.userProfileId,
          userProfileName: this.formPlatformObject.userProfileValue.name,
        },
      };

      // console.log(newPlatform);
      let existingPlatform = this.newuser.platformList.some(
        (platform) => platform.platformName === newPlatform.platformName
      );

      if (existingPlatform) {
        console.log("Error: Platform name already exists.");
        alert("Error: Platform name already exists.");
      } else {
        this.newuser.platformList.push(newPlatform);
        var profile = [this.newuser, this.$route.query.id];
        this.editUserPass(profile);
        // console.log('pas pareil');
      }

      // console.log(this.newuser);
    },

    formateduser() {
      delete this.newuser.type;
      delete this.newuser.id;
      delete this.newuser.name;
      this.newuser.platformList.forEach((platform) => {
        delete platform.idPlatformOfAdmin;
      });
    },

    generatePassword() {
      let password = "";
      const minLength = 16;
      const possibleCharacters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};':\"<>,.?/\\|";
      for (let i = 0; i < minLength; i++) {
        password += possibleCharacters.charAt(
          Math.floor(Math.random() * possibleCharacters.length)
        );
      }
      if (!/[A-Z]/.test(password)) {
        password =
          password.substring(0, 15) +
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
      }
      this.password = password;

      this.copiepass();
    },

    showplatform() {
      this.show = true;
      // console.log(this.platformList);
    },

    ...mapActions({ deleteUser: "users/deleteUser" }),

    deletebtn() {
      var user = {
        id: this.$route.query.id,
        name: this.detailUser.userName,
      };
      this.deleteUser(user);
    },

    updateUser() {
      this.$store.dispatch("users/getUser", this.$route.query.id);
      this.$store.dispatch("users/getUserLogs", this.$route.query.id);
    },

    displayEditUser() {
      this.$router.push({
        name: "EditUser",
        query: { id: this.$route.query.id },
      });
    },
    affichage() {
      var a = document.querySelector(
        "#app > div.v-menu__content.theme--light.menuable__content__active"
      );
      if (a != null) {
        a.style.position = "fixed";
      }
    },
    getDataFromStore() {
      this.$store.dispatch("users/getplatformList");
    },
    async getuserfromplatform() {
      var id = this.formPlatformObject.platform.id;
      // console.log(id);
      this.userProfileList = await this.$store.dispatch(
        "users/getUserProfileList",
        id
      );
    },
  },
  computed: {
    ...mapGetters({
      detailUser: "users/detailUser",
      platformObjectList: "users/platformObjectList",
      logList: "users/logList",
      platformList: "users/platformList",
    }),
    formattedLogList() {
      return this.logList.map((log) => {
        log.date = new Date(log.date).toLocaleString();
        return log;
      });
    },
  },

  created() {
    this.updateUser();
    this.getDataFromStore();
  },
};
</script>

<style scoped>
*:focus {
  outline: none;
}

.v-application {
  background: #eeeeee00;
}

.reset_btn {
  width: 100%;
  /* background-color: red; */
  position: absolute;
  top: -65px;
  display: flex;
  justify-content: end;
  min-width: 980px;
}

.textDiv {
  display: flex;
  justify-content: space-between;
}

.v-data-table>>>td {
  background-color: white;
  border-top: 10px solid #f7f7f7;
  border-bottom: solid 0px black !important;
  height: 60px !important;
  font-size: 11px !important;
}

#content>div>main>div>div.d-flex.flex-column.rounded-lg.backup-bar.v-card.v-sheet.theme--light.elevation-2>div.v-tabs.v-tabs--grow.theme--light>div.v-window.v-item-group.theme--light.v-tabs-items>div>div.v-window-item.v-window-item--active>div>div>div.v-card__title>div {
  margin-top: 0;
  padding-top: 0;
}

.v-data-table>>>th {
  background: #f7f7f7 !important;
}

#content>div>main>div>div.d-flex.flex-column.rounded-lg.backup-bar.v-card.v-sheet.theme--light.elevation-2>div.v-tabs.v-tabs--grow.theme--light>div.v-window.v-item-group.theme--light.v-tabs-items>div>div.v-window-item.v-window-item--active>div>div>div.v-card__title {
  padding: 10px;
  background-color: white;
  border: 1px solid #e3e7e8;
  border-radius: 6px;
}

.sub-division {
  display: flex;
  flex-direction: column;
  width: 20%;
}

.bar-sub-title {
  color: #949da6;
  margin-bottom: 6px;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-size: 1em;
  margin-right: 30px;
}

.backupInfo {
  height: calc(100% - 350px) !important;
}

.bar-information {
  margin-bottom: 10px;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-size: 1em;
  color: #14202c;
}

.information-backup-bar2 {
  background: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9px;
  letter-spacing: 0.9px;
  height: 50px;
  margin-bottom: 3px;
  margin-top: 2px;
  margin-left: 1px;
  padding-left: 8px;
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

.choix_platform {
  width: 99%;
  height: 150px;
  background-color: #eaeef0;
  border-radius: 6px;
  padding-left: 10px;
  padding-right: 10px;
}

.popup {
  position: relative;
  width: 615px;
  height: 300px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  transform: translate(-50%, -100%);
  left: 50%;
  top: 50%;
  border-radius: 10px;
  font-family: Arial, Helvetica, sans-serif;
}

.popup-closebtn {
  top: 7px;
  right: 7px;
  width: 40px;
  height: 40px;
  border: 2px solid #e9ecee;
  opacity: 1;
  position: absolute;
  border-radius: 6px !important;
  justify-content: center;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
  cursor: pointer;
}

.popup-btn-ajouter {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 145px;
  height: 40px;
  background-color: #14202c;
  border-radius: 6px !important;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
}

.popup-btn-fermer {
  position: absolute;
  left: 49%;
  bottom: 10px;
  width: 145px;
  height: 40px;
  background-color: #14202c;
  border-radius: 6px !important;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
}

.popup-btn-copier {
  position: absolute;
  left: 23%;
  bottom: 10px;
  width: 145px;
  height: 40px;
  background-color: #14202c;
  border-radius: 6px !important;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
}

.popup_platform {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  backdrop-filter: blur(5px);
}
</style>