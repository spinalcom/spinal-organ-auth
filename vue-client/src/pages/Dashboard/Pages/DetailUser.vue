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
              <p><md-icon>location_city</md-icon> item.name</p>
            </template>
            <template slot="tab-pane-2">
              <p><md-icon>link</md-icon> item.url</p>
            </template>
            <template slot="tab-pane-3">
              <p><md-icon>location_city</md-icon> item.name</p>
            </template>
            <template slot="tab-pane-4">
              <p><md-icon>location_city</md-icon> item.name</p>
            </template>
            <template slot="tab-pane-5">
              <p><md-icon>location_city</md-icon> item.name</p>
            </template>
            <template slot="tab-pane-6">
              <p><md-icon>location_city</md-icon> item.name</p>
            </template>
          </tabs>
        </div>
        <div class="md-layout-item md-size-20 md-medium-size-100">
          <div class="buttonsPlatform">
            <md-button class="md-warning" @click="AddPltaform()"
              >Add Platform</md-button
            >
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
          </md-card-header>
          <md-card-content>
            <md-table v-model="platformObjectList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from "../../../EventBus";
import { Tabs } from "@/components";

export default {
  components: { Tabs },
  name: "DetailUser",
  props: ["id"],
  data() {
    return {
      token: null,
      item: null,
      user: null,
      platformObjectList: []
    };
  },
  methods: {
    AddPltaform() {},
    displayEditUser() {},
    deleteUser() {},
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
    async getplatforms() {
      for (const platform of this.item.platformList) {
        const _platform = await this.getplatform(platform.id);
        let infoPlatform = {
          _platform: _platform,
          userProfile: {
            name: platform.userProfile.name,
            userProfileId: platform.userProfile.userProfileId
          }
        };
        this.platformObjectList.push(infoPlatform);
      }
      return this.platformObjectList;
    }
  },
  async mounted() {
    this.token = localStorage.getItem("token");
    console.log("*********", this.$route.query.id);

    // var aux = EventBus.$on("DETAIL_USER", function(item) {
    //   console.log(item);
    //   this.item = item;
    //   return item;
    // });
    // console.log(aux.item);
    // this.item.aux.item;
    // console.log(this.item);

    // await this.getplatforms();
    // console.log("ggg", this.platformObjectList);
  }
};
</script>

<style>
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


