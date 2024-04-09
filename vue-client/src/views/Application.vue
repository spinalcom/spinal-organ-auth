<template>
  <v-app class="app">
    <div class="d-flex justify-end" style="min-width: 980px;">
      <v-card class="d-flex flex-column ml-2 pl-1 pt-1 pb-1 pr-1 justify-center rounded-lg" elevation="2">
        <BlueButton @click.native="displayAdd()" :icon="'mdi-plus'" title="AJOUTER UNE APPLICATION" :val="'blue'" />
      </v-card>
    </div>
    <BachupInformation  title="TABLE DES APPLICATIONS">
      <div class="d-flex mb-2 mt-4">
        <div style="width: 22%;">Nom d'utilisateur</div>
        <div style="width: 78%">État</div>
      </div>
      <div v-for="item in appList" :key="item.id">
        <div class="d-flex mb-2">
          <div style="width: 22%;" class="content-list rounded-l-lg pl-10">{{ item.name }}</div>
          <div style="width: 78% ;" class="content-list">
            <div v-for="(platform, index) in item.platformList" class="d-flex" style="width: 100%">
              <StateButton :obj="'bos'" :content1="item.platformList[index].platformName" :content2="''" :icon="'mdi-chip'" />
              <StateButton :obj="'app'" :content1="item.platformList[index].appProfile.appProfileName"  :icon="'mdi-apps'" />
            </div>
          </div>
          <div class="content-list rounded-r-lg hover">
            <button class="pr-3" style="height: 100%;" @click="displayDetail(item)">
              <v-icon>mdi-arrow-right</v-icon>
            </button>
          </div>
        </div>
      </div>
    </BachupInformation>
  </v-app>
</template>

<script>
import BlueButton from "../Components/BlueButton.vue"
import BachupInformation from "../Components/BackupInformation.vue"
import StateButton from "../Components/StateButton.vue"
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    BlueButton,
    BachupInformation,
    StateButton
  },
  data: () => ({
    token: "",
    // appList: [{
    //   name: 'nom de l app',
    // }],
  }),

  methods: {
    

    updateAppList() {
      this.$store.dispatch('applications/getApplist')
    },

    displayDetail(item) {
      // this.$router.push("/DetailApp");
      this.$router.push({ name: "DetailApp", query: { id: item.id } });
    },
    displayAdd() {
      this.$router.push("/AddApp");
      
    },
  },
  computed: {
    ...mapGetters({ appList: 'applications/appList' }),
  },
  created() {
    this.updateAppList()
  }
}

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
</style>
