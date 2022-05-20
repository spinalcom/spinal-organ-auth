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
      <div class="buttonAdd">
        <md-button class="md-warning" @click="AddPltaform()"
          >Add Platform</md-button
        >
        <md-button class="md-warning" @click="displayEditUser()"
          >Edit User</md-button
        >
      </div>
      <div class="md-layout-item md-size-100">
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
              <md-icon>backup_table</md-icon>
            </div>
            <h4 class="title">Backup Platform User Table</h4>
          </md-card-header>
          <md-card-content>
            <md-table v-model="user.platformList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="Detail">
                  <md-button class="md-just-icon" @click="displayDetail(item)"
                    ><md-icon>arrow_forward</md-icon></md-button
                  >
                </md-table-cell>
                <md-table-cell md-label="Edit">
                  <md-button class="md-just-icon" @click="displayEdit(item)"
                    ><md-icon>edit</md-icon></md-button
                  >
                </md-table-cell>
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

export default {
  data() {
    return {
      token: null,
      item: null,
      platformObjectList: []
    };
  },
  methods: {
    AddPltaform() {},
    displayEditUser() {},
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
      for (const platform of this.user.platformList) {
        const _platform = await this.getplatform(platform.id);
        let infoPlatform = {
          _platform: _platform,
          userProfile: {
            name: platform.userProfile.name,
            userProfileId: platform.userProfile.userProfileId
          }
        };
        this.platformObjectList.push();
      }
      return this.platformObjectList;
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    var aux = EventBus.$on("DETAIL_APP", function(item) {
      this.item = item;
    });
    this.user = aux.item;
  }
};
</script>

<style>
</style>
