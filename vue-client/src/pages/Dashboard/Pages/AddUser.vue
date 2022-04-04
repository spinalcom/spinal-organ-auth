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
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-100 md-small-size-100">
        <md-card-header>
          <div class="md-title">Add User</div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('userName')">
                <label for="userName">User Name</label>
                <md-input
                  name="userName"
                  id="UserName"
                  autocomplete="given-name"
                  v-model="formUser.userName"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.formUser.userName.required"
                  >The name is required</span
                >
                <span
                  class="md-error"
                  v-else-if="!$v.formUser.userName.minlength"
                  >Invalid User name</span
                >
              </md-field>

              <md-field>
                <label for="userProfileValue">User Profiles</label>
                <multiselect
                  v-model="formUser.userProfileValue"
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
              </md-field>
            </div>
          </div>
        </md-card-content>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending"
            >register user</md-button
          >
        </md-card-actions>
      </md-card>
      <md-snackbar
        :md-active.sync="userSaved"
        :md-position="position"
        :md-duration="isInfinity ? Infinity : duration"
        md-persistent
      >
        <span>The user {{ lastUser }} was saved with success!</span>
      </md-snackbar>
    </form>
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
import { data } from "../../../services/profileUserListData";
// const profiles = require("../../../services/profileUserListData");

export default {
  name: "AddUser",
  mixins: [validationMixin],
  components: { Multiselect },
  props: {
    itemSelectedId: String
  },
  data: () => ({
    token: null,
    position: "center",
    duration: 3000,
    isInfinity: false,
    formUser: {
      userName: null
    },
    userProfileList: [],
    userList: [],
    userSaved: false,
    sending: false,
    lastUser: null
  }),

  validations: {
    formUser: {
      userName: {
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
      const field = this.$v.formUser[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.formUser.userName = null;
      this.formUser.userProfileValue = null;
    },
    async saveOrgan() {
      this.sending = true;
      const rep = await instanceAxios.instanceAxios.post(
        `/organs/${this.itemSelectedId}`,
        {
          name: this.formOrgan.organName,
          clientId: this.formOrgan.clientId,
          clientSecret: this.formOrgan.clientSecret,
          uri: this.formOrgan.uri,
          profileList: this.formOrgan.userProfileValue
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      if (rep !== undefined) {
        EventBus.$emit("reloadOrganList");
        window.setTimeout(() => {
          this.lastOrgan = `${this.formOrgan.organName}`;
          this.organSaved = true;
          this.sending = false;
          this.clearForm();
        }, 1500);
      }
      // Instead of this timeout, here you can call your API
    },
    validateOrgan() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveOrgan();
      }
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
    getUserProfileData() {
      const profiles = require("../../../services/profileUserListData");
      this.userProfileList = profiles.default;
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");

    this.getUserProfileData();
  },
  watch: {}
};
</script>

<style></style>
