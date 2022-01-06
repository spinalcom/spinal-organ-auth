<!--
Copyright 2021 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-primary">
          <div class="card-icon">
            <md-icon v-if="display === false">apps</md-icon>
            <md-icon @click.native="cancelAdd" v-if="display === true"
              >arrow_back</md-icon
            >
          </div>
          <h4 class="title" v-if="display === false">Liste de plateformes</h4>
          <h4 class="title" v-if="display === true">Ajouter une Platefome</h4>
          <md-table
            v-if="display === false"
            :value="platformList"
            :md-sort-order.sync="currentSortOrder"
            :md-sort-fn="customSort"
            class="paginated-table table-striped table-hover"
          >
            <hr />
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Intitulé" md-sort-by="name">{{
                item.name
              }}</md-table-cell>
              <md-table-cell md-label="Actions">
                <md-icon
                  class="text-center text-primary"
                  @click.native="showItem(item)"
                  >visibility</md-icon
                >
                <md-icon
                  class="text-center text-primary"
                  @click.native="editItem(item)"
                  >edit</md-icon
                >
                <md-icon
                  class="text-center text-primary"
                  @click.native="deleteItem(item)"
                  >delete</md-icon
                >
              </md-table-cell>
            </md-table-row>
          </md-table>
          <md-button
            class="md-primary pull-right"
            v-if="display === false"
            @click="displayAdd()"
            >Ajouter</md-button
          >
        </md-card-header>
        <md-card-content>
          <ValidationObserver ref="form" v-if="display === true">
            <form @submit.prevent="validate" v-if="display === true">
              <div class="md-layout">
                <div class="md-layout-item md-size-50 mt-4 md-small-size-50">
                  <md-field>
                    <label>Platform Name</label>
                    <md-input v-model="platformData.platformName" type="text">
                    </md-input>
                  </md-field>

                  <md-field>
                    <label>Servers :</label>
                    <multiselect
                      v-model="serverValue"
                      :options="serverList"
                      :multiple="true"
                      :close-on-select="false"
                      :clear-on-select="false"
                      :preserve-search="true"
                      placeholder="Select one or more servers"
                      track-by="name"
                      label="name"
                    >
                      <span slot="noResult"
                        >Oops! No elements found. Consider changing the search
                        query.</span
                      >
                    </multiselect>
                  </md-field>
                </div>

                <div class="md-layout-item md-size-50 mt-4 md-small-size-50">
                  <AddServer v-if="display === true"></AddServer>
                </div>
              </div>
              <hr />
              <md-card-actions>
                <div>
                  <md-button @click="cancelAdd" class="btn-next md-danger">
                    Annuler
                  </md-button>
                  <md-button @click="savePlatform" class="btn-next md-primary">
                    Enregistrer
                  </md-button>
                </div>
              </md-card-actions>
            </form>
          </ValidationObserver>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>
<script>
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
  components: { Multiselect, AddServer },
  data: () => ({
    test: "",
    token: null,
    display: false,
    serverValue: null,
    serverList: [],
    currentSort: "name",
    currentSortOrder: "asc",
    platformData: {
      platformName: ""
    },
    platformList: []
  }),
  computed: {},
  methods: {
    async savePlatform() {
      if (this.platformData.platformName !== "") {
        const rep = await axios.post(
          "http://localhost:4040/platforms",
          { name: this.platformData.platformName },
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": this.token
            }
          }
        );
        this.display = false;
      }
      this.reloadData();
    },
    showItem(item) {
      // console.log(item);
    },
    editItem(item) {},
    async deleteItem(item, ask = true) {
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
      // console.log("servers", rep.data);
    },
    async getServers() {
      const rep = await axios.get("http://localhost:4040/servers", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
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
      this.display = true;
    },
    cancelAdd() {
      this.display = false;
      this.$refs.form.reset();
    },
    reloadData() {
      this.getPlatforms();
      this.getServers();
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.getServers();
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
</script>
<style lang="css" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>
