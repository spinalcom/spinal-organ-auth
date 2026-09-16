<template>
  <v-card class="platformListCard" elevation="4">
    <div class="addPlatformBtn">
      <!-- <BlueButton @click.native="goToCreatePlatform()" :icon="'mdi-plus'" title="AJOUTER UNE PLATEFORME"
        :val="'blue'" /> -->

      <v-text-field v-model="search" class="platformSearch" append-icon="mdi-magnify" label="Rechercher" outlined dense
        clearable hide-details></v-text-field>

      <v-btn color="#14202C" dark large @click.native="goToCreatePlatform()">
        <v-icon left> mdi-plus </v-icon>
        AJOUTER UNE PLATEFORME
      </v-btn>
    </div>

    <div v-if="isUsingDemoData" class="demoDataInfo">
      Donnees de demonstration affichees (liste API vide)
    </div>

    <v-data-table class="tableContent" :headers="headers" :items="displayedPlatformList" :search="search"
      disable-pagination hide-default-footer>
      <template slot="item.userProfiles" slot-scope="{ item }">
        {{ item.userProfiles.length }}
      </template>

      <template slot="item.organs" slot-scope="{ item }">
        {{ item.organs.length }}
      </template>

      <template slot="item.appProfiles" slot-scope="{ item }">
        {{ item.appProfiles.length }}
      </template>

      <template slot="item.lastSyncTime" slot-scope="{ item }">
        <div class="btn-valider-user">
          <span>{{ getLastTimeSyncValue(item.lastSyncTime) }}</span>
        </div>
      </template>

      <template slot="item.actions" slot-scope="{ item }">
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
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import * as moment from "moment";
import { askConfirmation } from "../services/popup";


export default {
  name: "App",
  data: () => ({
    search: "",
    headers: [
      { cellClass: "longText", text: "Nom", value: "name", width: "300px" },
      {
        cellClass: "longText",
        text: "Id client",
        value: "clientId",
        width: "300px",
      },
      { text: "Nombre de Profil d'utilisateur", value: "userProfiles" },
      { text: "Nombre d'organe", value: "organs" },
      { text: "Nombre de Profil d'application", value: "appProfiles" },
      { text: "dernière synchronisation", value: "lastSyncTime" },
      { text: "", value: "actions", width: "300px" },
    ],
  }),

  methods: {
    getLastTimeSyncValue(date) {
      return date ? moment(date).fromNow() : "never";
    },

    getDataFromStore() {
      this.$store.dispatch("platforms/getPlatformlist");
    },

    goToCreatePlatform() {
      this.$router.push({ name: "AddPlatform" });
    },

    displayDetail(item) {
      this.$router.push({ name: "DetailPlatform", query: { id: item.id } });
    },

    async deletePlatform(item) {
      const res = await askConfirmation(
        `Voulez-vous supprimer la plateforme "${item.name}"`
      );
      if (res) this.$store.dispatch("platforms/deletePlatform", item.id);
    },

    syncData(platform) {
      this.$store.dispatch("platforms/syncData", { paltformId: platform.id });
    },

    goToEdit(plateforme) {
      this.$router.push({ name: "EditPlatform", query: { id: plateforme.id } });
    },
  },
  computed: {
    ...mapGetters({
      platformList: "platforms/platformList",
    }),
    displayedPlatformList() {
      if (Array.isArray(this.platformList) && this.platformList.length > 0) {
        return this.platformList;
      }

      return [];
    },
    isUsingDemoData() {
      return (
        !Array.isArray(this.platformList) || this.platformList.length === 0
      );
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
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
}

.platformSearch {
  max-width: 320px;
}

.demoDataInfo {
  margin: 0 0 10px;
  padding: 8px 12px;
  border-radius: 6px;
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  font-size: 12px;
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
