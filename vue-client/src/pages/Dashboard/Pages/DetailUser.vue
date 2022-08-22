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
      <!-- ********************************************************* -->
      <div class="infoUser">
        <div class="md-layout-item md-size-80 md-medium-size-100">
          <tabs
            :tab-name="[
              'User Name',
              'User Id',
              'email',
              'type',
              'telephone',
              'info',
            ]"
            color-button="success"
          >
            <h4 class="title" slot="header-title">User Information</h4>

            <!-- here you can add your content for tab-content -->
            <template slot="tab-pane-1">
              <p><md-icon>person</md-icon> {{ user.name }}</p>
            </template>
            <template slot="tab-pane-2">
              <p><md-icon>link</md-icon> {{ user.id }}</p>
            </template>
            <template slot="tab-pane-3">
              <p><md-icon>alternate_email</md-icon> {{ user.email }}</p>
            </template>
            <template slot="tab-pane-4">
              <p>
                <md-icon>supervised_user_circle</md-icon> {{ user.userType }}
              </p>
            </template>
            <template slot="tab-pane-5">
              <p><md-icon>call</md-icon>{{ user.telephone }}</p>
            </template>
            <template slot="tab-pane-6">
              <p><md-icon>info</md-icon> {{ user.info }}</p>
            </template>
          </tabs>
        </div>
        <div class="md-layout-item md-size-20 md-medium-size-100">
          <div class="buttonsPlatform">
            <!-- <md-button class="md-warning" @click="AddPltaform()"
              >Add Platform</md-button
            > -->
            <md-button class="md-warning" @click="displayEditUser()"
              >Edit User</md-button
            >
            <md-button class="md-warning" @click="deleteUser()"
              >Delete User</md-button
            >
          </div>
        </div>
      </div>

      <!-- ************************************************************ -->
      <div class="md-layout-item md-size-100">
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
              <md-icon>backup_table</md-icon>
            </div>
            <h4 class="title">Backup Platform User Table</h4>
            <div class="button">
              <md-button @click.native="showTable((itemTable = 'Platforms'))"
                >Platforms</md-button
              >
              <md-button @click.native="showTable((itemTable = 'Logs'))"
                >Logs</md-button
              >
            </div>
          </md-card-header>

          <md-card-content v-if="displayPlatforms === true">
            <md-table v-model="platformObjectList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Platform Name">{{
                  item._platform.name
                }}</md-table-cell>
                <md-table-cell md-label="Status">{{
                  item._platform.statusPlatform
                }}</md-table-cell>
                <md-table-cell md-label="Profile Name">{{
                  item.userProfile.name
                }}</md-table-cell>
                <md-table-cell md-label="Profile Id">{{
                  item.userProfile.userProfileId
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
  name: "DetailUser",
  props: ["id"],
  data() {
    return {
      token: null,
      user: {},
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
    async getUserLogs() {
      const rep = await instanceAxios.instanceAxios.get(
        `/users/${this.user.id}/userLogs`,
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
    displayEditUser() {
      if (this.user.name === "authAdmin") {
        this.$router.push({ name: "EditAdminProfile" });
      } else {
        this.$router.push({ name: "EditUser", query: { id: this.user.id } });
      }
    },
    async deleteUser(ask = true) {
      let r = true;
      if (ask)
        r = confirm(
          "Are you sure you want to delete the User, you can lost all config of this user!"
        );
      if (r === true) {
        if (this.user.name === "authAdmin") {
          alert("you cannot delete this item");
        } else {
          await instanceAxios.instanceAxios.delete(`/users/${this.user.id}`, {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": this.token
            }
          });
          this.$router.push({ name: "Users", params: { id: this.user.id } });
        }
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
    async getplatforms(_user) {
      for (const platform of _user.platformList) {
        const _platform = await this.getplatform(platform.platformId);
        let infoPlatform = {
          _platform: _platform,
          userProfile: {
            name: platform.userProfile.userProfileName,
            userProfileId: platform.userProfile.userProfileBosConfigId
          }
        };
        this.platformObjectList.push(infoPlatform);
      }
      return this.platformObjectList;
    },
    async getUser(userId) {
      const rep = await instanceAxios.instanceAxios.get(`/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.user = rep.data;
      return rep.data;
    }
  },
  async mounted() {
    this.token = localStorage.getItem("token");
    var rep = await this.getUser(this.$route.query.id);
    await this.getplatforms(rep);
    this.getUserLogs();
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
.infoUser {
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


