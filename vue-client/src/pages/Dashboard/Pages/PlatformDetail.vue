<!--
Copyright 2022 SpinalCom - www.spinalcom.com

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
      <!-- ************************************************************* -->
      <div class="infoBos">
        <div class="md-layout-item md-size-33 md-medium-size-100">
          <tabs
            :tab-name="['BOS Name', 'URL', 'address']"
            flex-row
            color-button="success"
          >
            <h4 class="title" slot="header-title">
              Bos Information - <small class="description">Auth Admin</small>
            </h4>

            <!-- here you can add your content for tab-content -->
            <template slot="tab-pane-1">
              <p><md-icon>location_city</md-icon> {{ itemSelected.name }}</p>
            </template>
            <template slot="tab-pane-2">
              <p><md-icon>link</md-icon> {{ itemSelected.url }}</p>
            </template>
            <template slot="tab-pane-3">
              <p><md-icon>location_on</md-icon>{{ itemSelected.url }}</p>
            </template>
          </tabs>
        </div>

        <div class="md-layout-item md-size-33 md-medium-size-100">
          <tabs :tab-name="['Status', 'Token']" flex-row color-button="success">
            <h4 class="title" slot="header-title">Bos State</h4>

            <!-- here you can add your content for tab-content -->
            <template slot="tab-pane-1">
              <p>
                <md-icon>timeline</md-icon> {{ itemSelected.statusPlatform }}
              </p>
            </template>
            <template slot="tab-pane-2">
              <p class="overflow-ellipsis">
                <md-icon>token</md-icon>
                {{ itemSelected.TokenBosAdmin }} 345GSD4UNJ09°M//m:prjfno...
              </p>
            </template>
          </tabs>
        </div>
        <div class="md-layout-item md-size-33 md-medium-size-100">
          <div class="buttonsPlatform">
            <md-button class="md-warning" @click="displayEditToken()"
              >Update Token</md-button
            >
            <md-button class="md-warning" @click="displayEdit()"
              >Edit Platform</md-button
            >
            <md-button class="md-warning" @click="deletePlatformItem()"
              >Delete Platform</md-button
            >
          </div>
        </div>
      </div>

      <!-- ****************************************************************************** -->
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>backup_table</md-icon>
          </div>
          <h4 class="title">Backup Platform Detail Table</h4>
          <div class="button">
            <md-button @click.native="showTable((itemTable = 'Organs'))"
              >Organs</md-button
            >
            <md-button @click.native="showTable((itemTable = 'UserProfiles'))"
              >User Profiles</md-button
            >
            <md-button @click.native="showTable((itemTable = 'AppProfiles'))"
              >App Profiles</md-button
            >
            <md-button @click.native="showTable((itemTable = 'Users'))"
              >Users</md-button
            >
            <md-button @click.native="showTable((itemTable = 'Apps'))"
              >Apps</md-button
            >
            <md-button @click.native="showTable((itemTable = 'Logs'))"
              >Logs</md-button
            >
          </div>
        </md-card-header>
        <!-- *****************************organs******************************************** -->
        <md-card-content v-if="displayOrgans === true">
          <md-table v-model="itemSelected.organs">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="Access">{{
                item.statusOrgan
              }}</md-table-cell>
              <md-table-cell md-label="Profile">{{
                "nb profile"
              }}</md-table-cell>
              <md-table-cell md-label="Edit">
                <md-icon
                  class="text-center text-primary cursorP"
                  @click.native="showEditOrgan(item)"
                  >edit</md-icon
                ></md-table-cell
              >
            </md-table-row>
          </md-table>
        </md-card-content>
        <!-- *****************************User profiles******************************************** -->
        <md-card-content v-if="displayUserProfiles === true">
          <md-table v-model="itemSelected.userProfiles">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="userProfileId">{{
                item.userProfileId
              }}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>

        <!-- *****************************App profiles******************************************** -->
        <md-card-content v-if="displayAppProfiles === true">
          <md-table v-model="itemSelected.appProfiles">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="appProfileId">{{
                item.appProfileId
              }}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>

        <!-- *****************************users******************************************** -->
        <md-card-content v-if="displayUsers === true">
          <md-table v-model="userListLinkPlatform">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="Email">{{ item.email }}</md-table-cell>
              <md-table-cell md-label="Info">{{ item.info }}</md-table-cell>
              <md-table-cell md-label="Telephone">{{
                item.telephone
              }}</md-table-cell>
              <md-table-cell md-label="UserType">{{
                item.userType
              }}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>

        <!-- *****************************apps******************************************** -->
        <md-card-content v-if="displayApps === true">
          <md-table v-model="appListLinkPlatform">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="ClientId">{{
                item.clientId
              }}</md-table-cell>
              <md-table-cell md-label="ClientSecret">{{
                item.clientSecret
              }}</md-table-cell>
              <md-table-cell md-label="App Type">{{
                item.appType
              }}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>

        <!-- *****************************logs******************************************** -->
        <md-card-content v-if="displayLogs === true">
          <!-- <md-table v-model="itemSelected.hello">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
            </md-table-row>
          </md-table> -->
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
const instanceAxios = require("../../../services/axiosConfig");
import Multiselect from "vue-multiselect";
import { Tabs } from "@/components";

import { validationMixin } from "vuelidate";
import EventBus from "../../../EventBus";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

export default {
  name: "PlatformDetail",
  mixins: [validationMixin],
  components: { Tabs },
  props: {
    itemSelected: null
  },
  data: () => ({
    token: null,
    showToken: false,
    position: "center",
    duration: 3000,
    isInfinity: false,
    displayOrgans: true,
    displayUserProfiles: false,
    displayAppProfiles: false,
    displayUsers: false,
    displayApps: false,
    displayLogs: false,
    userList: [],
    userListLinkPlatform: [],
    appList: [],
    appListLinkPlatform: []
  }),

  computed: {},
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.formOrgan[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    showEditOrgan(item) {},
    showTable(itemTable) {
      if (itemTable === "Organs") {
        this.displayOrgans = true;
        this.displayUserProfiles = false;
        this.displayAppProfiles = false;
        this.displayUsers = false;
        this.displayApps = false;
        this.displayLogs = false;
      } else if (itemTable === "UserProfiles") {
        this.displayOrgans = false;
        this.displayUserProfiles = true;
        this.displayAppProfiles = false;
        this.displayUsers = false;
        this.displayApps = false;
        this.displayLogs = false;
      } else if (itemTable === "AppProfiles") {
        this.displayOrgans = false;
        this.displayUserProfiles = false;
        this.displayAppProfiles = true;
        this.displayUsers = false;
        this.displayApps = false;
        this.displayLogs = false;
      } else if (itemTable === "Users") {
        this.displayOrgans = false;
        this.displayUserProfiles = false;
        this.displayAppProfiles = false;
        this.displayUsers = true;
        this.displayApps = false;
        this.displayLogs = false;
      } else if (itemTable === "Apps") {
        this.displayOrgans = false;
        this.displayUserProfiles = false;
        this.displayAppProfiles = false;
        this.displayUsers = false;
        this.displayApps = true;
        this.displayLogs = false;
      } else if (itemTable === "Logs") {
        this.displayOrgans = false;
        this.displayUserProfiles = false;
        this.displayAppProfiles = false;
        this.displayUsers = false;
        this.displayApps = false;
        this.displayLogs = true;
      }
    },
    async getUsers() {
      const rep = await instanceAxios.instanceAxios.get("/users", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.userList = rep.data;
      this.getUsersFromPltaform(this.userList);
    },
    async getApplications() {
      const rep = await instanceAxios.instanceAxios.get("/applications", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.appList = rep.data;
      this.getAPPSFromPltaform(this.appList);
    },
    getUsersFromPltaform(tab) {
      var users = [];
      for (const user of tab) {
        if (user.platformList) {
          for (const platform of user.platformList) {
            if (platform.platformId === this.itemSelected.id) {
              users.push(user);
            }
          }
        }
      }
      this.userListLinkPlatform = users;
    },
    getAPPSFromPltaform(tab) {
      var apps = [];
      for (const app of tab) {
        if (app.platformList) {
          for (const platform of app.platformList) {
            if (platform.platformId === this.itemSelected.id) {
              apps.push(app);
            }
          }
        }
      }
      this.appListLinkPlatform = apps;
    },
    displayEdit(ask = true) {
      let r = true;
      if (ask)
        r = confirm(
          "Are you sure you want to update the platform, you can lost the old config of this platform!"
        );
      if (r === true) {
        if (this.itemSelected.name === "authenticationPlatform") {
          alert("you cannot Edit this item");
        } else {
          this.$router.push({
            name: "EditPlatform",
            query: { id: this.itemSelected.id }
          });
        }
      }
    },
    displayEditToken(ask = true) {
      let r = true;
      if (ask) r = confirm("Are you sure you want to update the Token,");
      if (r === true) {
        alert("Token updated");
      }
    },

    async deletePlatformItem(ask = true) {
      let r = true;
      if (ask)
        r = confirm(
          "Are you sure you want to delete the platform, you can lost all config of this platform!"
        );
      if (r === true) {
        if (this.itemSelected.name === "authenticationPlatform") {
          alert("you cannot delete this item");
        } else {
          await instanceAxios.instanceAxios.delete(
            `/platforms/${this.itemSelected.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-access-token": this.token
              }
            }
          );
          this.$router.go();
        }
      }
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.getUsers();
    this.getApplications();
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.button {
  margin-top: 10px;
}
.infoBos {
  display: flex;
  flex-direction: row;
}
.itemListBos {
  margin-left: 10px;
}
.md-list {
  width: 320px;
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  border: 1px solid rgba(#000, 0.12);
}

.overflow-ellipsis {
  width: 400px;
  padding: 2px 5px;
  /* Les deux règles suivantes sont nécessaires pour text-overflow */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.buttonsPlatform {
  display: flex;
  flex-direction: column;
  float: right;
}
</style>
