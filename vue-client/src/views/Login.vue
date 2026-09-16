<template>
  <v-app>
    <div class="app">
      <v-card class="pops" elevation="4">
        <!-- <div class="popup-closebtn">
        <span>X</span>
      </div> -->
        <p class="mb-12 title">CONNEXION</p>
        <form class="form_div" novalidate @submit.prevent="submitLogin">
          <v-alert type="error" v-show="displayError">
            Username and/or password incorrect !
          </v-alert>

          <div>
            <InputUser v-model="formUser.userName" class="" title="NOM D'UTILISATEUR" :value="''"
              @input="displayError = false"></InputUser>

            <!-- <InputUser v-model="formUser.password" class="mb-12 mt-6" title="MOT DE PASSE" :value="''"></InputUser> -->
            <InputPass title="MOT DE PASSE" id="clientSecret" v-model="formUser.password"
              @input="displayError = false" />
          </div>
          <button type="submit" class="mt-4 ml-1 popup-btn-fermer">
            <span>VALIDER</span>
          </button>
        </form>
      </v-card>
    </div>
  </v-app>
</template>

<script>
import InputUser from "../Components/InputUser.vue";
import InputPass from "../Components/InputPassword";
import { mapActions } from "vuex";
export default {
  name: "App",
  components: {
    InputUser,
    InputPass,
  },
  data() {
    return {
      displayError: false,
      formUser: {
        // userName: "authAdmin",
        // password: "123456789",
        userName: "",
        password: "",
      },
    };
  },

  methods: {
    submitLogin() {
      this.$store.dispatch("login/login", this.formUser).catch((err) => {
        this.displayError = true;
      });
    },

    ...mapActions({
      getUsers: "login/getUsers",
    }),
  },
};
</script>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.app .pops {
  width: 500px;
  min-height: 350px;
  padding: 20px;
}

.app .pops .title {
  font-size: 2em !important;
  text-align: center;
}

.app .pops .form_div {
  width: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.popup-btn-fermer {
  /* right: 20px;
  bottom: 20px; */
  width: 100%;
  height: 40px;
  float: right;
  background-color: #14202c;
  border-radius: 6px !important;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/*
.app {
  font: normal normal normal 10px/12px Charlevoix Pro;
  letter-spacing: 1px;
  background: #881e1e00;
}

.popup-closebtn {
  top: 7px;
  right: 7px;
  width: 40px;
  height: 40px;
  border: 2px solid #e9ecee;
  opacity: 1;
  position: absolute;
  border-radius: 6px !important;
  justify-content: center;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
  cursor: pointer;
}

.pops {
  min-width: 400px;
  width: 40%;
  left: 50%;
  position: relative;
  transform: translate(-50%, -80%);
  height: 40vh;
  top: 50%;
  padding: 30px;
  border-radius: 6px;
}

.popup {
  position: relative;
  width: 415px;
  height: 269px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  transform: translate(-50%, -100%);
  left: 50%;
  top: 50%;
  border-radius: 10px;
  font-family: Arial, Helvetica, sans-serif;
}*/
</style>
