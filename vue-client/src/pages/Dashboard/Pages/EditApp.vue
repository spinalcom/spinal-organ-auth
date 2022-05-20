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
    <form novalidate class="md-layout" @submit.prevent="validateApp">
      <md-card class="md-layout-item md-size-100 md-small-size-100">
        <md-card-header>
          <div class="md-title">Edit App</div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('name')">
                <md-icon>book_online</md-icon>
                <label for="name">Application Name</label>
                <md-input
                  name="name"
                  id="name"
                  autocomplete="given-name"
                  v-model="formApp.name"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.formApp.name.required"
                  >The name is required</span
                >
                <span class="md-error" v-else-if="!$v.formApp.name.minlength"
                  >Invalid App name</span
                >
              </md-field>
              <md-field :class="getValidationClass('clientId')">
                <md-icon>lock</md-icon>
                <label for="clientId">clientId</label>
                <md-input
                  name="clientId"
                  id="clientId"
                  autocomplete="given-name"
                  v-model="formApp.clientId"
                  type="password"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.formApp.clientId.required"
                  >The clientId is required</span
                >
                <span
                  class="md-error"
                  v-else-if="!$v.formApp.clientId.minlength"
                  >Invalid clientId
                </span>
              </md-field>

              <md-field :class="getValidationClass('clientSecret')">
                <md-icon>lock</md-icon>
                <label for="clientSecret">clientSecret</label>
                <md-input
                  name="clientSecret"
                  id="clientSecret"
                  autocomplete="given-name"
                  v-model="formApp.clientSecret"
                  type="password"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.formApp.clientSecret.required"
                  >The clientSecret is required</span
                >
                <span
                  class="md-error"
                  v-else-if="!$v.formApp.clientSecret.minlength"
                  >Invalid clientSecret
                </span>
              </md-field>

              <md-field :class="getValidationClass('appType')">
                <md-icon>book_online</md-icon>
                <label for="appType">Application Type</label>
                <md-input
                  name="appType"
                  id="appType"
                  autocomplete="given-name"
                  v-model="formApp.appType"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.formApp.appType.required"
                  >The appType is required</span
                >
                <span class="md-error" v-else-if="!$v.formApp.appType.minlength"
                  >Invalid App appType</span
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
                        <label for="appProfileValue">App Profiles</label>
                        <multiselect
                          v-model="formPlatformObject.appProfileValue"
                          :options="appProfileList"
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
                        item.platformName
                      }}</md-table-cell>
                      <md-table-cell md-label="Profile">
                        {{ item.appProfile.name }}
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
            >Edit app</md-button
          >
        </md-card-actions>
      </md-card>
      <md-snackbar
        :md-active.sync="appSaved"
        :md-position="position"
        :md-duration="isInfinity ? Infinity : duration"
        md-persistent
      >
        <span>The app {{ lastApp }} was updated with success!</span>
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
  name: "AddApp",
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
      formApp: {
        name: null,
        clientId: this.generateRegisterKey(),
        clientSecret: this.generateRegisterKey(),
        appType: null
      },
      formPlatformObject: {
        platform: [],
        appProfileValue: null
      },
      platformObjectList: [],
      appProfileList: [],
      appList: [],
      platformList: [],
      appSaved: false,
      sending: false,
      lastApp: null
    };
  },

  validations: {
    formApp: {
      name: {
        required,
        minLength: minLength(3)
      },
      clientId: {
        required,
        minLength: minLength(8)
      },
      clientSecret: {
        required,
        minLength: minLength(8)
      },
      appType: {
        required
      }
    }
  },
  computed: {},
  methods: {
    generateRegisterKey() {
      const generator = require("generate-password");
      var registerKey = generator.generate({
        length: 30,
        numbers: true
      });
      return registerKey;
    },
    async saveApp() {
      var objectBody = {
        name: this.formApp.name,
        clientId: this.formApp.clientId,
        clientSecret: this.formApp.clientSecret,
        appType: this.formApp.appType,
        platformList: this.platformObjectList.map(el => {
          return {
            platformId: el.platformId,
            appProfile: {
              name: el.appProfile.name,
              appProfileId: el.appProfile.appProfileId
            }
          };
        })
      };

      const rep = await instanceAxios.instanceAxios.post(
        "/applications",
        objectBody,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      if (rep) {
        this.lastApp = `${objectBody.name}`;
        this.appSaved = true;
        this.sending = false;
        this.clearForm();
        window.setTimeout(() => {
          this.$router.push("/Application");
        }, 1500);
      }
    },
    savePlateformObject() {
      var test = true;
      for (const platformObject of this.platformObjectList) {
        if (platformObject.platformId === this.formPlatformObject.platform.id) {
          alert("you cannot select platform even twice");
          this.formPlatformObject.platform = [];
          this.formPlatformObject.appProfileValue = null;
          test = false;
        }
      }
      if (test === true) {
        this.platformObjectList.push({
          platformId: this.formPlatformObject.platform.id,
          platformName: this.formPlatformObject.platform.name,
          appProfile: {
            name: this.formPlatformObject.appProfileValue.name,
            appProfileId: this.formPlatformObject.appProfileValue.appProfileId
          }
        });
        this.formPlatformObject.platform = [];
        this.formPlatformObject.appProfileValue = null;
      }
    },
    deletePlatformObjectitem(item) {
      for (let index = 0; index < this.platformObjectList.length; index++) {
        if (this.platformObjectList[index].platformId === item.platformId) {
          this.platformObjectList.splice(index, 1);
        }
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v.formApp[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.formApp.name = null;
      this.formApp.clientId = null;
      this.formApp.clientSecret = null;
      this.formApp.appType = null;
    },
    cancelAdd() {
      this.clearForm();
      this.$router.push("/Application");
    },
    validateApp() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveApp();
      }
    },
    async getAppProfileList(id) {
      const rep = await instanceAxios.instanceAxios.get(
        `/platforms/${id}/getAppProfileList`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      this.appProfileList = rep.data;
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
    this.getAppProfileList();
    this.getplatformList();
  },
  watch: {
    "formPlatformObject.platform": function(value) {
      this.getAppProfileList(value.id);
    }
  }
};
</script>

<style>
.platformRange {
  display: flex;
  flex-direction: row;
}
</style>
