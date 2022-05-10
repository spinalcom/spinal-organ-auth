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
          <div class="md-title">Edit AuthAdmin</div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('oldPassword')">
                <md-icon>password</md-icon>
                <label for="oldPassword">Old Password</label>
                <md-input
                  name="oldPassword"
                  id="oldPassword"
                  autocomplete="given-name"
                  v-model="formUser.oldPassword"
                  type="password"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.formUser.oldPassword.required"
                  >The Old password is required</span
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
            >edit authAdmin</md-button
          >
        </md-card-actions>
      </md-card>
      <md-snackbar
        :md-active.sync="userSaved"
        :md-position="position"
        :md-duration="isInfinity ? Infinity : duration"
        md-persistent
      >
        <span>The {{ lastUser }} was edited with success!</span>
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
  name: "EditAdminProfile",
  components: {},
  data() {
    return {
      token: null,
      position: "center",
      duration: 3000,
      isInfinity: false,
      formUser: {
        oldPassword: null,
        password: null,
        telephone: null,
        email: null,
        info: null
      },
      userSaved: false,
      sending: false,
      lastUser: null
    };
  },

  validations: {
    formUser: {
      oldPassword: {
        required
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
      }
    }
  },
  computed: {},
  methods: {
    async editUser() {
      var objectBody = {
        userName: "authAdmin",
        oldPassword: this.formUser.oldPassword,
        newPassword: this.formUser.password,
        email: this.formUser.email,
        telephone: this.formUser.telephone,
        info: this.formUser.info
      };

      const rep = await instanceAxios.instanceAxios.put(`/users`, objectBody, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      if (rep) {
        this.lastUser = `${objectBody.userName}`;
        this.userSaved = true;
        this.sending = false;
        this.clearForm();
        window.setTimeout(() => {
          this.$router.push("/Dashboard");
        }, 1500);
      }
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
      this.formUser.oldPassword = null;
      this.formUser.password = null;
      this.formUser.email = null;
      this.formUser.info = null;
      this.formUser.telephone = null;
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
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
  },
  watch: {}
};
</script>

<style>
.platformRange {
  display: flex;
  flex-direction: row;
}
</style>
