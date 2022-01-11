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
              <md-table-cell md-label="name" md-sort-by="name">{{
                item.name
              }}</md-table-cell>
              <md-table-cell md-label="Servers">{{
                serverLength(item)
              }}</md-table-cell>
              <md-table-cell md-label="Actions">
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
          <form
            novalidate
            @submit.prevent="validatePlatform"
            v-if="display === true"
          >
            <md-card class="md-layout md-size-100 md-small-size-100">
              <div class="md-layout">
                <div class="md-layout-item md-size-50 mt-4 md-small-size-50">
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
                      >The name is required</span
                    >
                    <span
                      class="md-error"
                      v-else-if="!$v.formPlatform.platformName.minlength"
                      >Invalid name</span
                    >
                  </md-field>

                  <md-field>
                    <label>Servers :</label>
                    <multiselect
                      v-model="formPlatform.serverValue"
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
            </md-card>
            <md-progress-bar md-mode="indeterminate" v-if="sending" />

            <md-card-actions>
              <div>
                <md-button @click="cancelAdd" class="btn-next md-danger">
                  Annuler
                </md-button>
                <md-button
                  type="submit"
                  class="btn-next md-primary"
                  @click="validatePlatform"
                  :disabled="sending"
                >
                  Enregistrer
                </md-button>
              </div>
            </md-card-actions>
            <md-snackbar :md-active.sync="platformSaved"
              >The platform {{ lastPlatform }} was saved with
              success!</md-snackbar
            >
          </form>
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
    token: null,
    display: false,
    formPlatform: {
      platformName: null,
      serverValue: []
    },
    platformSaved: false,
    sending: false,
    lastPlatform: null,
    serverList: [],
    currentSort: "name",
    currentSortOrder: "asc",
    platformList: []
  }),
  validations: {
    formPlatform: {
      platformName: {
        required,
        minLength: minLength(3)
      },

      serverValue: {
        required
      }
    }
  },
  computed: {},
  methods: {
    serverLength(item) {
      return item.serverList.length;
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
      this.formPlatform.serverName = null;
      this.formPlatform.serverValue = null;
    },

    async savePlatform() {
      this.sending = true;
      const rep = await axios.post(
        "http://localhost:4040/platforms",
        {
          name: this.formPlatform.platformName,
          serverList: this.formPlatform.serverValue
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      window.setTimeout(() => {
        this.lastPlatform = `${this.formPlatform.platformName}`;
        this.platformSaved = true;
        this.sending = false;
        this.clearForm();
      }, 1500);
      this.reloadData();
      this.display = false;
    },
    validatePlatform() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.savePlatform();
      }
    },
    showItem(item) {
      // console.log(item);
    },
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
      this.$v.$reset();
      this.display = false;
      // this.$refs.formPlatform.reset();
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
