<template>
  <v-app>
    <v-main>
      <InformationBar :btn="'off'" v-on:btn2="displayEdit()" v-on:btn3="deletePlatformItem()"
        :title="this.platform.name" :icon="require('../assets/image/BOS_icon.svg')" class="header-bar">
        <div class="platformInfo">
          <div class="d-flex platform-information-bar">
            <div class="d-flex flex-column mr-16">
              <span class="bar-sub-title">URL</span>
              <span class="bar-information">{{ this.platform.url }}</span>
            </div>
            <div class="d-flex flex-column mr-16">
              <span class="bar-sub-title">CLIENT ID</span>
              <span class="bar-information">{{ this.platform.clientId }}</span>
            </div>
            <div class="d-flex flex-column mr-16">
              <span class="bar-sub-title">CLIENT SECRET</span>
              <span class="bar-information">{{
                this.platform.clientSecret
              }}</span>
            </div>
            <div class="d-flex flex-column mr-16">
              <span class="bar-sub-title">STATUT</span>
              <StatutButton :val="getStatus(platform.statusPlatform)" :title="platform.statusPlatform || 'unknown'">
              </StatutButton>
            </div>
          </div>

          <div class="platform-action">

            <v-btn outlined color="success" @click="syncData">
              <v-icon class="mx-1" dark>mdi-sync</v-icon>
              METTRE A JOUR
            </v-btn>

            <!--  -->
            <v-btn outlined color="orange" @click="goToEditPlatform">
              <v-icon class="mx-1" dark>mdi-pencil-outline</v-icon>
              EDITER
            </v-btn>

            <v-btn outlined color="red" @click="deletePlatform">
              <v-icon class="mx-1" color="orange darken-2" dark>mdi-close</v-icon>
              SUPPRIMER
            </v-btn>
          </div>
        </div>


      </InformationBar>

      <BackupInformation style="max-height: 70%; min-height: 70%" title="INFORMATION DE LA PLATFORME">
        <Tabs :items="items">
          <v-tab-item v-if="this.platform">
            <v-card style="background-color: #f7f7f7">
              <div @click="affichage()">
                <v-data-table fixed-header style="background-color: #f7f7f7" :footer-props="{
                  'items-per-page-options': [10, -1],
                }" :items-per-page="30" height="45vh" :headers="headersorgane" :items="this.platform.organs"
                  :search="search">
                </v-data-table>
              </div>
            </v-card>
          </v-tab-item>
          <!-- *****************************USER PROFILES******************************************** -->
          <v-tab-item v-if="this.platform">
            <v-card style="background-color: #f7f7f7">
              <div @click="affichage()">
                <v-data-table fixed-header style="background-color: #f7f7f7" :footer-props="{
                  'items-per-page-options': [10, -1],
                }" :items-per-page="30" height="45vh" :headers="headers2" :items="this.platform.userProfiles"
                  :search="search">
                </v-data-table>
              </div>
            </v-card>
          </v-tab-item>
          <!-- *****************************APP PROFILES******************************************** -->
          <v-tab-item v-if="this.platform">
            <v-card style="background-color: #f7f7f7">
              <div @click="affichage()">
                <v-data-table fixed-header style="background-color: #f7f7f7" :footer-props="{
                  'items-per-page-options': [10, -1],
                }" :items-per-page="30" height="45vh" :headers="headers2" :items="this.platform.appProfiles"
                  :search="search">
                </v-data-table>
              </div>
            </v-card>
          </v-tab-item>
          <!-- *****************************USERS******************************************** -->
          <v-tab-item v-if="userListLinkPlatform">
            <v-card style="background-color: #f7f7f7">
              <div @click="affichage()">
                <v-data-table fixed-header style="background-color: #f7f7f7" :footer-props="{
                  'items-per-page-options': [10, -1],
                }" :items-per-page="30" height="45vh" :headers="headersuser" :items="userListLinkPlatform"
                  :search="search">
                </v-data-table>
              </div>
            </v-card>
          </v-tab-item>
          <!-- *****************************APPS******************************************** -->
          <v-tab-item v-if="appListLinkPlatform">
            <v-card style="background-color: #f7f7f7">
              <div @click="affichage()">
                <v-data-table fixed-header style="background-color: #f7f7f7" :footer-props="{
                  'items-per-page-options': [10, -1],
                }" :items-per-page="30" height="45vh" :headers="headersapp" :items="appListLinkPlatform"
                  :search="search">
                </v-data-table>
              </div>
            </v-card>
          </v-tab-item>
          <!-- *****************************LOGS******************************************** -->
          <v-tab-item v-if="logList">
            <v-card style="background-color: #f7f7f7">
              <div @click="affichage()">
                <v-card-title>
                  <v-text-field v-model="search" append-icon="mdi-magnify" label="Rechercher" single-line hide-details>
                  </v-text-field>
                </v-card-title>
                <v-data-table fixed-header style="background-color: #f7f7f7" :footer-props="{
                  'items-per-page-options': [10, -1],
                }" :items-per-page="30" height="45vh" :headers="headers" :items="this.formattedLogList"
                  :search="search">
                </v-data-table>
              </div>
            </v-card>
          </v-tab-item>
          <!-- *****************************AUTH SERVER******************************************** -->
          <v-tab-item v-if="logList">
            <v-card style="background-color: #f7f7f7">
              <div @click="affichage()">
                <!-- <v-card-title>
                  <v-text-field v-model="search" append-icon="mdi-magnify" label="Rechercher" single-line hide-details>
                  </v-text-field>
                </v-card-title> -->
                <v-data-table fixed-header style="background-color: #f7f7f7" :footer-props="{
                  'items-per-page-options': [10, -1],
                }" :items-per-page="30" height="45vh" :headers="serverLoginHeader" :items="this.loginServerList"
                  :search="search">
                </v-data-table>
              </div>
            </v-card>
          </v-tab-item>
        </Tabs>
      </BackupInformation>
    </v-main>
  </v-app>
</template>

<script>
import InformationBar from "../Components/InformationBar.vue";
import StatutButton from "../Components/StatutButton.vue";
import Tabs from "../Components/Tabs.vue";
import BackupInformation from "../Components/BackupInformation.vue";
import FiltreBar from "../Components/FiltreBar.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    InformationBar,
    BackupInformation,
    StatutButton,
    Tabs,
    FiltreBar,
  },
  data() {
    return {
      search: "",
      serverLoginHeader: [
        { text: "Nom", value: "name" },
        { text: "Type", value: "type" },
        { text: "Methode d'authentification", value: "authentication_method" },
      ],

      headers: [
        { text: "Nom", value: "name" },
        { text: "Date", value: "date" },
        { text: "Message", value: "message" },
        { text: "Acteur", value: "actor.actorName" },
        { text: "Id Acteur", value: "actor.actorId" },
      ],
      headersuser: [
        { text: "Nom", value: "name" },
        { text: "Info", value: "info" },
        { text: "userType", value: "userType" },
        { text: "type", value: "type" },
        { text: "Id Acteur", value: "id" },
      ],
      headersorgane: [
        { text: "Nom", value: "name" },
        { text: "Id", value: "id" },
        { text: "Organ Type", value: "organType" },
        { text: "statusOrgan", value: "statusOrgan" },
        { text: "type", value: "type" },
      ],
      headersapp: [
        { text: "Nom", value: "name" },
        { text: "Type d'applicaton", value: "appType" },
        { text: "Id", value: "id" },
        { text: "Client ID", value: "clientId" },
        { text: "Client Secret", value: "clientSecret" },
      ],
      headers2: [
        { text: "Nom", value: "name" },
        { text: "Id profil", value: "id" },
        { text: "Type", value: "type" },
      ],
      mounted: false,
      platformId: null,

      userList: [],
      itemSelected: null,
      appList: [],
      tab: null,
      items: [
        "ORGANES",
        "PROFILS D'UTILISATEURS",
        "PROFILS D'APPLICATIONS",
        "UTILISATEURS",
        "APPLICATIONS",
        "LOGS",
        "SERVEURS D'AUTHENTIFICATION"
      ],
    };
  },
  methods: {
    updatePlatform() {
      this.$store.dispatch("platforms/getPlatform", this.$route.query.id);
      this.$store.dispatch("platforms/getPlatformLogs", this.$route.query.id);
      this.$store.dispatch("platforms/getApplications", this.$route.query.id);
      this.$store.dispatch("platforms/getUsers", this.$route.query.id);
      this.$store.dispatch("platforms/getServerList", this.$route.query.id);
    },
    affichage() {
      var a = document.querySelector(
        "#app > div.v-menu__content.theme--light.menuable__content__active"
      );
      a.style.position = "fixed";
    },

    getStatus(status) {
      return status ? status : "unknown";
    },

    goToEditPlatform() {
      this.$router.push({
        name: "EditPlatform",
        query: { id: this.platform.id },
      });
    },

    async deletePlatform() {
      const res = confirm(`Voulez-vous supprimer la plateforme "${this.platform.name}"`);
      if (res) {
        await this.$store.dispatch("platforms/deletePlatform", this.platform.id);
        this.$router.push({ name: "Platforms" });
      }
    },

    syncData() {
      this.$store.dispatch("platforms/syncData", { paltformId: this.platform.id })
    },
  },
  computed: {
    ...mapGetters({
      platform: "platforms/platform",
      logList: "platforms/platformlog",
      appListLinkPlatform: "platforms/appListLinkPlatform",
      userListLinkPlatform: "platforms/userListLinkPlatform",
      loginServerList: "platforms/loginServerList"
    }),

    formattedLogList() {
      return this.logList.map((log) => {
        log.date = new Date(log.date).toLocaleString();
        return log;
      });
    },


  },

  async created() {
    await this.updatePlatform();
  },

};
</script>

<style scoped>
.v-application {
  background: #eeeeee00;
}

.v-data-table>>>td {
  background-color: white;
  border-top: 10px solid #f7f7f7;
  border-bottom: solid 0px black !important;
  height: 60px !important;
  font-size: 11px !important;
}

.header-bar {
  height: 150px;
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
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
  margin-bottom: 10px;
}

.bar-information {
  margin-bottom: 10px;
  font-size: 11px;
  letter-spacing: 1.1px;
  min-width: 80px;
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

.platformInfo {
  width: 100%;
  height: 150px;
  display: flex;
}

.platform-information-bar {
  /* background: rgb(214, 33, 33); */
  height: 100%;
  width: 70%;
  display: flex;
  align-items: center;
  /* background: red; */
}

.platform-action {
  width: 30%;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  /* background: green; */
}
</style>