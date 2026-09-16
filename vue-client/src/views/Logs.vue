<template>
  <v-app class="app">
    <v-card style="background-color: #f7f7f7; min-width: 980px; padding: 10px">
      <div @click="affichage()">
        <div class="titlelog">LISTE DES LOGS</div>
        <v-card-title class="filtersBar">
          <v-text-field class="search" v-model="search" append-icon="mdi-magnify" outlined dense clearable
            placeholder="Rechercher (type, acteur, resultat)" label="Rechercher" hide-details>
          </v-text-field>

          <v-select class="filterField" v-model="selectedEventType" :items="eventTypeOptions" label="Type d'evenement"
            outlined dense clearable hide-details></v-select>

          <v-select class="filterField" v-model="selectedActor" :items="actorOptions" label="Acteur" outlined dense
            clearable hide-details></v-select>

          <v-text-field class="dateField" v-model="dateFrom" label="Du" type="date" outlined dense
            hide-details></v-text-field>

          <v-text-field class="dateField" v-model="dateTo" label="Au" type="date" outlined dense
            hide-details></v-text-field>

          <v-btn outlined color="#14202C" class="resetBtn" @click="resetFilters">
            Reinitialiser
          </v-btn>
        </v-card-title>
        <v-data-table fixed-header style="background-color: #f7f7f7" :footer-props="{
          'items-per-page-options': [10, -1],
        }" :items-per-page="30" height="70vh" :headers="headers" :items="filteredLogList">
        </v-data-table>
      </div>
    </v-card>
  </v-app>
</template>

<script>
import BackupInformation from "../Components/BackupInformation.vue";
import FiltreBar from "../Components/FiltreBar.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    BackupInformation,
    FiltreBar,
  },
  data: () => ({
    token: "",
    search: "",
    value: null,
    logsdate1: "",
    logsdate2: "",
    logsnom: "",
    logsclientid: "",
    selectedEventType: null,
    selectedActor: null,
    dateFrom: "",
    dateTo: "",
    headers: [
      { text: "Type Dévénement", value: "parentsInfo.parent.name" },
      { text: "Date", value: "date" },
      { text: "Acteur", value: "actor.actorName" },
      { text: "Id Acteur", value: "actor.actorId" },
      { text: "Resultat", value: "message" },
    ],

    logPostion: {},
  }),

  methods: {
    updatelogList() {
      this.$store.dispatch("logs/getLogs");
    },
    affichage() {
      var a = document.querySelector(
        "#app > div.v-menu__content.theme--light.menuable__content__active"
      );
      if (a != null) {
        a.style.position = "fixed";
      }
    },
    resetFilters() {
      this.search = "";
      this.selectedEventType = null;
      this.selectedActor = null;
      this.dateFrom = "";
      this.dateTo = "";
    },
  },
  computed: {
    ...mapGetters({ logList: "logs/getlogList" }),
    normalizedLogList() {
      return this.logList.map((log) => {
        const dateObj = new Date(log.date);
        const isValidDate = !Number.isNaN(dateObj.getTime());
        const datePart = isValidDate
          ? dateObj.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          : "";
        const timePart = isValidDate
          ? dateObj.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          : "";
        const eventType =
          (log.parentsInfo &&
            log.parentsInfo.parent &&
            log.parentsInfo.parent.name) ||
          "";
        const actorName = (log.actor && log.actor.actorName) || "";
        const actorId = (log.actor && log.actor.actorId) || "";

        return {
          ...log,
          date: isValidDate ? `${datePart} à ${timePart}` : "",
          _dateTs: isValidDate ? dateObj.getTime() : null,
          _eventType: eventType,
          _actor: actorName,
          _actorKey: actorName
            ? `${actorName}${actorId ? ` (${actorId})` : ""}`
            : "",
        };
      });
    },
    eventTypeOptions() {
      return [...new Set(this.normalizedLogList.map((log) => log._eventType))]
        .filter(Boolean)
        .sort();
    },
    actorOptions() {
      return [...new Set(this.normalizedLogList.map((log) => log._actorKey))]
        .filter(Boolean)
        .sort();
    },
    filteredLogList() {
      const query = this.search.trim().toLowerCase();
      const fromTs = this.dateFrom
        ? new Date(`${this.dateFrom}T00:00:00`).getTime()
        : null;
      const toTs = this.dateTo
        ? new Date(`${this.dateTo}T23:59:59`).getTime()
        : null;

      return this.normalizedLogList.filter((log) => {
        if (this.selectedEventType && log._eventType !== this.selectedEventType) {
          return false;
        }

        if (this.selectedActor && log._actorKey !== this.selectedActor) {
          return false;
        }

        if (fromTs !== null && (log._dateTs === null || log._dateTs < fromTs)) {
          return false;
        }

        if (toTs !== null && (log._dateTs === null || log._dateTs > toTs)) {
          return false;
        }

        if (!query) return true;

        const rowText = [log._eventType, log._actor, log.message]
          .map((val) => String(val || "").toLowerCase())
          .join(" ");

        return rowText.includes(query);
      });
    },
  },

  created() {
    this.updatelogList();
  },
};
</script>

<style scoped>
.app {
  background: #eeeeee00;
}

.sub-division {
  display: flex;
  flex-direction: column;
  width: 20%;
}

.content_log {
  max-height: 800px;
  overflow: auto;
  width: 100%;
}

.v-data-table::-webkit-scrollbar {
  width: 10px;
}

.v-data-table::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(116, 116, 116);
  border-radius: 4px;
}

.v-data-table::-webkit-scrollbar-thumb {
  background: rgba(133, 133, 133, 0.281);
  border: 1px solid rgba(0, 82, 48, 0.212);
  border-radius: 4px;
}

.v-data-table::-webkit-scrollbar-thumb:hover {
  background: rgba(29, 29, 29, 0.281);
}

.information-backup-bar2 {
  background: rgb(255, 255, 255);
  /* display: flex;
    align-items: center; */
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10px;
  letter-spacing: 0.9px;
  height: 50px;
  margin-bottom: 3px;
  margin-top: 2px;
  margin-left: 1px;
  padding-left: 8px;
  width: 100px;
  /* width: 20%; */
}

.subtitle-backbar {
  width: 16%;
}

.parenttd {
  text-align: start;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10px;
  letter-spacing: 0.9px;
}

.childtd {
  background-color: white;
  border: 1px solid #f7f7f7;
  border-bottom: 2px solid #f7f7f7;
  padding: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  min-width: 156px;
  width: 20%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
  letter-spacing: 0.9px;
}

.v-data-table>>>td {
  background-color: white;
  border-top: 10px solid #f7f7f7;
  border-bottom: solid 0px black !important;
  height: 60px !important;
  font-size: 11px !important;
}

.v-data-table>>>th {
  background: #f7f7f7 !important;
}

#content>div>div>div>div.v-card__title {
  padding: 10px;
  background-color: rgb(255, 255, 255);
  border: 1px solid #e3e7e8;
  border-radius: 6px;
  margin-top: 20px;
}

#content>div>div>div>div.v-card__title>div {
  padding: 0px;
}

.filtersBar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.search {
  min-width: 260px;
  flex: 1 1 320px;
}

.filterField {
  min-width: 220px;
  flex: 1 1 220px;
}

.dateField {
  min-width: 170px;
  flex: 0 1 180px;
}

.resetBtn {
  height: 40px;
}

.titlelog {
  padding-top: 10px;
  padding-left: 10px;
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: 1.1px;
  font-size: 12px;
}
</style>
