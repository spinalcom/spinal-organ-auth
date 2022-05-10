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
  <form novalidate class="md-layout" @submit.prevent="validateEditPlatform">
    <md-card class="md-layout md-size-100 md-small-size-100">
      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('platformName')">
              <label for="platformName">Platform Name</label>
              <md-input
                name="platformName"
                id="platformName"
                autocomplete="given-name"
                v-model="formPlatform.platformName"
                :disabled="sending"
              >
              </md-input>
              <span
                class="md-error"
                v-if="!$v.formPlatform.platformName.required"
                >The name is required
              </span>
              <span
                class="md-error"
                v-else-if="!$v.formPlatform.platformName.minlength"
                >Invalid name
              </span>
            </md-field>
          </div>
        </div>
      </md-card-content>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
      <md-card-actions>
        <md-button @click="cancelAdd" class="btn-next md-danger">
          Cancel
        </md-button>
        <md-button
          type="submit"
          class="btn-next md-primary"
          :disabled="sending"
        >
          Edit
        </md-button>
      </md-card-actions>
    </md-card>
    <md-snackbar
      :md-active.sync="platformSaved"
      :md-position="position"
      :md-duration="isInfinity ? Infinity : duration"
      md-persistent
    >
      <span> The platform {{ lastPlatform }} was updated with success! </span>
    </md-snackbar>
  </form>
</template>

<script>
// import Places from 'vue-places'
import EventBus from "../../../EventBus";
const instanceAxios = require("../../../services/axiosConfig");

import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  name: "EditPlatform",
  mixins: [validationMixin],
  components: {},
  data: () => ({
    platformSelected: null,
    token: null,
    position: "center",
    duration: 3000,
    isInfinity: false,
    formPlatform: {
      platformName: null
    },
    platformSaved: false,
    sending: false,
    lastPlatform: null
  }),
  validations: {
    formPlatform: {
      platformName: {
        required,
        minLength: minLength(3)
      }
    }
  },
  computed: {},
  methods: {
    async editPlatformItem() {
      const rep = await instanceAxios.instanceAxios.put(
        `/platforms/${this.platformSelected.id}`,
        {
          name: this.formPlatform.platformName
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      if (rep !== undefined) {
        window.setTimeout(() => {
          this.lastPlatform = `${this.formPlatform.platformName}`;
          this.platformSaved = true;
          this.sending = false;
          this.clearForm();
          this.$router.back();
        }, 1500);
      }
    },
    cancelAdd() {
      this.clearForm();
      this.$router.back();
    },

    validateEditPlatform() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.editPlatformItem();
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v.formPlatform[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.formPlatform.platformName = null;
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    const aux = EventBus.$on("EDIT_PLATFORM", function(item) {
      this.platformSelected = item;
    });
    this.platformSelected = aux.platformSelected;
  },
  watch: {}
};
</script>

<style>
</style>