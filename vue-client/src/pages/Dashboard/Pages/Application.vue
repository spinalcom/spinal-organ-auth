<template>
  <v-app class="app">

    <div style="width: 100%; display:flex; justify-content: end;">
      <v-card class="d-flex flex-column ml-2 pt-2 pb-2 bar-bloc-right justify-center rounded-lg" elevation="2">
        <BlueButton @click.native="displayAdd()" :icon="'mdi-plus'" title="AJOUTER UNE APPLICATION" :val="'blue'" />
      </v-card>
    </div>

<<<<<<< Updated upstream
<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-95 mt-4 md-small-size-100">
      <div class="buttonAdd">
        <md-button class="md-warning">Add Application</md-button>
      </div>
      <div class="md-layout-item md-size-100">
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
              <md-icon>backup_table</md-icon>
            </div>
            <h4 class="title">Backup Application Table</h4>
          </md-card-header>
          <md-card-content>
            <md-table v-model="userList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="State">{{
                  item.platformList
                }}</md-table-cell>
                <md-table-cell md-label="Detail" :class="getAlignClasses(item)">
                  <md-button
                    class="md-just-icon"
                    :class="getClass(item.icon1, item.id)"
                    ><md-icon>arrow_forward</md-icon></md-button
                  >
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
      <!-- <md-card-header class="md-card-header-icon md-card-header-primary">
          <h4 class="title" v-if="display === false">Select an Application</h4>

          <md-button
            class="md-primary pull-right"
            v-if="display === false"
            @click="displayAdd"
            >Nouvelle Application</md-button
          >
        </md-card-header> -->

      <!-- <md-card-content> -->
      <!-- <div class="md-layout" v-if="changeDGT === false">
            <div class="md-layout-item md-size-10"></div>
            <div class="md-layout-item md-size-80">
              <h3 class="text-center">
                User en cours :
              </h3>
              <br />
              <md-button @click="changeUser" class="btn-next md-primary">
                Changer
              </md-button>
            </div>
            <div class="md-layout-item md-size-10"></div>
          </div> -->
      <md-card>
        <ValidationObserver ref="form" v-if="display === true">
          <form ref="form" @submit.prevent="validate" v-if="display === true">
            <div>
              <div class="md-layout">
                <div class="md-layout-item">
                  <md-field>
                    <label>User Name</label>
                    <md-input v-model="userData.userName" type="text">
                    </md-input>
                  </md-field>
                  <md-field>
                    <label>password</label>
                    <md-input v-model="userData.password" type="password">
                    </md-input>
                  </md-field>
                  <!-- <md-field>
                     <label>role</label>
                     <md-input v-model="userData.role" type="text"> </md-input>
                      </md-field>
                      <br /> -->
                  <md-field>
                    <label>role</label>
                    <multiselect
                      v-model="userData.role"
                      :options="roleList"
                      placeholder="Selectionnez un ou plusieurs profiles"
                      label="name"
                    ></multiselect>
                  </md-field>
                  <br />
                  <md-field>
                    <label>Profiles d'utilisateurs :</label>
                    <multiselect
                      v-model="userProfileName"
                      :options="userProfile"
                      :multiple="true"
                      :close-on-select="false"
                      :clear-on-select="false"
                      :preserve-search="true"
                      placeholder="Selectionnez un ou plusieurs profiles"
                      track-by="name"
                      label="name"
                    >
                      <span slot="noResult"
                        >Oops! No elements found. Consider changing the search
                        query.</span
                      >
                    </multiselect>
                  </md-field>

                  <div class="md-layout-item md-size-100 mt-4 md-small-size-30">
                    <md-button class="btn-next md-primary">
                      Configuration des Droits
                    </md-button>

                    <br />
                    <br />
                    <!-- <ValidationProvider name="configList" ref="form"> -->
                    <multiselect
                      v-model="value"
                      :options="serverList"
                      placeholder="Sélectionner les serveurs autorisés"
                      track-by="name"
                      label="name"
                    >
                      <span slot="noResult"
                        >Oops! No elements found. Consider changing the search
                        query.</span
                      >
                    </multiselect>
                    <multiselect
                      v-model="value"
                      :options="serverList"
                      placeholder="Sélectionner les serveurs autorisés"
                      track-by="name"
                      label="name"
                    >
                      <span slot="noResult"
                        >Oops! No elements found. Consider changing the search
                        query.</span
                      >
                    </multiselect>
                    <!-- </ValidationProvider> -->
                    <br />

                    <md-button
                      @click="saveConfig()"
                      class="btn-next md-primary"
                    >
                      Valider
                    </md-button>
                  </div>

                  <md-card-actions>
                    <div>
                      <md-button @click="cancelAdd" class="btn-next md-danger">
                        Annuler
                      </md-button>
                      <md-button @click="saveUser" class="btn-next md-primary">
                        Enregistrer
                      </md-button>
                    </div>
                  </md-card-actions>
                </div>
              </div>
            </div>
          </form>
        </ValidationObserver>
        <!-- </md-card-content> -->
      </md-card>
      <!-- <md-button
      slot="footer"
      class="md-simple md-success md-lg"
      @click="showusers"
    >
      Users
    </md-button> -->
    </div>
    <div class="md-layout-item md-size-20 mt-4 md-small-size-100"></div>
  </div>
=======
    <BachupInformation :subtitle1="`NOM D'APPLICATION`" :subtitle2="'STATUT'" title="BACKUP APPLICATION TABLE">
      <div v-for="item in appList" :key="item.id">
        <div class="d-flex mb-2">
          <div style="width: 25%" class="d-flex flex-column">
            <div class="btn-valider-user rounded-l-lg">{{item.name}}</div>
          </div>
          <div style="width: 75%" class="d-flex flex-column ">
            <div class="btn-valider-user">
              <button>OFFLINE</button>
            </div>
          </div>
          <div class="d-flex flex-column ">
            <div class="btn-valider-user rounded-r-lg">
              <button style="height: 100%;" @click="displayDetail(item)">
                <v-icon>mdi-arrow-right</v-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </BachupInformation>
  </v-app>
>>>>>>> Stashed changes
</template>

<script>
<<<<<<< Updated upstream
import Multiselect from "vue-multiselect";
// register globally
// Vue.component("multiselect", Multiselect);
import {
  SpinalGraph,
  SpinalGraphService
} from "spinal-env-viewer-graph-service";
import axios from "axios";
export default {
  components: { Multiselect },
  data() {
    return {
      display: false,
      changeDGT: true,
      token: "",
      userList: [],
      serverList: [],
      value: null,
      userProfile: [],
      userProfileName: null,
      userData: {
        userName: "",
        password: "",
        roleList: [],
        rightsList: []
      },
      rightsObject: {
        userProfileName: [],
        plateformId: "",
        serverId: ""
      }
    };
  },
  computed: {},
=======
const instanceAxios = require("../../../services/axiosConfig");
import BlueButton from "../Components/BlueButton.vue"
import BachupInformation from "../Components/BackupInformation.vue"

export default {
  name: "App",
  components: {
    BlueButton,
    BachupInformation
  },
  data: () => ({
    token: "",
    appList: [],
  }),

>>>>>>> Stashed changes
  methods: {
    displayAdd() {
      this.display = true;
    },
    changeDigitalTwin() {
      this.changeDGT = true;
    },
    cancelAdd() {
      this.display = false;
      this.$refs.form.reset();
    },
    saveConfig() {
      const checkIndex = res => res.data;
    },
    saveUser() {
      // console.log("**********************", this.userData);
    },
    changeUser() {},
    getInfoUser() {},
    async getRoles() {
      const rep = await axios.post("http://localhost:4040/users/getRoles", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.roleList = rep.data;
      // console.log("roles", rep.data);
    },
    async getServers() {
      const rep = await axios.get("http://localhost:4040/servers", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.serverList = rep.data;
      // console.log("servers", rep.data);
    },
    async getUserProfile() {
      const rep = await axios.post(
        "http://localhost:4040/users/userProfilesList/",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      this.userProfile = rep.data;
      // console.log("list profile users", rep.data);
    },
<<<<<<< Updated upstream
    async getUsers() {
      const rep = await axios.get("http://localhost:4040/users", {
=======
    displayDetail(item) {
      this.$router.push({ name: "DetailApp", query: { id: item.id } });
    },
    async getApplications() {
      const rep = await instanceAxios.instanceAxios.get("/applications", {
>>>>>>> Stashed changes
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
<<<<<<< Updated upstream
      this.userList = rep.data;
      // console.log("users", rep.data);
    },
    getClass: function(item, id) {
      let classes = "";
      switch (item) {
        case "person": {
          classes = "md-info";
          break;
        }
        case "edit": {
          classes = "md-success";
          break;
        }
        case "close": {
          classes = "md-danger";
          break;
        }
      }
      switch (id) {
        case 1:
        case 5: {
          break;
        }
        case 2:
        case 4: {
          classes = `${classes} md-round`;
          break;
        }
        case 3: {
          classes = `${classes} md-simple`;
          break;
        }
      }
      return classes;
    },
    getAlignClasses: ({ id }) => ({
      "text-right": id
    })
=======
      this.appList = rep.data;
    }
>>>>>>> Stashed changes
  },

  mounted() {
    this.token = localStorage.getItem("token");
    this.getUsers();
    this.getUserProfile();
  },
}
<<<<<<< Updated upstream
.backupUser {
  margin-top: 50px;
}
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
=======

</script>

<style scoped lang="scss">
.app {
  font: normal normal normal 10px/12px Charlevoix Pro;
  letter-spacing: 1px;
  background: #eeeeee00;
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
}
</style>
>>>>>>> Stashed changes
