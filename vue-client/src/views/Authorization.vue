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

          <div class="externalLogin" v-if="externalServers.length > 0">
            <!-- <form v-for="(server, index) in externalServers" :key="index" method="post"
              :action="`/login/${platformId}/${server.id}`"> -->
            <v-btn class="ma-2 connectionBtn" outlined rounded block v-for="(server, index) in externalServers"
              :key="index" @click="connectWithExternalServer(server)">
              Login with {{ server.name }}
            </v-btn>
            <!-- </form> -->
          </div>

          <div class="divider" v-if="localServers.length > 0 && externalServers.length > 0">
            <v-row>
              <v-col cols="4" class="text-center dividerBar">
                <v-divider />
              </v-col>

              <v-col cols="4" class="text-center class dividerText"> or connect with </v-col>

              <v-col cols="4" class="text-center dividerBar">
                <v-divider />
              </v-col>
            </v-row>
          </div>

          <div class="localLogin" v-if="localServers.length > 0">
            <div class="alertDiv" :class="{ 'hide': !showError }">
              incorrect login and/or password !
            </div>

            <v-text-field outlined height="35" autocomplete="username" dense label="Username" name="username"
              v-model="credential.username" required></v-text-field>

            <v-text-field outlined name="password" v-model="credential.password" height="35" dense label="Password"
              required :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'" class="input-group--focused"
              @click:append="showPassword = !showPassword"></v-text-field>

            <v-text-field v-for="key in hiddenKeys" :key="key" style="display: none" :name="key" type="hidden"
              v-model="hiddenData[key]"></v-text-field>
          </div>

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
      hiddenData: undefined,
      hiddenKeys: [],
      externalServers: [],
      localServers: [],
      credential: {
        username: "",
        password: "",
      },
    };
  },
  async created() { },

  async mounted() {
    this.hiddenData = this.$route.query;

    Object.entries(this.hiddenData).forEach(([key, value]) => {
      this.credential[key] = value;
    });

    this.hiddenKeys = Object.keys(this.hiddenData).filter((key) => key !== "username" && key !== "password");

    if (this.hiddenData.error) {
      this.showError = true;
    }

    await this.setServers();

  },
  methods: {
    ...mapActions({ authorize: "authorization/authorize", getServers: "authorization/getServers" }),

    async setServers() {
      const servers = await this.getServers(this.credential.client_id);
      const { localServers, externalServers } = this.getLocalAndExternalServer(servers);

      this.localServers = localServers;
      this.externalServers = externalServers;
    },

    getLocalAndExternalServer(servers) {
      return servers.reduce((obj, server) => {
        if (server.type === "INTERNAL_SERVER") obj.localServers.push(server);
        else obj.externalServers.push(server);

        return obj;
      }, { localServers: [], externalServers: [] });
    },

    connectWithExternalServer(server) {
      const platformId = this.credential.client_id;
      const method = server.authentication_method;
      const endpoint = this.getAuthEndpoint(method);

      this.$router.push({ path: endpoint, query: { platformId, serverId: server.id } }, () => location.reload());
      // console.log(server);
      // this.$router.push({ name: "ExternalServer", params: { platformId: this.credential.client_id, serverId: server.id } });
    },

    getAuthEndpoint(authentication_method) {
      console.log(authentication_method);
      switch (authentication_method.toLowerCase()) {
        case "saml":
          return "saml/login";
        case "oauth2":
          return "oauth2/login";
        case "openid connect":
          return "openid/login";
      }
    }

  },
  watch: {
    credential: {
      handler() {
        this.showError = false;
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.loginAppContainer {
  width: 100vw;
  height: 100vh;
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
  height: 150px;
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

.localLogin {
  width: 100%;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  padding: 5px;
}

.externalLogin {
  width: 100%;
  min-height: 50px;
  padding: 5px;
}

.connectionBtn {
  margin-bottom: 10px;
}

.divider {
  margin: 15px 0;
}

.dividerBar {
  display: flex;
  align-items: center;
}

.dividerText {
  text-transform: capitalize;
}

.alertDiv {
  display: block;
  color: red;
}

.alertDiv.hide {
  display: none !important;
}
</style>