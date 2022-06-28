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
          <div class="md-title">Edit User</div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('userName')">
                <md-icon>person</md-icon>
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
                <md-icon>password</md-icon>
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
                <md-icon>email</md-icon>
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
                <span class="md-error" v-else-if="!$v.formUser.email.email"
                  >Invalid Email</span
                >
              </md-field>

              <md-field :class="getValidationClass('telephone')">
                <md-icon>phone</md-icon>

                <label for="telephone">Telephone</label>
                <md-input
                  name="telephone"
                  id="telephone"
                  autocomplete="given-name"
                  v-model="formUser.telephone"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.formUser.telephone.numeric"
                  >Invalid Telephone, The Field Most Be a Numeric</span
                >
                <span
                  class="md-error"
                  v-else-if="!$v.formUser.telephone.minlength"
                  >Invalid Telephone, The Field Must Contain More Than 8
                  Characters</span
                >
              </md-field>

              <md-field :class="getValidationClass('info')">
                <md-icon>description</md-icon>
                <label for="info">Info</label>
                <md-textarea
                  name="info"
                  id="info"
                  autocomplete="given-name"
                  v-model="formUser.info"
                  md-autogrow
                  :disabled="sending"
                ></md-textarea>
                <span class="md-error" v-if="!$v.formUser.info.minlength"
                  >Invalid Info, The Field Must Contain More Than 3
                  Characters</span
                >
              </md-field>

              <md-field :class="getValidationClass('userType')">
                <md-icon>admin_panel_settings</md-icon>
                <label for="userType">User type</label>
                <multiselect
                  v-model="formUser.userType"
                  :options="userType"
                  :close-on-select="true"
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
                <span class="md-error" v-if="!$v.formUser.info.minlength"
                  >Invalid User Type, The Field is required</span
                >
              </md-field>

              <!-- ******************************************* -->
              <div class="platformRange">
                <div class="md-layout-item md-size-50">
                  <form>
                    <md-card-content>
                      <md-field>
                        <md-icon>location_city</md-icon>
                        <label for="platformList">Platform List</label>
                        <multiselect
                          v-model="formPlatformObject.platform"
                          :options="platformList"
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
                        <md-icon>remember_me</md-icon>
                        <label for="userProfileValue">User Profiles</label>
                        <multiselect
                          v-model="formPlatformObject.userProfileValue"
                          :options="userProfileList"
                          placeholder="Select one profile"
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
                  <md-table v-model="platformObjectList">
                    <md-table-row slot="md-table-row" slot-scope="{ item }">
                      <md-table-cell md-label="Name BOS">{{
                        item.platformId
                      }}</md-table-cell>
                      <md-table-cell md-label="Profile">
                        {{ item.userProfile.name }}
                      </md-table-cell>
                      <md-table-cell md-label="Profile">
                        <md-button
                          class="md-just-icon"
                          @click="deletePlatformObjectitem(item)"
                          ><md-icon>delete</md-icon></md-button
                        >
                      </md-table-cell>
                    </md-table-row>
                  </md-table>
                </div>
              </div>
              <!-- *********************************************** -->
            </div>
          </div>
        </md-card-content>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
        <md-card-actions>
          <md-button @click="cancelAdd()" class="btn-next md-danger">
            Cancel
          </md-button>
          <md-button type="submit" class="md-primary" :disabled="sending"
            >edit user</md-button
          >
        </md-card-actions>
      </md-card>
      <md-snackbar
        :md-active.sync="userSaved"
        :md-position="position"
        :md-duration="isInfinity ? Infinity : duration"
        md-persistent
      >
        <span>The user {{ lastUser }} was edited with success!</span>
      </md-snackbar>
    </form>
  </div>
</template>

<script>
const instanceAxios = require("../../../services/axiosConfig");
import Multiselect from "vue-multiselect";
import { validationMixin } from "vuelidate";
import EventBus from "../../../EventBus";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "EditUser",
  components: { Multiselect },
  props: {
    id: String
  },
  data() {
    return {
      token: null,
      userSelectedId: null,
      userSelected: null,
      position: "center",
      duration: 3000,
      isInfinity: false,
      formUser: {
        userName: null,
        password: null,
        telephone: null,
        email: null,
        info: null,
        userType: null
      },
      formPlatformObject: {
        platform: [],
        userProfileValue: null
      },
      platformObjectList: [],
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
        minLength: minLength(8)
      },
      email: {
        required,
        email
      },
      info: {
        minLength: minLength(3)
      },
      telephone: {
        numeric,
        minLength: minLength(8)
      },
      userType: {
        required
      }
    }
  },
  computed: {},
  methods: {
    async editUser() {
      var objectBody = {
        userName: this.formUser.userName,
        password: this.formUser.password,
        email: this.formUser.email,
        telephone: this.formUser.telephone,
        info: this.formUser.info,
        userType: this.formUser.userType.name,
        platformList: [
          {
            platformId:
              "SpinalNode-d3d3719b-45b1-86db-fcb2-a624dbb1bd6d-181868239e9",
            userProfile: {
              name: " el.userProfile.name",
              userProfileId: "el.userProfile.userProfileId"
            }
          }
        ]
        // platformList: this.platformObjectList.map(el => {
        //   return {
        //     platformId: el.platformId,
        //     userProfile: {
        //       name: el.userProfile.name,
        //       userProfileId: el.userProfile.userProfileId
        //     }
        //   };
        // })
      };

      console.log("************", objectBody);

      const rep = await instanceAxios.instanceAxios.put(
        `/users/${this.userSelectedId}`,
        objectBody,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      if (rep) {
        this.lastUser = `${objectBody.userName}`;
        this.userSaved = true;
        this.sending = false;
        this.clearForm();
        window.setTimeout(() => {
          this.$router.push("/Users");
        }, 1500);
      }
    },
    savePlateformObject() {
      var test = true;
      for (const platformObject of this.platformObjectList) {
        if (platformObject.platformId === this.formPlatformObject.platform.id) {
          alert("you cannot select platform even twice");
          this.formPlatformObject.platform = [];
          this.formPlatformObject.userProfileValue = null;
          test = false;
        }
      }
      if (test === true) {
        this.platformObjectList.push({
          platformId: this.formPlatformObject.platform.id,
          platformName: this.formPlatformObject.platform.name,
          userProfile: {
            name: this.formPlatformObject.userProfileValue.name,
            userProfileId: this.formPlatformObject.userProfileValue
              .userProfileId
          }
        });
        this.formPlatformObject.platform = [];
        this.formPlatformObject.userProfileValue = null;
      }
    },
    deletePlatformObjectitem(item) {
      for (let index = 0; index < this.platformObjectList.length; index++) {
        if (this.platformObjectList[index].platformId === item.platformId) {
          this.platformObjectList.splice(index, 1);
        }
      }
    },
    async getRoles() {
      const rep = await instanceAxios.instanceAxios.post("/users/getRoles", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.userType = rep.data;
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
      this.formUser.password = null;
      this.formUser.email = null;
      this.formUser.info = null;
      this.formUser.telephone = null;
      this.formUser.userType = null;
    },
    cancelAdd() {
      this.clearForm();
      this.$router.push("/Users");
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.editUser();
      }
    },

    validateOrgan() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveOrgan();
      }
    },

    async getUserProfileList(id) {
      const rep = await instanceAxios.instanceAxios.get(
        `/platforms/${id}/getUserProfileList`,
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
    },
    async getUser(userId) {
      const rep = await instanceAxios.instanceAxios.get(`/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.userSelected = rep.data;
      return rep.data;
    }
  },

  async mounted() {
    this.token = localStorage.getItem("token");
    this.userSelectedId = this.$route.query.id;
    var user = await this.getUser(this.$route.query.id);
    this.formUser.userName = user.userName;
    this.formUser.email = user.email;
    this.formUser.telephone = user.telephone;
    this.formUser.info = user.info;
    this.platformObjectList = user.platformList;
    await this.getUserProfileList(user.id);
    await this.getplatformList();
    await this.getRoles();
  },
  watch: {
    "formPlatformObject.platform": function(value) {
      this.getUserProfileList(value.id);
    },
    platformObjectList: function(value) {}
  }
};
</script>

<style>
.platformRange {
  display: flex;
  flex-direction: row;
}
</style>
