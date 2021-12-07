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
    <div class="md-layout-item">
      <signup-card>
        <h2 class="title text-center" slot="title">Register</h2>
        <div
          class="
            md-layout-item md-size-50 md-medium-size-50 md-small-size-100
            ml-auto
          "
          slot="content-left"
        >
          <div
            class="info info-horizontal"
            v-for="item in contentLeft"
            :key="item.title"
          >
            <div :class="`icon ${item.colorIcon}`">
              <md-icon>{{ item.icon }}</md-icon>
            </div>
            <div class="description">
              <h4 class="info-title">{{ item.title }}</h4>
              <p class="description">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="
            md-layout-item md-size-50 md-medium-size-50 md-small-size-100
            mr-auto
          "
          slot="content-right"
        >
          <md-field
            class="md-form-group"
            v-for="item in inputs"
            :key="item.name"
          >
            <md-icon>{{ item.icon }}</md-icon>
            <label>{{ item.name }}</label>
            <md-input :v-model="item.nameAttr" :type="item.type"></md-input>
          </md-field>
          <md-checkbox v-model="boolean"
            >I agree to the <a>terms and conditions</a>.</md-checkbox
          >
          <div class="button-container">
            <md-button href class="md-success md-round mt-4" slot="footer"
              >Register</md-button
            >
          </div>
        </div>
      </signup-card>
    </div>
  </div>
</template>
<script>
import { SignupCard } from "@/components";
export default {
  components: {
    SignupCard
  },
  data() {
    return {
      firstname: null,
      boolean: false,
      email: null,
      password: null,
      contentLeft: [
        {
          colorIcon: "icon-danger",
          icon: "lock",
          title: "Spinalcom Autehtication",
          description:
            "We've developed the website with HTML5 and CSS3. The client has access to the code using GitHub."
        }
      ],
      inputs: [
        {
          icon: "face",
          name: "First Name...",
          nameAttr: "firstname",
          type: "text"
        },

        {
          icon: "email",
          name: "Email...",
          nameAttr: "email",
          type: "email"
        },

        {
          icon: "lock_outline",
          name: "Password..",
          nameAttr: "password",
          type: "password"
        }
      ]
    };
  }
};
</script>
<style></style>
