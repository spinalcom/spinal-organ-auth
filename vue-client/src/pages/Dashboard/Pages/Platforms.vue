<template>
<<<<<<< Updated upstream
  <div class="md-layout">
    <div class="md-layout-item md-size-95 mt-4 md-small-size-100">
      <div>
        <md-button
          class="md-warning pull-right"
          v-if="
            displayAddPlatform === false &&
            displayEditPlatform === false &&
            displayConfigServer === false
          "
          @click="displayAdd()"
          >Add Platform</md-button
        >
        <md-button
          class="md-warning pull-right"
          v-if="
            displayAddPlatform === false &&
            displayEditPlatform === false &&
            displayConfigServer === false
          "
          @click="generateRegisterKey()"
          >Generate Registration Key</md-button
        >
      </div>
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-primary">
          <div class="card-icon">
            <md-icon
              v-if="
                displayAddPlatform === false &&
                displayEditPlatform === false &&
                displayConfigServer === false
              "
              >hub</md-icon
            >
            <md-icon
              class="cursorP"
              @click.native="cancelAdd"
              v-if="
                displayAddPlatform === true ||
                displayEditPlatform === true ||
                displayConfigServer == true
              "
              >arrow_back</md-icon
            >
          </div>
          <h4
            class="title"
            v-if="
              displayAddPlatform === false &&
              displayEditPlatform === false &&
              displayConfigServer === false
            "
          >
            Liste de plateformes
          </h4>
          <h4 class="title" v-if="displayAddPlatform === true">
            Add a Platefom
          </h4>
          <h4 class="title" v-if="displayEditPlatform === true">
            Edit a Platefom
          </h4>
          <h4 class="title" v-if="displayConfigServer === true">
            Config a Server
          </h4>
          <md-table
            v-if="
              displayAddPlatform === false &&
              displayEditPlatform === false &&
              displayConfigServer === false
            "
            :value="platformList"
            :md-sort-order.sync="currentSortOrder"
            :md-sort-fn="customSort"
            class="paginated-table table-striped table-hover"
          >
            <md-table-row slot="md-table-row" slot-scope="{ item }" md-expand>
              <md-table-cell md-label="name" md-sort-by="name">{{
                item.name
              }}</md-table-cell>
              <md-table-cell md-label="Servers"
                >{{ serverLength(item) }}
              </md-table-cell>
              <md-table-cell md-label="Server Config">
                <md-icon
                  class="text-center text-primary cursorP"
                  @click.native="showPanelConfigServer(item)"
                  >chevron_right</md-icon
                >
              </md-table-cell>

              <md-table-cell md-label="Edit">
                <md-icon
                  class="text-center text-primary cursorP"
                  @click.native="showEditPlatformItem(item)"
                  >edit</md-icon
                >
              </md-table-cell>

              <md-table-cell md-label="Delete">
                <md-icon
                  class="text-center text-primary cursorP"
                  @click.native="deletePlatformItem(item)"
                  >delete</md-icon
                >
              </md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-header>
        <md-card-content v-if="displayAddPlatform === true">
          <form novalidate class="md-layout" @submit.prevent="validatePlatform">
            <md-card class="md-layout md-size-100 md-small-size-100">
              <md-card-content>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-small-size-100">
                    <md-field :class="getValidationClass('platformName')">
                      <label for="platformName">Platform Name</label>
                      <md-input
                        name="platformName"
                        id="platformName"
                        autocomplete="given-name"
                        v-model="formPlatform.platformName"
                        :disabled="sending"
                      >
                      </md-input>
                      <span
                        class="md-error"
                        v-if="!$v.formPlatform.platformName.required"
                        >The name is required
                      </span>
                      <span
                        class="md-error"
                        v-else-if="!$v.formPlatform.platformName.minlength"
                        >Invalid name
                      </span>
                    </md-field>
                  </div>
                </div>
              </md-card-content>
              <md-progress-bar md-mode="indeterminate" v-if="sending" />
              <md-card-actions>
                <md-button @click="cancelAdd" class="btn-next md-danger">
                  Cancel
                </md-button>
                <md-button
                  type="submit"
                  class="btn-next md-primary"
                  :disabled="sending"
                >
                  register
                </md-button>
              </md-card-actions>
            </md-card>
            <md-snackbar
              :md-active.sync="platformSaved"
              :md-position="position"
              :md-duration="isInfinity ? Infinity : duration"
              md-persistent
            >
              <span>
                The platform {{ lastPlatform }} was saved with success!
              </span>
            </md-snackbar>
          </form>
        </md-card-content>

        <!-- ************************************************* -->

        <form
          novalidate
          class="md-layout"
          @submit.prevent="validateEditPlatform"
          v-if="displayEditPlatform === true"
        >
          <md-card class="md-layout md-size-100 md-small-size-100">
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('platformName')">
                    <label for="platformName">Platform Name</label>
                    <md-input
                      name="platformName"
                      id="platformName"
                      autocomplete="given-name"
                      v-model="formPlatform.platformName"
                      :disabled="sending"
                    >
                    </md-input>
                    <span
                      class="md-error"
                      v-if="!$v.formPlatform.platformName.required"
                      >The name is required
                    </span>
                    <span
                      class="md-error"
                      v-else-if="!$v.formPlatform.platformName.minlength"
                      >Invalid name
                    </span>
                  </md-field>
                </div>
              </div>
            </md-card-content>
            <md-progress-bar md-mode="indeterminate" v-if="sending" />
            <md-card-actions>
              <md-button @click="cancelAdd" class="btn-next md-danger">
                Cancel
              </md-button>
              <md-button
                type="submit"
                class="btn-next md-primary"
                :disabled="sending"
              >
                Edit
              </md-button>
            </md-card-actions>
          </md-card>
          <md-snackbar
            :md-active.sync="platformSaved"
            :md-position="position"
            :md-duration="isInfinity ? Infinity : duration"
            md-persistent
          >
            <span>
              The platform {{ lastPlatform }} was updated with success!
            </span>
          </md-snackbar>
        </form>

        <!-- ********************************************************************** -->

        <div
          class="md-layout md-size-100 md-small-size-100"
          v-if="displayConfigServer === true"
        >
          <div class="md-layout-item">
            <md-list
              v-for="(server, index) in serverList"
              :key="index"
              class="md-double-line"
            >
              <md-subheader>
                {{ server.name
                }}<md-icon class="md-primary">dns</md-icon></md-subheader
              >
              <!-- <md-list-item>{{ server.name }}</md-list-item>
              <md-list-item>{{ server.clientId }}</md-list-item>
              <md-list-item>{{ server.clientSecret }}</md-list-item>
              <md-list-item>{{ server.uri }}</md-list-item> -->
              <!-- <md-list-item
                v-for="(profile, index) in server.profileList"
                :key="index"
              >
                <div class="md-list-item-text">
                  <ul>
                    {{
                      profile.data.name
                    }}
                    :
                    <li v-for="(role, index) in profile.role" :key="index">
                      {{ profile.name }}
                    </li>
                  </ul>
                </div>
              </md-list-item> -->
            </md-list>
          </div>

          <AddServer
            class="md-layout-item"
            :itemSelectedId="itemSelected.id"
          ></AddServer>
=======
    <v-app class="app">

        <div style="width: 100%; display:flex; justify-content: end;">
            <v-card class="d-flex flex-column ml-2 pt-2 pb-2 bar-bloc-right justify-center rounded-lg" elevation="2">
                <BlueButton @click.native="generateRegisterKey()" :icon="'mdi-sync'" title="GÉNERER UN CLÉ"
                    :val="'blue'"/>
            </v-card>
        </div>

        <BachupInformation :subtitle1="`NOM DE PLATFORME`" :subtitle2="'ÉTAT'" title="PLATFORM LIST">
            <div v-for="item in platformList" :key="item.id">
                <div class="d-flex mb-2">
                    <div style="width: 25%" class="d-flex flex-column">
                        <div class="btn-valider-user rounded-l-lg">{{item.name}}</div>
                    </div>
                    <div style="width: 15%" class="d-flex flex-column ">
                        <div class="btn-valider-user">
                            <button>{{item.organs.length}}</button>
                        </div>
                    </div>
                    <div style="width: 15%" class="d-flex flex-column ">
                        <div class="btn-valider-user">
                            <button>{{ item.userProfiles.length }}</button>
                        </div>
                    </div>
                    <div style="width: 15%" class="d-flex flex-column ">
                        <div class="btn-valider-user">
                            <button>{{item.appProfiles.length }}</button>
                        </div>
                    </div>
                    <div style="width: 35%" class="d-flex flex-column ">
                        <div class="btn-valider-user">
                            <StatutButton :val="item.statusPlatform" title="ONLINE"></StatutButton>
                        </div>
                    </div>
                    <div class="d-flex flex-column ">
                        <div class="btn-valider-user rounded-r-lg">
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
                <p style="margin-bottom: 50px;">NOUVELLE CLÉ</p>
                <InputUser class="mb-12 mt-6" title="REGISTERED" :value="this.registerKey.value"></InputUser>
                <div class="mt-6" style="padding-left:60%">
                    <BlueButton @click.native="show = false" title="FERMER" :val="'blue'" />
                </div>
            </v-card>

>>>>>>> Stashed changes
        </div>

    </v-app>
</template>
  
<script>
<<<<<<< Updated upstream
import {
  SpinalGraph,
  SpinalGraphService
} from "spinal-env-viewer-graph-service";
// import Places from 'vue-places'
import AddServer from "./AddServer.vue";
import EventBus from "../../../EventBus";
import axios from "axios";
import Multiselect from "vue-multiselect";
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
export default {
  name: "Platform",
  mixins: [validationMixin],
  components: { AddServer },
  data: () => ({
    token: null,
    position: "center",
    duration: 3000,
    isInfinity: false,
    displayAddPlatform: false,
    displayEditPlatform: false,
    displayConfigServer: false,
    itemSelected: null,
    formPlatform: {
      platformName: null
    },
    platformSaved: false,
    sending: false,
    lastPlatform: null,
    currentSort: "name",
    currentSortOrder: "asc",
    platformList: [],
    serverList: []
  }),
  validations: {
    formPlatform: {
      platformName: {
        required,
        minLength: minLength(3)
      }
    }
  },
  computed: {},
  methods: {
    generateRegisterKey() {},
    async savePlatform() {
      this.sending = true;
      const rep = await axios.post(
        "http://localhost:4040/platforms",
        {
          name: this.formPlatform.platformName
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      if (rep !== undefined) {
        window.setTimeout(() => {
          this.lastPlatform = `${this.formPlatform.platformName}`;
          this.platformSaved = true;
          this.sending = false;
          this.clearForm();
        }, 1500);
      }
      this.reloadData();
    },
    showEditPlatformItem(item, ask = true) {
      let r = true;
      if (ask)
        r = confirm(
          "Are you sure you want to update the platform, you can lost the old config of this platform!"
        );
      if (r === true) {
        this.displayEditPlatform = true;
        this.itemSelected = item;
      }
    },
    async editPlatformItem() {
      const rep = await axios.put(
        `http://localhost:4040/platforms/${this.itemSelected.id}`,
        {
          name: this.formPlatform.platformName
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      if (rep !== undefined) {
        window.setTimeout(() => {
          this.lastPlatform = `${this.formPlatform.platformName}`;
          this.platformSaved = true;
          this.sending = false;
          this.clearForm();
        }, 1500);
      }
      this.reloadData();
    },
    showPanelConfigServer(item) {
      this.displayConfigServer = true;
      this.itemSelected = item;
      this.getServers();
      const arr = [...this.platformList];
      const element = arr.find(el => {
        return el.id == item.id;
      });
    },
    async deletePlatformItem(item, ask = true) {
      let r = true;
      if (ask)
        r = confirm(
          "Are you sure you want to delete the platform, you can lost all config of this platform!"
        );
      if (r === true) {
        await axios.delete(`http://localhost:4040/platforms/${item.id}`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        });
      }
      this.reloadData();
    },
    async getPlatforms() {
      const rep = await axios.get("http://localhost:4040/platforms", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.platformList = rep.data;
    },
    async getServers() {
      const rep = await axios.get(
        `http://localhost:4040/platforms/${this.itemSelected.id}/getServers`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      this.serverList = rep.data;
    },
    customSort(value) {
      return value.sort((a, b) => {
        const sortBy = this.currentSort;
        if (this.currentSortOrder === "desc") {
          return a[sortBy].localeCompare(b[sortBy]);
        }
        return b[sortBy].localeCompare(a[sortBy]);
      });
    },
    displayAdd() {
      this.displayAddPlatform = true;
    },
    cancelAdd() {
      this.$v.$reset();
      this.displayAddPlatform = false;
      this.displayEditPlatform = false;
      this.displayConfigServer = false;
    },
    reloadData() {
      this.getPlatforms();
      // this.getServers();
=======
const instanceAxios = require("../../../services/axiosConfig");
import BlueButton from "../Components/BlueButton.vue"
import StatutButton from "../Components/StatutButton.vue"
import InputUser from "../Components/InputUser.vue"
import BachupInformation from "../Components/BackupInformation.vue"


export default {
    name: "App",
    components: {
        BlueButton,
        BachupInformation,
        StatutButton,
        InputUser
    },
    data: () => ({
        token: "",
        platformList: [],
        registerKey: { value: null },
        show: false,

    }),

    methods: {
        async generateRegisterKey() {
            const rep = await instanceAxios.instanceAxios.post(
                "/registerKey",
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.token
                    }
                }
            );
            this.show = true;
            this.registerKey = rep.data;
        },

        displayDetail(item) {
            this.$router.push({ name: "DetailPlatform", query: { id: item.id } });
        },
        async getOrgans(platformId) {
            const rep = await instanceAxios.instanceAxios.get(
                `/organs/${platformId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.token
                    }
                }
            );
            return rep.data;
        },
        async getUserProfiles(platformId) {
            const rep = await instanceAxios.instanceAxios.get(
                `/platforms/${platformId}/getUserProfileList`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.token
                    }
                }
            );
            return rep.data;
        },
        async getAppProfiles(platformId) {
            const rep = await instanceAxios.instanceAxios.get(
                `/platforms/${platformId}/getAppProfileList`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.token
                    }
                }
            );
            return rep.data;
        },
        async getPlatforms() {
            const rep = await instanceAxios.instanceAxios.get("/platforms", {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": this.token
                }
            });
            // this.platformList = rep.data;
            const test = rep.data.map(async item => {
                item.organs = await this.getOrgans(item.id);
                item.userProfiles = await this.getUserProfiles(item.id);
                item.appProfiles = await this.getAppProfiles(item.id);
                return item;
            });
            this.platformList = await Promise.all(test);
        },
>>>>>>> Stashed changes
    },

    mounted() {
        this.token = localStorage.getItem("token");
        this.getPlatforms();
    },
}

<<<<<<< Updated upstream
      if (!this.$v.$invalid) {
        this.editPlatformItem();
      }
    },
    serverLength(item) {
      return "in progress";
    },
    getValidationClass(fieldName) {
      const field = this.$v.formPlatform[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.formPlatform.platformName = null;
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    // this.getServers();
    this.getPlatforms();
    EventBus.$on("reloadServerList", () => {
      this.getServers();
    });
  },
  watch: {
    /**
     * Searches through the table data by a given query.
     * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
     * @param value of the query
     */
    display: function(newValue) {}
  }
};
=======
>>>>>>> Stashed changes
</script>
  
<style scoped lang="scss">


.app {
    font: normal normal normal 10px/12px Charlevoix Pro;
    letter-spacing: 1px;
    background: #eeeeee00;
}

.popup-back {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 99;
    // transform: translate(-50%);
    // background-color: blue;
    backdrop-filter: blur(5px);
}
<<<<<<< Updated upstream
</style>
=======

.popup {
    width: 25%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    transform: translate(-50%, -100%);
    left: 50%;
    top: 50%;
    border-radius: 10px;
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
