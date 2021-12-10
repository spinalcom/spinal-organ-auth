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
  <div class="md-layout text-center">
    <div
      class="
        md-layout-item
        md-size-33
        md-medium-size-50
        md-small-size-70
        md-xsmall-size-100
      "
    >
      <login-card header-color="green">
        <h4 slot="title" class="title">Authentication Spinalcom</h4>
        <md-field class="md-form-group" slot="inputs">
          <md-icon>face</md-icon>
          <label>UserName...</label>
          <md-input v-model="userName"></md-input>
        </md-field>

        <md-field class="md-form-group" slot="inputs">
          <md-icon>lock_outline</md-icon>
          <label>Password...</label>
          <md-input v-model="password" type="password"></md-input>
        </md-field>

        <md-button
          slot="footer"
          class="md-simple md-success md-lg"
          @click="login"
        >
          Log In
        </md-button>
        <md-button
          slot="footer"
          class="md-simple md-success md-lg"
          @click="showusers"
        >
          Users
        </md-button>
      </login-card>
    </div>
  </div>
</template>
<script>
import { LoginCard } from "@/components";
import axios from "axios";
import VueRouter from "vue-router";
import { tokenGen } from "@/routes/genToken.js";
export default {
  components: {
    LoginCard
  },
  data() {
    return {
      userName: "authAdmin",
      password: "spinalcom",
      info: null
    };
  },
  mounted() {},
  methods: {
    async login() {
      // let userparams = {
      //   userName: this.userName,
      //   password: this.password
      // };
      // // const response = await axios
      // //   .post("http://localhost:4040/users/login", userparams)
      // //   .then(response => (this.info = response));
      // // if (this.info) {
      // //   // router.push("dashboard");
      // //   this.$router.push("/dashboard");
      // // }
      // const rep = await axios
      //   .post("http://localhost:4040/users/login", userparams)
      //   .then(response => (this.info = response));
      // if (this.info) {
      //   localStorage.setItem("token", this.info.data.token);
      //   this.$router.push("/dashboard");
      // }
      try {
        await tokenGen(this.userName, this.password);
        this.$router.push("/register");
      } catch (error) {}
    },
    async showusers() {
      const rep = await axios.get("http://localhost:4040/users", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.info.data.token
        }
      });
      console.log("users", rep);
    }
  }
};
</script>

<style></style>
