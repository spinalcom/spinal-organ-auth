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
      <div class="infoApp">
        <div class="md-layout-item md-size-80 md-medium-size-100">
          <tabs
            :tab-name="['App Name', 'App Id', 'Client Id', 'Secret Id', 'type']"
            color-button="success"
          >
            <h4 class="title" slot="header-title">Application Information</h4>

            <template slot="tab-pane-1">
              <p><md-icon>app_settings_alt</md-icon> {{ app.name }}</p>
            </template>
            <template slot="tab-pane-2">
              <p><md-icon>link</md-icon> {{ app.id }}</p>
            </template>
            <template slot="tab-pane-3">
              <p><md-icon>vpn_key_off</md-icon> {{ app.clientId }}</p>
            </template>
            <template slot="tab-pane-4">
              <p><md-icon>vpn_key_off</md-icon> {{ app.clientSecret }}</p>
            </template>
            <template slot="tab-pane-5">
              <p><md-icon>inventory</md-icon>{{ app.appType }}</p>
            </template>
          </tabs>
        </div>
        <div class="md-layout-item md-size-20 md-medium-size-100">
          <div class="buttonsPlatform">
            <!-- <md-button class="md-warning" @click="AddPltaform()"
              >Add Platform</md-button
            > -->
            <md-button class="md-warning" @click="displayEditApp()"
              >Edit Application</md-button
            >
            <md-button class="md-warning" @click="deleteApp()"
              >Delete Application</md-button
            >
          </div>
        </div>
      </div>

      <div>
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
              <md-icon>backup_table</md-icon>
            </div>
            <h4 class="title">Backup Platform Application Table</h4>
            <div class="button">
              <md-button @click.native="showTable((itemTable = 'Platforms'))"
                >Platforms</md-button
              >
              <md-button @click.native="showTable((itemTable = 'Logs'))"
                >Logs</md-button
              >
            </div>
          </md-card-header>
          <!-- *************************** Platforms *************************** -->
          <md-card-content v-if="displayPlatforms === true">
            <md-table v-model="platformObjectList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Platform Name">{{
                  item._platform.name
                }}</md-table-cell>
                <md-table-cell md-label="Access">{{
                  item._platform.statusPlatform
                }}</md-table-cell>
                <md-table-cell md-label="Access">{{
                  item.appProfile.name
                }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>

          <!-- ******************************* LOGS ************************* -->

          <md-card-content v-if="displayLogs === true">
            <md-table v-model="logList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="Date">{{
                  getDate(item.date)
                }}</md-table-cell>
                <md-table-cell md-label="Message">{{
                  item.message
                }}</md-table-cell>
                <md-table-cell md-label="Actor Id">{{
                  item.actor.actorId
                }}</md-table-cell>
                <md-table-cell md-label="Actor Name">{{
                  item.actor.actorName
                }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
const instanceAxios = require("../../../services/axiosConfig");
import { Tabs } from "@/components";

export default {
  components: { Tabs },
  name: "DetailApp",
  data() {
    return {
      token: null,
      app: {},
      platformObjectList: [],
      displayPlatforms: true,
      displayLogs: false,
      logList: []
    };
  },
  methods: {
    getDate(date) {
      var acDate = new Date(date);
      return acDate;
    },
    showTable(itemTable) {
      if (itemTable === "Platforms") {
        this.displayPlatforms = true;
        this.displayLogs = false;
      } else if (itemTable === "Logs") {
        this.displayPlatforms = false;
        this.displayLogs = true;
      }
    },
    async getApplicationLogs() {
      const rep = await instanceAxios.instanceAxios.get(
        `/applications/${this.app.id}/applicationLogs`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      this.logList = rep.data;
    },
    AddPltaform() {},
    displayEditApp() {
      this.$router.push({ name: "EditApp", query: { id: this.app.id } });
    },
    async deleteApp(ask = true) {
      let r = true;
      if (ask)
        r = confirm(
          "Are you sure you want to delete the Application, you can lost all config of this Application!"
        );
      if (r === true) {
        await instanceAxios.instanceAxios.delete(
          `/applications/${this.app.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": this.token
            }
          }
        );
        this.$router.push({
          name: "Application",
          params: { id: this.app.id }
        });
      }
    },
    async getplatform(platformId) {
      const rep = await instanceAxios.instanceAxios.get(
        `/platforms/${platformId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      return rep.data;
    },
    async getplatforms(_app) {
      for (const platform of _app.platformList) {
        const _platform = await this.getplatform(platform.platformId);
        let infoPlatform = {
          _platform: _platform,
          appProfile: {
            name: platform.appProfile.name,
            appProfileId: platform.appProfile.appProfileId
          }
        };
        this.platformObjectList.push(infoPlatform);
      }
      return this.platformObjectList;
    },
    async getApp(appId) {
      const rep = await instanceAxios.instanceAxios.get(
        `/applications/${appId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      this.app = rep.data;
      return rep.data;
    }
  },
  async mounted() {
    this.token = localStorage.getItem("token");
    var rep = await this.getApp(this.$route.query.id);
    await this.getplatforms(rep);
    this.getApplicationLogs();
  }
};
</script>

<style>
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
.infoApp {
  display: flex;
  flex-direction: row;
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
