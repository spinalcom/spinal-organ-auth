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
            List Of Server Profiles
          </h4>
          <h4 class="title" v-if="display === true">Server Profile Detail</h4>
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
                  @click.native="showServerDetail(item)"
                  >visibility</md-icon
                >
                <md-icon
                  class="text-center text-primary"
                  @click.native="deleteServer(item)"
                  >delete</md-icon
                >
              </md-table-cell>
            </md-table-row>
          </md-table>
          <!-- <md-button
            class="md-primary pull-right"
            v-if="display === false"
            @click="displayAdd()"
            >Ajouter</md-button
          > -->
        </md-card-header>
        <md-card-content>
          <h4 v-if="itemSelected != null && display === true">
            {{ itemSelected.name }}
          </h4>
          <div
            class="md-layout"
            v-if="itemSelected != null && display === true"
          >
            <div class="md-layout-item">
              <md-field>
                <label>ClientId</label>
                <md-input v-model="itemSelected.clientId" type="text" disabled>
                </md-input>
              </md-field>
              <md-field>
                <label>clientSecret</label>
                <md-input
                  v-model="itemSelected.clientSecret"
                  :type="secretType"
                  disabled
                >
                </md-input>
              </md-field>
              <md-field>
                <label>URI</label>
                <md-input v-model="itemSelected.uri" type="text" disabled>
                </md-input>
              </md-field>
            </div>

            <div class="md-layout-item">
              <md-list
                v-for="(profile, index) in itemSelected.profileList"
                :key="index"
                class="md-double-line"
              >
                <md-subheader>
                  {{ profile.name
                  }}<md-icon class="md-primary"
                    >manage_accounts</md-icon
                  ></md-subheader
                >
                <md-list-item
                  v-for="(app, index) in profile.appList"
                  :key="index"
                >
                  <div class="md-list-item-text">
                    <ul>
                      {{
                        app.data.name
                      }}
                      :
                      <li v-for="(role, index) in app.role" :key="index">
                        {{ role.name }}
                      </li>
                    </ul>
                  </div>
                </md-list-item>
              </md-list>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>
<script>
// import { Pagination } from "../../../components";
// import { spinalIO } from "../../../services/spinalIO";
// import { SlideYDownTransition } from "vue2-transitions";
// import Multiselect from "vue-multiselect";
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
      token: "",
      display: false,
      secretType: "password",
      itemSelected: null,
      serverList: [],
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
    showServerDetail(item) {
      this.display = true;
      this.itemSelected = item;
    },
    toggleSecretVisibility() {
      if (this.secretType == "password") {
        this.secretType = "text";
      } else {
        this.secretType = "password";
      }
    },
    async deleteServer(item, ask = true) {
      let r = true;
      if (ask)
        r = confirm(
          "Are you sure you want to delete the Server, you can lost all config of this Server!"
        );
      if (r === true) {
        await axios.delete(`http://localhost:4040/servers/${item.id}`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        });
      }
      this.reloadData();
    },
    reloadData() {
      this.getServers();
    },
    cancelAdd() {
      this.display = false;
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
<style lang="scss" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
.md-list {
  width: 320px;
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  border: 1px solid rgba(#000, 0.12);
}
</style>
