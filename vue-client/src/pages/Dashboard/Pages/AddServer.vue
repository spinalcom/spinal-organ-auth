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
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateServer">
      <md-card class="md-layout-item md-size-100 md-small-size-100">
        <md-card-header>
          <div class="md-title">Ajouter un serveur</div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('serverName')">
                <label for="serverName">Server Name</label>
                <md-input
                  name="serverName"
                  id="serverName"
                  autocomplete="given-name"
                  v-model="formServer.serverName"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.formServer.serverName.required"
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
                <span class="md-error" v-else-if="!$v.formServer.uri.minlength"
                  >Invalid uri</span
                >
              </md-field>

              <md-field>
                <label for="userProfileValue">User Profiles</label>
                <multiselect
                  v-model="formServer.userProfileValue"
                  :options="userProfileList"
                  :multiple="true"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  placeholder="Select one or more profiles"
                  track-by="name"
                  label="name"
                >
                  <span slot="noResult"
                    >Oops! No elements found. Consider changing the search
                    query.</span
                  >
                </multiselect>
                <!-- <span
                  class="md-error"
                  v-if="!$v.formServer.userProfileValue.required"
                  >The user profiles is required</span
                > -->
              </md-field>
            </div>
          </div>
        </md-card-content>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending"
            >creer serveur</md-button
          >
        </md-card-actions>
      </md-card>
      <md-snackbar
        :md-active.sync="serverSaved"
        :md-position="position"
        :md-duration="isInfinity ? Infinity : duration"
        md-persistent
      >
        <span>The server {{ lastServer }} was saved with success!</span>
        <!-- <md-button class="md-primary" @click="showSnackbar = false"
          >Retry</md-button
        > -->
      </md-snackbar>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";
import { validationMixin } from "vuelidate";
import Vue from "vue";
import EventBus from "../../../EventBus";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
import { data } from "../../../services/profileUserListData";
// const profiles = require("../../../services/profileUserListData");

export default {
  name: "AddServer",
  mixins: [validationMixin],
  components: { Multiselect },
  data: () => ({
    token: null,
    position: "center",
    duration: 3000,
    isInfinity: false,
    formServer: {
      serverName: null,
      clientId: null,
      clientSecret: null,
      uri: null,
      userProfileValue: []
    },
    userProfileList: [],
    serverList: [],
    serverSaved: false,
    sending: false,
    lastServer: null
  }),

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
      },
      userProfileValue: {
        required
      }
    }
  },
  computed: {},
  methods: {
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
      this.formServer.userProfileValue = null;
    },
    async saveServer() {
      this.sending = true;
      const rep = await axios.post(
        "http://localhost:4040/servers",
        {
          name: this.formServer.serverName,
          clientId: this.formServer.clientId,
          clientSecret: this.formServer.clientSecret,
          uri: this.formServer.uri,
          profileList: this.formServer.userProfileValue
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
        EventBus.$emit("reloadServerList");
        window.setTimeout(() => {
          this.lastServer = `${this.formServer.serverName}`;
          this.serverSaved = true;
          this.sending = false;
          this.clearForm();
        }, 1500);
      }
      // Instead of this timeout, here you can call your API
    },
    validateServer() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveServer();
      }
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
    getUserProfileData() {
      const profiles = require("../../../services/profileUserListData");
      this.userProfileList = profiles.default;
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.getServers();
    this.getUserProfileData();
  },
  watch: {}
};
</script>

<style>
</style>