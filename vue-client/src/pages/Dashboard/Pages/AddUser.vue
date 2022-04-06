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
              <md-field :class="getValidationClass('password')">
                <label for="password">password</label>
                <md-input
                  name="password"
                  id="password"
                  autocomplete="given-name"
                  v-model="formUser.password"
                  type="password"
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

              <md-field :class="getValidationClass('email')">
                <label for="email">Email</label>
                <md-input
                  name="email"
                  id="email"
                  autocomplete="given-name"
                  v-model="formUser.email"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.formUser.email.required"
                  >The email is required</span
                >
                <span class="md-error" v-else-if="!$v.formUser.email.minlength"
                  >Invalid Email</span
                >
              </md-field>

              <md-field :class="getValidationClass('info')">
                <label for="info">Info</label>
                <md-input
                  name="info"
                  id="info"
                  autocomplete="given-name"
                  v-model="formUser.info"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.formUser.info.required"
                  >The info is required</span
                >
                <span class="md-error" v-else-if="!$v.formUser.info.minlength"
                  >Invalid Email</span
                >
              </md-field>

              <md-field>
                <label for="userType">User type</label>
                <multiselect
                  v-model="formUser.userType"
                  :options="userType"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  placeholder="Select one user type"
                  track-by="name"
                  label="name"
                >
                  <span slot="noResult"
                    >Oops! No elements found. Consider changing the search
                    query.</span
                  >
                </multiselect>
              </md-field>

              <!-- ******************************************* -->
              <div class="platformRange">
                <div class="md-layout-item md-size-50">
                  <form>
                    <md-card-content>
                      <md-field>
                        <label for="platformList">Platform List</label>
                        <multiselect
                          v-model="formPlatformObject.platform"
                          :options="platformList"
                          :close-on-select="false"
                          :clear-on-select="false"
                          :preserve-search="true"
                          placeholder="Select one platform"
                          track-by="name"
                          label="name"
                        >
                          <span slot="noResult"
                            >Oops! No elements found. Consider changing the
                            search query.</span
                          >
                        </multiselect>
                      </md-field>

                      <md-field>
                        <label for="userProfileValue">User Profiles</label>
                        <multiselect
                          v-model="formPlatformObject.userProfileValue"
                          :options="userProfileList"
                          :multiple="true"
                          :close-on-select="false"
                          :clear-on-select="false"
                          :preserve-search="true"
                          placeholder="Select one or more profiles"
                          track-by="id"
                          label="name"
                        >
                          <span slot="noResult"
                            >Oops! No elements found. Consider changing the
                            search query.</span
                          >
                        </multiselect>
                      </md-field>
                    </md-card-content>

                    <md-button
                      @click="savePlateformObject()"
                      class="md-primary"
                      :disabled="sending"
                      >Add Platform</md-button
                    >
                  </form>
                </div>
                <div class="md-layout-item md-size-50">
                  <p>heloooooooooooooo</p>
                </div>
              </div>
              <!-- *********************************************** -->
            </div>
          </div>
        </md-card-content>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
        <md-card-actions>
          <md-button @click="cancelAdd()" class="btn-next md-danger">
            Annuler
          </md-button>
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

export default {
  mixins: [validationMixin],
  name: "AddUser",
  components: { Multiselect },
  props: {
    itemSelectedId: String
  },
  data() {
    return {
      token: null,
      position: "center",
      duration: 3000,
      isInfinity: false,
      formUser: {
        userName: null,
        password: null,
        email: null,
        info: null,
        userType: []
      },
      formPlatformObject: {
        platform: [],
        userProfileValue: []
      },
      platformObjectList: [],
      platformObject: {
        platformId: null,
        profileObjectList: []
      },
      profileObject: {
        label: null,
        id: null
      },
      itemPlatformSelected: null,
      userType: [],
      userProfileList: [],
      userList: [],
      platformList: [],
      userSaved: false,
      sending: false,
      lastUser: null
    };
  },

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
      email: {
        email,
        minLength: minLength(3)
      },
      info: {
        minLength: minLength(3)
      },
      userType: {
        required,
        minLength: minLength(3)
      },
      platformList: {
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
    savePlateformObject() {
      console.log(this.$v.formPlatformObject.platform);
    },
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
    cancelAdd() {
      console.log("cancel");
      this.clearForm();
      EventBus.$emit("cancelAddUser");
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.editUser();
      }
    },
    async saveOrgan() {
      this.sending = true;
      const rep = await instanceAxios.instanceAxios.post(
        `/users`,
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
    async saveUser() {
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
    },
    async getUserProfileList() {
      const rep = await instanceAxios.instanceAxios.get(
        `/platforms/${this.formUser}/getUserProfileList`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      this.userProfileList = rep.data;
    },

    async getplatformList() {
      const rep = await instanceAxios.instanceAxios.get(`/platforms`, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.platformList = rep.data;
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.getUserProfileList();
    this.getplatformList();
  },
  watch: {}
};
</script>

<style>
.platformRange {
  background-color: rgb(214, 214, 214);
  display: flex;
  flex-direction: row;
}
</style>
