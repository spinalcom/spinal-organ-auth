<template>
  <v-app class="app">
    <div class="d-flex justify-end" style="min-width: 980px">
      <div class="d-flex flex-row align-center ml-2 pl-1 pt-1 pb-1 pr-1 justify-center rounded-lg headerActions"
        elevation="2">
        <!-- <BlueButton @click.native="displayAdd()" :icon="'mdi-plus'" title="AJOUTER UNE APPLICATION" :val="'blue'" /> -->

        <v-text-field v-model="search" class="appSearch" append-icon="mdi-magnify" label="Rechercher" outlined dense
          clearable hide-details></v-text-field>

        <v-btn color="#14202C" dark large @click.native="displayAdd()">
          <v-icon left> mdi-plus </v-icon>
          AJOUTER UNE APPLICATION
        </v-btn>
      </div>
    </div>
    <BachupInformation title="TABLE DES APPLICATIONS">
      <div class="d-flex mb-2 mt-4">
        <div style="width: 22%">Nom d'utilisateur</div>
        <div style="width: 78%">État</div>
      </div>
      <div v-for="item in filteredAppList" :key="item.id">
        <div class="d-flex mb-2">
          <div style="width: 22%" class="content-list rounded-l-lg pl-10">
            {{ item.name }}
          </div>
          <div style="width: 78%" class="content-list">
            <div v-for="(platform, index) in item.platformList" :key="`${item.id}-${platform.platformId || index}`"
              class="d-flex" style="width: 100%">
              <StateButton :obj="'bos'" :content1="platform.platformName" :content2="''" :icon="'mdi-chip'" />
              <StateButton :obj="'app'" :content1="platform.appProfile.appProfileName" :icon="'mdi-apps'" />
            </div>
          </div>
          <div class="content-list rounded-r-lg actions-cell">
            <button class="action-btn hover" title="Supprimer" @click="deleteApp(item)">
              <v-icon>mdi-trash-can-outline</v-icon>
            </button>

            <button class="action-btn hover" title="Modifier" @click="displayEdit(item)">
              <v-icon>mdi-pencil</v-icon>
            </button>

            <button class="action-btn hover" title="Détails" @click="displayDetail(item)">
              <v-icon>mdi-arrow-right</v-icon>
            </button>
          </div>
        </div>
      </div>
    </BachupInformation>
  </v-app>
</template>

<script>
import BachupInformation from "../Components/BackupInformation.vue";
import StateButton from "../Components/StateButton.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      search: "",
    };
  },
  components: {
    BachupInformation,
    StateButton,
  },
  methods: {
    updateAppList() {
      this.$store.dispatch("applications/getApplist");
    },

    displayDetail(item) {
      // this.$router.push("/DetailApp");
      this.$router.push({ name: "DetailApp", query: { id: item.id } });
    },

    displayEdit(item) {
      this.$router.push({ name: "EditApp", query: { id: item.id } });
    },

    async deleteApp(item) {
      await this.$store.dispatch("applications/deleteApp", item.id);
      this.updateAppList();
    },

    displayAdd() {
      this.$router.push("/AddApp");
    },
  },
  computed: {
    ...mapGetters({ appList: "applications/appList" }),
    filteredAppList() {
      const query = this.search.trim().toLowerCase();
      if (!query) return this.appList;

      return this.appList.filter((item) => {
        const appName = String(item.name || "").toLowerCase();
        const hasAppName = appName.includes(query);

        const hasPlatformMatch = (item.platformList || []).some((platform) => {
          const platformName = String(platform.platformName || "").toLowerCase();
          const appProfileName = String(
            (platform.appProfile && platform.appProfile.appProfileName) || ""
          ).toLowerCase();

          return (
            platformName.includes(query) || appProfileName.includes(query)
          );
        });

        return hasAppName || hasPlatformMatch;
      });
    },
  },
  created() {
    this.updateAppList();
  },
};
</script>

<style scoped>
.app {
  font: normal normal normal 10px/12px Charlevoix Pro;
  letter-spacing: 1px;
  background: #eeeeee00;
}

.content-list {
  border: 1px solid rgba(216, 216, 216, 0.623);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  min-height: 50px;
  padding-left: 10px;
  font: normal normal normal 12px/14px Charlevoix Pro;
  letter-spacing: 1.2px;
  flex-wrap: wrap;
  margin: 1px;
}

.hover:hover {
  background: rgb(228, 228, 228);
  transition: 0.3s;
}

.appSearch {
  width: 320px;
  margin-right: 10px;
}

.headerActions {
  gap: 8px;
}

.actions-cell {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: flex-end;
  gap: 4px;
  min-width: 145px;
  padding-left: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 50px;
  width: 42px;
  border: 0;
  background: transparent;
  cursor: pointer;
}
</style>
