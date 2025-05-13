<template>
  <v-card class="platformListCard" elevation="4">

    <div class="addPlatformBtn">
      <!-- <BlueButton @click.native="goToCreatePlatform()" :icon="'mdi-plus'" title="AJOUTER UNE PLATEFORME"
        :val="'blue'" /> -->

      <v-btn color="#14202C" dark large @click.native="goToCreatePlatform()">
        <v-icon left>
          mdi-plus
        </v-icon>
        AJOUTER UNE PLATEFORME
      </v-btn>
    </div>


    <v-data-table class="tableContent" :headers="headers" :items="platformList" disable-pagination hide-default-footer>

      <template v-slot:item.userProfiles="{ item }">
        {{ item.userProfiles.length }}
      </template>

      <template v-slot:item.organs="{ item }">
        {{ item.organs.length }}
      </template>

      <template v-slot:item.appProfiles="{ item }">
        {{ item.appProfiles.length }}
      </template>

      <template v-slot:item.lastSyncTime="{ item }">
        <div class="btn-valider-user">
          <span>{{ getLastTimeSyncValue(item.lastSyncTime) }}</span>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="actions">
          <div class="btn-valider-user rounded-r-lg pr-2 hover">
            <button @click="deletePlatform(item)" title="Supprimer">
              <v-icon>mdi-trash-can-outline</v-icon>
            </button>
          </div>

          <div class="btn-valider-user rounded-r-lg pr-2 hover">
            <button @click="goToEdit(item)" title="Modifier">
              <v-icon>mdi-pencil</v-icon>
            </button>
          </div>

          <div class="btn-valider-user rounded-r-lg pr-2 hover">
            <button @click="syncData(item)" title="mettre les données à jour">
              <v-icon>mdi-sync</v-icon>
            </button>
          </div>

          <div class="btn-valider-user rounded-r-lg pr-2 hover">
            <button @click="displayDetail(item)" title="Détails">
              <v-icon>mdi-arrow-right</v-icon>
            </button>
          </div>
        </div>

      </template>
    </v-data-table>

    <!-- <div class="d-flex mt-2">
        <div class="sub-division">
          <span class="subtitle-backbar">Nom</span>
        </div>

        <div class="sub-division">
          <span class="subtitle-backbar">Id client</span>
        </div>

        <div class="sub-division">
          <span class="subtitle-backbar">Nombre d'organe</span>
        </div>
        <div class="sub-division">
          <span class="subtitle-backbar">Nombre de Profil d'utilisateur</span>
        </div>
        <div class="sub-division">
          <span class="subtitle-backbar">Nombre de Profil d'application</span>
        </div>
        <div class="sub-division">
          <span class="subtitle-backbar">dernière synchronisation</span>
        </div>

        <div class="sub-division">
          <span class="subtitle-backbar"></span>
        </div>
      </div>

      <div v-for="item in this.platformList" :key="item.id">
         <div class="d-flex mb-2">
          <div class="d-flex flex-column platformColumn ">
            <div class="btn-valider-user rounded-l-lg">
              {{ item.name }}
            </div>
          </div>

          <div class="d-flex flex-column platformColumn">
            <div class="btn-valider-user">
              <span>{{ item.clientId }}</span>
            </div>
          </div>

          <div class="d-flex flex-column platformColumn">
            <div class="btn-valider-user">
              <span>{{ item.organs.length }}</span>
            </div>
          </div>

          <div class="d-flex flex-column platformColumn">
            <div class="btn-valider-user">
              <span>{{ item.userProfiles.length }}</span>
            </div>
          </div>

          <div class="d-flex flex-column platformColumn">
            <div class="btn-valider-user">
              <span>{{ item.appProfiles.length }}</span>
            </div>
          </div>



          <div class="d-flex flex-column platformColumn">
            <div class="btn-valider-user">
              <span>{{ getLastTimeSyncValue(item.lastSyncTime) }}</span>
            </div>
          </div>



          <div class="d-flex platformColumn actions">
            <div class="btn-valider-user rounded-r-lg pr-2 hover">
              <button @click="deletePlatform(item)" title="Supprimer">
                <v-icon>mdi-trash-can-outline</v-icon>
              </button>
            </div>

            <div class="btn-valider-user rounded-r-lg pr-2 hover">
              <button @click="goToEdit(item)" title="Modifier">
                <v-icon>mdi-pencil</v-icon>
              </button>
            </div>

            <div class="btn-valider-user rounded-r-lg pr-2 hover">
              <button @click="syncData(item)" title="mettre les données à jour">
                <v-icon>mdi-sync</v-icon>
              </button>
            </div>

            <div class="btn-valider-user rounded-r-lg pr-2 hover">
              <button @click="displayDetail(item)" title="Détails">
                <v-icon>mdi-arrow-right</v-icon>
              </button>
            </div>
          </div>

        </div>
      </div> -->
  </v-card>

</template>

<script>
import BlueButton from "../Components/BlueButton.vue";
import StatutButton from "../Components/StatutButton.vue";
import InputUser from "../Components/InputUser.vue";
import BachupInformation from "../Components/BackupInformation.vue";
import StateButton from "../Components/StateButton.vue";
import InputPassword from "../Components/InputPassword.vue";
import { mapActions, mapGetters } from "vuex";
import * as moment from "moment";
// import test from "./test";

export default {
  name: "App",
  components: {
    BlueButton,
    BachupInformation,
    StatutButton,
    InputUser,
    StateButton,
    InputPassword,
  },
  data: () => ({
    // token: "",
    show: false,
    // searched: test,
    headers: [
      { cellClass: "longText", text: "Nom", value: "name", width: "300px" },
      { cellClass: "longText", text: "Id client", value: "clientId", width: "300px" },
      { text: "Nombre de Profil d'utilisateur", value: "userProfiles" },
      { text: "Nombre d'organe", value: "organs" },
      { text: "Nombre de Profil d'application", value: "appProfiles" },
      { text: "dernière synchronisation", value: "lastSyncTime" },
      { text: "", value: "actions", width: "300px" },
    ],
    // headers: [
    //   { cellClass: "longText", text: "Nom", value: "name", width: "calc(50% - 450px)" },
    //   { cellClass: "longText", text: "Id client", value: "clientId", width: "calc(50% - 450px)" },
    //   { text: "Nombre de Profil d'utilisateur", value: "userProfiles", width: "150px" },
    //   { text: "Nombre d'organe", value: "organs", width: "150px" },
    //   { text: "Nombre de Profil d'application", value: "appProfiles", width: "150px" },
    //   { text: "dernière synchronisation", value: "lastSyncTime", width: "200px" },
    //   { text: "", value: "actions", width: "250px" },
    // ],
  }),

  filters: {
    formatDate(val) {
      return moment(val).fromNow();
    }
  },

  methods: {

    getLastTimeSyncValue(date) {
      console.log("date", date)
      return date ? moment(date).fromNow() : "never"
    },

    getDataFromStore() {
      this.$store.dispatch("platforms/getPlatformlist");
      this.$store.dispatch("platforms/getRegisterKey");
      // this.$store.dispatch('platforms/getApplications');
    },

    async generateKey() {
      this.show = true;
      this.generateRegisterKey();
    },

    goToCreatePlatform() {
      this.$router.push({ name: "AddPlatform" });
    },

    displayDetail(item) {
      this.$router.push({ name: "DetailPlatform", query: { id: item.id } });
    },

    deletePlatform(item) {
      const res = confirm(`Voulez-vous supprimer la plateforme "${item.name}"`);
      if (res) this.$store.dispatch("platforms/deletePlatform", item.id);
    },

    syncData(platform) {
      this.$store.dispatch("platforms/syncData", { paltformId: platform.id })
    },

    goToEdit(plateforme) {
      this.$router.push({ name: "EditPlatform", query: { id: plateforme.id } });
    },

    ...mapActions({
      generateRegisterKey: "platforms/generateRegisterKey",
    }),

    getStatus(status) {
      return status ? status : "unknown";
    },
  },
  computed: {
    ...mapGetters({
      platformList: "platforms/platformList",
      registerKey: "platforms/registerKey",
    }),
    token() {
      return this.registerKey && this.registerKey.value
        ? this.registerKey.value
        : null;
    },
  },
  created() {
    this.getDataFromStore();
  },
};
</script>

<style scoped>
.platformListCard {
  width: calc(100% - 30px);
  margin: auto;
  height: calc(100vh - 100px);
  background: transparent !important;
}

.addPlatformBtn {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.tableContent {
  max-height: calc(100% - 70px);
  overflow-y: auto;
  background: transparent;
}



.btn-valider-user {
  height: 100%;
  display: flex;
  align-items: center;
  min-height: 50px;
  padding-left: 10px;
  font: normal normal normal 12px/14px Charlevoix Pro;
  letter-spacing: 1.2px;
  margin: 1px;
}

.hover:hover {
  background: rgb(228, 228, 228);
  transition: 0.3s;
}

/* 
.app {
  font: normal normal normal 10px/12px Charlevoix Pro;
  letter-spacing: 1px;
  background: #ffffff00;
}

.popup-back {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  backdrop-filter: blur(5px);
}

.popup {
  position: relative;
  width: 415px;
  height: 269px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  transform: translate(-50%, -100%);
  left: 50%;
  top: 50%;
  border-radius: 10px;
  font-family: Arial, Helvetica, sans-serif;
}



.sub-division {
  display: flex;
  flex-direction: column;
  width: calc(20% - 30px);
}

.sub-division:last-child {
  width: 150px !important;
}

.platformColumn {
  width: calc(20% - 30px);
}

.platformColumn:last-child {
  width: 150px !important;
}

.platformColumn.actions {
  justify-content: flex-end;
  background-color: #ffffff;
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
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

.popup-btn-fermer {
  position: absolute;
  left: 60%;
  top: 75%;
  width: 145px;
  height: 40px;
  background-color: #14202c;
  border-radius: 6px !important;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

 */
</style>


<style>
.tableContent th {
  text-align: left;
  /* white-space: nowrap; */
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
}

.longText {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>