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
            <md-icon v-if="display === false">hub</md-icon>
            <md-icon @click.native="cancelAdd" v-if="display === true"
              >arrow_back</md-icon
            >
          </div>
          <h4 class="title" v-if="display === false">
            Liste de profiles de serveurs
          </h4>
          <h4 class="title" v-if="display === true">Ajouter un Serveur</h4>
          <h4 class="title" v-if="display === true">
            Modifier un profil de serveur
          </h4>
          <h4 class="title" v-if="display === true">
            Détail du profil de serveur
          </h4>

          <md-table
            v-if="display === false"
            :value="serverList"
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
                  @click.native="displayAdd('detail', item)"
                  >visibility</md-icon
                >
                <md-icon
                  class="text-center text-primary"
                  @click.native="displayAdd('detail', item)"
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
              <div>
                <div class="md-layout">
                  <div
                    class="md-layout-item md-size-100 mt-4 md-small-size-100"
                  >
                    <br />
                    <md-field>
                      <label>Server Name</label>
                      <md-input v-model="serverData.serverName" type="text">
                      </md-input>
                    </md-field>
                    <md-field>
                      <label>Server Name</label>
                      <md-input v-model="serverData.serverName" type="text">
                      </md-input>
                    </md-field>
                    <md-field>
                      <label>Server Name</label>
                      <md-input v-model="serverData.serverName" type="text">
                      </md-input>
                    </md-field>
                  </div>
                </div>
              </div>
              <hr />
              <md-card-actions>
                <div>
                  <md-button @click="cancelAdd" class="btn-next md-danger">
                    Annuler
                  </md-button>
                  <md-button @click="saveProfile" class="btn-next md-primary">
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
import { Pagination } from "../../../components";
// import { spinalIO } from "../../../services/spinalIO";
import { SlideYDownTransition } from "vue2-transitions";
import Multiselect from "vue-multiselect";
import {
  SpinalGraph,
  SpinalGraphService
} from "spinal-env-viewer-graph-service";
import axios from "axios";

export default {
  name: "Server",
  components: {},
  data() {
    return {
      display: false,
      serverList: [],
      serverData: {
        serverName: "",
        clientId: "",
        clientSecret: ""
      },
      currentSort: "name",
      currentSortOrder: "asc",
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      }
    };
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
  },
  methods: {
    displayAdd() {
      this.display = true;
    },
    cancelAdd() {
      this.display = false;
      this.$refs.form.reset();
    },
    saveProfile() {
      // console.log("save profile server");
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
    customSort(value) {
      return value.sort((a, b) => {
        const sortBy = this.currentSort;
        if (this.currentSortOrder === "desc") {
          return a[sortBy].localeCompare(b[sortBy]);
        }
        return b[sortBy].localeCompare(a[sortBy]);
      });
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.getServers();
  },
  watch: {
    /**
     * Searches through the table data by a given query.
     * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
     * @param value of the query
     */
  }
};
</script>
<style lang="css" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
