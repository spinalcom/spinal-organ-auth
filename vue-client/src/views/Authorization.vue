<template>
  <v-container class="loginAppContainer" fluid>
    <v-form method="post" action="/oauth/authorize">
      <v-card class="loginCard" elevation="4">
        <v-card-title class="loginCardTitle">
          <div class="logoImg">
            <div class="logo">
              <img class="img" alt="logo" :src="logoSvg" />
            </div>
          </div>
        </v-card-title>

        <v-card-text class="loginCardContent">
          <v-alert v-show="!hide && showError" dense outlined type="error">
            incorrect login and/or password !
          </v-alert>

          <v-text-field outlined height="35" autocomplete="username" dense label="Login" name="userName"
            v-model="credential.userName" required></v-text-field>

          <v-text-field outlined name="password" v-model="credential.password" height="35" dense label="Password"
            required :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'"
            class="input-group--focused" @click:append="showPassword = !showPassword"></v-text-field>

          <v-text-field v-for="key in hiddenKeys" :key="key" style="display: none" :name="key" type="hidden"
            v-model="hidenData[key]"></v-text-field>
        </v-card-text>

        <v-card-actions class="loginCardAction">
          <v-btn dark type="submit"> Connexion </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
// import logoSvg from "../assets/img/logo1.jpg";
import { mapActions } from "vuex";
import logoSvg from "../assets/logo1.jpg";

export default {
  name: "Authorization",
  data() {
    return {
      logoSvg,
      showPassword: false,
      showError: false,
      hide: true,
      hidenData: undefined,
      hiddenKeys: [],
      credential: {
        userName: "",
        password: "",
        client_id: this.$route.query.client_id,
        redirect_uri: this.$route.query.redirect_uri,
        state: this.$route.query.state,
        response_type: this.$route.query.response_type,
        code_challenge: this.$route.query.code_challenge,
        code_challenge_method: this.$route.query.code_challenge_method,
      },
    };
  },
  created() { },
  mounted() {
    this.hidenData = this.$route.query;
    this.hiddenKeys = Object.keys(this.hidenData);
    if (this.$route.query.error) {
      this.showError = true;
      this.hide = false;
    }
  },
  methods: {
    ...mapActions({ authorize: "authorization/authorize" }),
    // async login() {
    //   const data = Object.assign(this.$route.query, this.credential);
    //   this.authorize(data).then((res) => {
    //     if (res) {
    //       console.log(res);
    //     } else {
    //       this.showError = true;
    //     }
    //   });
    // },
  },
  watch: {
    credential: {
      handler() {
        this.hide = true;
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.loginAppContainer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loginAppContainer .loginCardTitle,
.loginAppContainer .loginCardContent,
.loginAppContainer .loginCardAction {
  padding: unset !important;
}

.loginAppContainer .loginCard {
  width: 450px;
  padding: 18px;
}

.loginAppContainer .loginCardAction {
  height: 40px;
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.loginCardTitle {
  margin-bottom: 40px;
}

.loginCardTitle .logoImg {
  width: 100%;
  height: 200px;
}

.loginCardTitle .logoImg .logo {
  width: 100%;
  height: 100%;
}

.loginCardTitle .logoImg .logo .img {
  width: 100%;
  height: 100%;
}

.loginCardTitle .description {
  line-height: 25px;
  word-break: keep-all;
  text-align: justify;
  font-size: 0.7em;
}
</style>