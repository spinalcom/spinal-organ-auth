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
      <div class="buttonAdd">
        <md-button class="md-warning" @click="displayAdd()">Add User</md-button>
      </div>
      <div class="md-layout-item md-size-100">
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
              <md-icon>backup_table</md-icon>
            </div>
            <h4 class="title">Backup User Table</h4>
          </md-card-header>
          <md-card-content>
            <md-table v-model="userList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="State">
                  <md-list
                    v-for="(platform, index) in item.platformList"
                    :key="index"
                    class="md-double-line"
                  >
                    <md-list-item>
                      <PlatformObjectUser
                        class="md-list-item-text"
                        :user="item"
                        :platformId="platform.platformId"
                        :token="token"
                      ></PlatformObjectUser>
                    </md-list-item>
                  </md-list>
                </md-table-cell>
                <md-table-cell md-label="Detail">
                  <md-button class="md-just-icon" @click="displayDetail(item)"
                    ><md-icon>arrow_forward</md-icon></md-button
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
const instanceAxios = require("../../../services/axiosConfig");
import { validationMixin } from "vuelidate";
import EventBus from "../../../EventBus";
import PlatformObjectUser from "./PlatformObjectUser.vue";
export default {
  mixins: [validationMixin],
  components: { PlatformObjectUser },
  name: "Users",
  data: () => ({
    token: "",
    value: null,
    userList: [],
    platformList: [],
    platformlinkUser: []
  }),

  computed: {},
  methods: {
    displayDetail(item) {
      this.$router.push({ name: "DetailUser", query: { id: item.id } });
    },
    displayAdd() {
      this.$router.push("/AddUser");
    },
    async getUsers() {
      const rep = await instanceAxios.instanceAxios.get("/users", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.userList = rep.data;
      console.log(this.userList);
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.getUsers();
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
.buttonAdd {
  float: right;
  margin-right: 20px;
  margin-bottom: 50px;
}
.backupUser {
  margin-top: 50px;
}
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
.cursorP {
  cursor: pointer;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
