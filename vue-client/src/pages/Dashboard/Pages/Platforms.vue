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

        <div>
          <md-dialog-confirm
            :md-active.sync="active"
            md-title="Generate a new Register Key?"
            md-confirm-text="Agree"
            md-cancel-text="Disagree"
            @md-cancel="onCancel"
            @md-confirm="onConfirm"
          />
          <md-button class="md-warning pull-right" @click="active = true"
            >Generate Registration Key</md-button
          >
          <span v-if="value">Value: {{ value }}</span>
        </div>
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
              <md-table-cell md-label="organ list">
                <md-icon
                  class="text-center text-primary cursorP"
                  @click.native="showPanelOrganList(item)"
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
              v-for="(server, index) in organList"
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

          <AddOrgan
            class="md-layout-item"
            :itemSelectedId="itemSelected.id"
          ></AddOrgan>
        </div>
      </md-card>
    </div>
  </div>
</template>
<script>
// import Places from 'vue-places'
import AddOrgan from "./AddOrgan.vue";
import EventBus from "../../../EventBus";
import axios from "axios";
const instanceAxios = require("../../../services/axiosConfig");

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
  components: { AddOrgan },
  data: () => ({
    active: false,
    value: null,
    token: null,
    registerKey: null,
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
    organList: []
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
    async generateRegisterKey() {
      console.log(this.token);
      const rep = await instanceAxios.instanceAxios.get("/registerKey", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.registerKey = rep.data;
      console.log(this.registerKey);
    },
    onConfirm() {
      this.generateRegisterKey();
      this.value = this.registerKey;
    },
    onCancel() {},

    async savePlatform() {
      this.sending = true;
      const rep = await instanceAxios.instanceAxios.post(
        "/platforms",
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
      const rep = await instanceAxios.instanceAxios.put(
        `/platforms/${this.itemSelected.id}`,
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
    showPanelOrganList(item) {
      this.displayConfigServer = true;
      this.itemSelected = item;
      this.getOrgans();
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
        await instanceAxios.instanceAxios.delete(`/platforms/${item.id}`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        });
      }
      this.reloadData();
    },
    async getPlatforms() {
      const rep = await instanceAxios.instanceAxios.get("/platforms", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.platformList = rep.data;
    },
    async getOrgans() {
      const rep = await instanceAxios.instanceAxios.get(
        `/organs/${this.itemSelected.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      this.organList = rep.data;
      console.log(rep.data);
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
    },
    validatePlatform() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.savePlatform();
      }
    },
    validateEditPlatform() {
      this.$v.$touch();

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
    this.getPlatforms();
    EventBus.$on("reloadServerList", () => {});
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

.platform-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.list-item {
  width: 90%;
}

.cursorP {
  cursor: pointer;
}
.md-list {
  width: 320px;
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  border: 1px solid rgba(#000, 0.12);
}
</style>
