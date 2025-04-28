<template>
  <v-app class="app">
    <!-- <div class="d-flex justify-end" style="width: 100%; min-width: 980px">
      <InputPassword :readonly="true" id="password" v-model="this.token" />
      <v-card
        class="d-flex flex-column ml-2 pl-1 pt-1 pb-1 pr-1 justify-center rounded-lg"
        elevation="2"
      >
        <BlueButton
          @click.native="generateKey()"
          :icon="'mdi-sync'"
          title="GÉNERER UNE CLÉ"
          :val="'blue'"
        />
      </v-card>
    </div> -->

    <div class="d-flex justify-end" style="width: 100%; min-width: 980px">
      <v-card class="d-flex flex-column ml-2 pl-1 pt-1 pb-1 pr-1 justify-center rounded-lg" elevation="2">
        <BlueButton @click.native="goToCreatePlatform()" :icon="'mdi-plus'" title="AJOUTER UNE PLATEFORME"
          :val="'blue'" />
      </v-card>
    </div>

    <BachupInformation title="LISTE DES PLATEFORMES">
      <div class="d-flex mt-2">
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

        <!-- <div class="sub-division">
          <span class="subtitle-backbar">Methode de connexion</span>
        </div> -->

        <div class="sub-division">
          <span class="subtitle-backbar"></span>
        </div>
      </div>

      <div v-for="item in this.platformList" :key="item.id">
        <div class="d-flex mb-2">
          <div class="d-flex flex-column platformColumn ">
            <div class="btn-valider-user rounded-l-lg">
              <!-- <StateButton :obj="'bos'" :content1="item.name" :icon="'mdi-chip'" /> -->
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
              <!-- <StatutButton
                :val="lastSyncTime"
                :title="item.lastSyncTime || 'unknown'"
              ></StatutButton> -->
            </div>
          </div>

          <!-- <div class="d-flex flex-column platformColumn">
            <div class="btn-valider-user">
              <span>{{ item.authentication_method }}</span>
            </div>
          </div> -->


          <div class="d-flex platformColumn actions">
            <div class="btn-valider-user rounded-r-lg pr-2 hover">
              <button @click="deletePlatform(item)">
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
              <button @click="displayDetail(item)">
                <v-icon>mdi-arrow-right</v-icon>
              </button>
            </div>
          </div>

        </div>
      </div>
    </BachupInformation>

    <div v-if="show" class="popup-back">
      <v-card class="popup">
        <div @click="show = false" class="popup-closebtn">
          <span>X</span>
        </div>
        <p class="mb-12">NOUVELLE CLÉ</p>
        <InputUser :readonly="true" class="mb-12 mt-6" title="CLÉ ENREGISTRÉE" :value="this.registerKey.value">
        </InputUser>
        <div @click="show = false" class="mt-4 ml-1 popup-btn-fermer">
          <span>FERMER</span>
        </div>
      </v-card>
    </div>
  </v-app>
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
      console.log(platform)
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

.btn-valider-user {
  background-color: #ffffff;
  height: 100%;
  display: flex;
  align-items: center;
  min-height: 50px;
  padding-left: 10px;
  font: normal normal normal 12px/14px Charlevoix Pro;
  letter-spacing: 1.2px;
  margin: 1px;
}

.sub-division {
  display: flex;
  flex-direction: column;
  /* width: 14%; */
  width: calc(20% - 30px);
}

.sub-division:last-child {
  width: 150px !important;
}

.platformColumn {
  /* width: 14%; */
  width: calc(20% - 30px);
}

.platformColumn:last-child {
  /* width: 14%; */
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

.hover:hover {
  background: rgb(228, 228, 228);
  transition: 0.3s;
}
</style>
