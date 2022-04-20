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

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF0Zm9ybU5hbWUiOiJib3MgdGVzdCAyIiwiaWF0IjoxNjQ5MjQ1MTE4LCJleHAiOjE2NDkzMzE1MTh9.W8xlnFzXIpWXTVss6mtudjQirfBMvRx55hHo_fz2Uww



<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-95 mt-4 md-small-size-100">
      <div>
        <md-list>
          <md-list-item>
            <div class="infoBos">
              <md-icon>location_city</md-icon>
              <span class="md-list-item-text md-headline itemListBos">{{
                itemSelected.name
              }}</span>
            </div>
          </md-list-item>
          <md-list-item>
            <div class="infoBos">
              <md-icon>link</md-icon>
              <span class="md-list-item-text md-headline itemListBos"
                >{{ itemSelected.url }} fsdfsdfsdf</span
              >
            </div>
          </md-list-item>
          <md-list-item>
            <div class="infoBos">
              <md-icon>token</md-icon>
              <div>
                <md-dialog :md-active.sync="showToken">
                  <md-tab md-label="General">
                    <p>{{ itemSelected.TokenBosAdmin }}</p>
                  </md-tab>
                  <md-dialog-actions>
                    <md-button class="md-primary" @click="showToken = false"
                      >Close</md-button
                    >
                  </md-dialog-actions>
                </md-dialog>
                <md-button class="md-raised" @click="showToken = true"
                  >Show Token</md-button
                >
              </div>
            </div>
          </md-list-item>
          <md-divider class="md-inset"></md-divider>
        </md-list>
      </div>
      <div>
        <md-list>
          <md-list-item>
            <div class="infoBos">
              <md-icon>location_city</md-icon>
              <span class="md-list-item-text itemListBos">{{
                itemSelected.statusPlatform
              }}</span>
            </div>
          </md-list-item>
          <md-divider class="md-inset"></md-divider>
        </md-list>
      </div>
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
          <md-table v-model="itemSelected.hello">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="appProfileId">{{
                item.appProfileId
              }}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>

        <!-- *****************************apps******************************************** -->
        <md-card-content v-if="displayApps === true">
          <md-table v-model="itemSelected.hello">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>

        <!-- *****************************logs******************************************** -->
        <md-card-content v-if="displayLogs === true">
          <md-table v-model="itemSelected.hello">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
const instanceAxios = require("../../../services/axiosConfig");
import Multiselect from "vue-multiselect";
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
  components: {},
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
    displayLogs: false
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
      } else {
        this.displayOrgans = false;
        this.displayUserProfiles = false;
        this.displayAppProfiles = false;
        this.displayUsers = false;
        this.displayApps = false;
        this.displayLogs = true;
      }
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
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
</style>
