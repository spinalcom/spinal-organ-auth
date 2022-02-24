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
    <div class="md-layout-item md-size-20 mt-4 md-small-size-100"></div>
    <div class="md-layout-item md-size-60 mt-4 md-small-size-100">
      <h1 v-if="display === false">Users</h1>
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-primary">
          <div class="card-icon">
            <md-icon v-if="display === false">person</md-icon>
            <md-icon
              class="cursorP"
              @click.native="cancelAdd"
              v-if="display === true"
              >arrow_back</md-icon
            >
          </div>
          <h4 class="title" v-if="display === false">Select User</h4>
          <h4 class="title" v-if="display === true">Add User</h4>
          <md-button
            class="md-primary pull-right"
            v-if="display === false"
            @click="displayAdd"
            >Nouveau Utilisateur</md-button
          >
        </md-card-header>
        <md-card-content v-if="display === false">
          <div class="md-layout">
            <div class="md-layout-item">
              <br />
              <multiselect
                v-model="value"
                :options="userList"
                placeholder="Select one"
                label="userName"
                track-by="userName"
              ></multiselect>
              <br />
              <md-card-actions>
                <md-button
                  class="md-primary pull-right"
                  v-if="display === false"
                  @click="displayAdd"
                  >edit</md-button
                >
              </md-card-actions>
            </div>
          </div>
        </md-card-content>
        <!-- *********************************************************** , -->
        <form
          novalidate
          class="md-layout"
          @submit.prevent="validateUser"
          v-if="display === true"
        >
          <md-card class="md-layout-item md-size-100 md-small-size-100">
            <md-card-content>
              <md-field :class="getValidationClass('userName')">
                <label for="userName">User Name</label>
                <md-input
                  name="userName"
                  id="userName"
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
              <md-field :class="getValidationClass('password')">
                <label for="password">password</label>
                <md-input
                  name="password"
                  id="password"
                  autocomplete="given-name"
                  v-model="formUser.password"
                  :type="secretType"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.formUser.password.required"
                  >The password is required</span
                >
                <span
                  class="md-error"
                  v-else-if="!$v.formUser.password.minlength"
                  >Invalid password
                </span>
              </md-field>

              <md-field>
                <label for="role">role</label>
                <multiselect
                  v-model="formUser.role"
                  :options="roleList"
                  placeholder="Select one Role"
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

              <md-field>
                <label for="userProfileList">User Profiles</label>
                <multiselect
                  v-model="formUser.userProfileList"
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

              <md-field>
                <label for="userProfileList">User Profiles</label>
                <multiselect
                  v-model="formUser.userProfileList"
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
            </md-card-content>
            <md-progress-bar md-mode="indeterminate" v-if="sending" />
            <md-card-actions>
              <div>
                <md-button @click="cancelAdd" class="btn-next md-danger">
                  Annuler
                </md-button>
                <md-button @click="saveUser" class="btn-next md-primary">
                  Enregistrer
                </md-button>
              </div>
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
      </md-card>
    </div>
  </div>
</template>
<script>
import Multiselect from "vue-multiselect";
import {
  SpinalGraph,
  SpinalGraphService
} from "spinal-env-viewer-graph-service";
import axios from "axios";
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  components: { Multiselect },
  data: () => ({
    display: false,
    token: "",
    value: null,
    secretType: "password",
    position: "center",
    duration: 3000,
    isInfinity: false,
    userList: [],
    platformList: [],
    roleList: [],
    userProfile: [],
    formUser: {
      userName: null,
      password: null,
      role: null,
      rightsList: []
    },
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
      password: {
        required,
        minLength: minLength(3)
      },
      role: {
        required
      },
      rightsList: {
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
      this.formUser.password = null;
      this.formUser.role = null;
      this.formUser.rightsList = null;
    },
    displayAdd() {
      this.display = true;
    },
    cancelAdd() {
      this.display = false;
      this.$refs.form.reset();
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.editUser();
      }
    },
    saveUser() {},
    editUser() {},
    getInfoUser() {},
    async getRoles() {
      const rep = await axios.post("http://localhost:4040/users/getRoles", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.roleList = rep.data;
    },
    async getUserProfile() {
      const rep = await axios.post(
        "http://localhost:4040/users/userProfilesList/",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      this.userProfile = rep.data;
    },
    async getUsers() {
      const rep = await axios.get("http://localhost:4040/users", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.userList = rep.data;
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.getUsers();
    this.getUserProfile();
    this.getRoles();
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

