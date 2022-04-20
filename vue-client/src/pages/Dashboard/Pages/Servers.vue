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
            <md-icon v-if="displayShow === false && displayEdit === false"
              >dns</md-icon
            >
            <md-icon
              class="cursorP"
              @click.native="cancelAdd"
              v-if="displayShow === true"
              >arrow_back</md-icon
            >
            <md-icon
              class="cursorP"
              @click.native="cancelAdd"
              v-if="displayEdit === true"
              >arrow_back</md-icon
            >
          </div>
          <h4
            class="title"
            v-if="displayShow === false && displayEdit === false"
          >
            List Of Server Profiles
          </h4>
          <h4 class="title" v-if="displayShow === true">
            Server Profile Detail
          </h4>
          <h4 class="title" v-if="displayEdit === true">Server Profile Edit</h4>

          <md-table
            v-if="displayShow === false && displayEdit === false"
            :value="serverList"
            :md-sort-order.sync="currentSortOrder"
            :md-sort-fn="customSort"
            class="paginated-table table-striped table-hover"
          >
            <hr />
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Name" md-sort-by="name">{{
                item.name
              }}</md-table-cell>
              <md-table-cell md-label="Platform" md-sort-by="name">{{
                item.name
              }}</md-table-cell>
              <md-table-cell md-label="Actions">
                <md-icon
                  class="text-center text-primary cursorP"
                  @click.native="showServerDetail(item)"
                  >visibility</md-icon
                >
                <md-icon
                  class="text-center text-primary cursorP"
                  @click.native="ShowEditServer(item)"
                  >edit</md-icon
                >
                <md-icon
                  class="text-center text-primary cursorP"
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
          <h4 v-if="itemSelected != null && displayShow === true">
            {{ itemSelected.name }}
          </h4>
          <div
            class="md-layout"
            v-if="itemSelected != null && displayShow === true"
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
        <form novalidate class="md-layout" @submit.prevent="validateServer">
          <md-card class="md-layout-item md-size-100 md-small-size-100">
            <md-card-content>
              <div
                class="md-layout"
                v-if="itemSelected != null && displayEdit === true"
              >
                <md-field :class="getValidationClass('serverName')">
                  <label for="serverName">Server Name</label>
                  <md-input
                    name="serverName"
                    id="serverName"
                    autocomplete="given-name"
                    v-model="formServer.serverName"
                    :disabled="sending"
                  />
                  <span
                    class="md-error"
                    v-if="!$v.formServer.serverName.required"
                    >The name is required</span
                  >
                  <span
                    class="md-error"
                    v-else-if="!$v.formServer.serverName.minlength"
                    >Invalid Server name</span
                  >
                </md-field>

                <md-field :class="getValidationClass('clientId')">
                  <label for="clientId">clientId</label>
                  <md-input
                    name="clientId"
                    id="clientId"
                    autocomplete="given-name"
                    v-model="formServer.clientId"
                    :disabled="sending"
                  />
                  <span class="md-error" v-if="!$v.formServer.clientId.required"
                    >The clientId is required</span
                  >
                  <span
                    class="md-error"
                    v-else-if="!$v.formServer.serverName.minlength"
                    >Invalid clientId</span
                  >
                </md-field>

                <md-field :class="getValidationClass('clientSecret')">
                  <label for="clientSecret">clientSecret</label>
                  <md-input
                    name="clientSecret"
                    id="clientSecret"
                    autocomplete="given-name"
                    v-model="formServer.clientSecret"
                    :disabled="sending"
                  />
                  <span
                    class="md-error"
                    v-if="!$v.formServer.clientSecret.required"
                    >The clientSecret is required</span
                  >
                  <span
                    class="md-error"
                    v-else-if="!$v.formServer.clientSecret.minlength"
                    >Invalid clientSecret</span
                  >
                </md-field>

                <md-field :class="getValidationClass('uri')">
                  <label for="uri">uri</label>
                  <md-input
                    name="uri"
                    id="uri"
                    autocomplete="given-name"
                    v-model="formServer.uri"
                    :disabled="sending"
                  />
                  <span class="md-error" v-if="!$v.formServer.uri.required"
                    >The uri is required</span
                  >
                  <span
                    class="md-error"
                    v-else-if="!$v.formServer.uri.minlength"
                    >Invalid uri</span
                  >
                </md-field>
              </div>
            </md-card-content>
            <md-progress-bar md-mode="indeterminate" v-if="sending" />
            <md-card-actions>
              <md-button
                v-if="displayEdit === true"
                type="submit"
                class="md-primary"
                :disabled="sending"
                >Edit</md-button
              >
            </md-card-actions>
          </md-card>
          <md-snackbar
            :md-active.sync="serverSaved"
            :md-position="position"
            :md-duration="isInfinity ? Infinity : duration"
            md-persistent
          >
            <span>The server {{ lastServer }} was updated with success!</span>
          </md-snackbar>
        </form>
      </md-card>
    </div>
  </div>
</template>
<script>
const instanceAxios = require("../../../services/axiosConfig");
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

export default {
  name: "Server",
  mixins: [validationMixin],

  components: {},
  data() {
    return {
      token: "",
      displayShow: false,
      displayEdit: false,
      secretType: "password",
      itemSelected: null,
      serverList: [],
      currentSort: "name",
      currentSortOrder: "asc",
      mixins: [validationMixin],
      position: "center",
      duration: 3000,
      isInfinity: false,
      formServer: {
        serverName: null,
        clientId: null,
        clientSecret: null,
        uri: null
      },
      sending: false,
      serverSaved: false,
      lastServer: null
    };
  },

  validations: {
    formServer: {
      serverName: {
        required,
        minLength: minLength(3)
      },
      clientId: {
        required,
        minLength: minLength(3)
      },
      clientSecret: {
        required,
        minLength: minLength(3)
      },
      uri: {
        required,
        minLength: minLength(3)
      }
    }
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
  },
  methods: {
    showServerDetail(item) {
      this.displayShow = true;
      this.itemSelected = item;
    },
    ShowEditServer(item) {
      this.displayEdit = true;
      this.itemSelected = item;
    },
    validateServer() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.editServer();
      }
    },
    async editServer() {
      this.sending = true;
      const rep = await instanceAxios.instanceAxios.put(
        `/servers/${this.itemSelected.id}`,
        {
          name: this.formServer.serverName,
          clientId: this.formServer.clientId,
          clientSecret: this.formServer.clientSecret,
          uri: this.formServer.uri
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      if (rep !== undefined) {
        this.getServers();
        window.setTimeout(() => {
          this.lastServer = `${this.formServer.serverName}`;
          this.serverSaved = true;
          this.sending = false;
          this.clearForm();
          this.displayEdit = false;
        }, 1500);
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v.formServer[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.formServer.serverName = null;
      this.formServer.clientId = null;
      this.formServer.clientSecret = null;
      this.formServer.uri = null;
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
        await instanceAxios.instanceAxios.delete(`/servers/${item.id}`, {
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
      this.displayShow = false;
      this.displayEdit = false;
    },
    async getServers() {
      const rep = await instanceAxios.instanceAxios.get("/servers", {
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
.cursorP {
  cursor: pointer;
}
</style>
