<template>
  <v-app>
    <form class="test" novalidate @submit.prevent="validateUser">
      <div class="title">AJOUTER UN UTILISATEUR</div>
      <div class="corp">
        <div class="appli">
          <p style="margin: 0;font: normal normal normal 16px/20px Charlevoix Pro;">Rentrez les informations de
            l’utilisateur. </p>
          <p style="margin: 0;font: normal normal normal 16px/20px Charlevoix Pro;">Un e-mail lui sera envoyé pour
            confirmer son inscription.</p>
          <InputUser title="NOM DE L'UTILISATEUR" id="userName" v-model="formUser.userName" />
          <span class="error" :class="{'showspan' : iserror }" v-if="!$v.formUser.userName.required">The name is
            required</span>

          <InputUser title="PASSWORD" id="password" v-model="formUser.password" />
          <span class="error" :class="{'showspan' : iserror }" v-if="!$v.formUser.password.required">The password is
            required</span>

          <InputUser title="CONFIRM PASSWORD" id="confirmPassword" v-model="formUser.confirm_password" />
          <span class="error" :class="{'showspan' : iserror }" v-if="!$v.formUser.confirm_password.required">The
            password
            is required</span>

          <InputUser title="EMAIL" id="Email" v-model="formUser.email" />
          <span class="error" :class="{'showspan' : iserror }" v-if="!$v.formUser.email.required">The email is
            required</span>

          <InputUser title="TELEPHONE" id="telephone" v-model="formUser.telephone" />


          <TextareaUser title="INFORMATION" />

          <SelectUser title="TYPE D'UTILISATEUR" id="userType" :test="userType" v-model="formUser.userType" />
          <span class="error" :class="{'showspan' : iserror }" v-if="!$v.formUser.userType.required">
            The user type is required
          </span>
          <div class="mt-6">
            <span style="font: normal normal normal 16px/20px Charlevoix Pro;">
              Sélectionner les accès de l'utilisateur
            </span>
          </div>


          <div class="ajout-platform">
            <div class="selector">
              <SelectUser :test="platformList" title="PLATFORM" />
              <SelectUser :test="userProfileList" title="PROFIL UTILISATEUR" />
            </div>
            <button class="red-cross">X</button>
          </div>



          <div style="display: flex; justify-content: flex-end;">
            <button class="btn-ajout-platform">+ AJOUT D'UNE PLATFORM</button>
          </div>

          <div style="display: flex; justify-content: flex-end;">

            <button class="btn-retour" @click="cancelAdd()">RETOUR</button>
            <button type="submit" class="btn-creer">CRÉER L'UTILISATEUR</button>

          </div>
        </div>
      </div>
    </form>
  </v-app>
</template>

<script >
const instanceAxios = require("../../../services/axiosConfig");
import InputUser from "../Components/InputUser";
import SelectUser from "../Components/SelectUser.vue";
import TextareaUser from "../Components/TextareaUser.vue";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  mixins: [validationMixin],
  components: {
    InputUser,
    SelectUser,
    TextareaUser,
  },
  // ...

  data() {
    return {
      token: null,
      formUser: {
        userName: null,
        password: null,
        confirm_password: null,
        telephone: null,
        email: null,
        info: null,
        userType: null,
      },
      platformList: [],
      userType: [],
      iserror: true,
      userProfileList: []
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
      confirm_password: {
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
  methods: {
    validateUser() {
      console.log("ici");
      this.$v.$touch();
      if (!this.$v.$invalid) {
        // this.saveUser();
        console.log('valide');
      } else {
        console.log('invalide');
        console.log(this.iserror);
        this.iserror = false;

      }
    },
    cancelAdd() {
      // this.clearForm();
      this.$router.push("/Users");
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
    async getplatformList() {
      const rep = await instanceAxios.instanceAxios.get(`/platforms`, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.platformList = rep.data;
      console.log(rep.data, 'data 1');
      console.log('aaa');
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
      console.log(rep.data, 'data 2');
      console.log('aa');
    },
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.getRoles();
    this.getplatformList();
    this.getUserProfileList();
  },
}
</script>

<style scoped>
.btn-retour {
  border: 1px solid #14202C;
  border-radius: 6px;
  opacity: 1;
  width: 120px;
  height: 40px;
  margin-right: 5px;
  margin-top: 20px;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
}

.btn-creer {
  border: 0px;
  padding-left: 30px;
  padding-right: 30px;
  background: #14202C;
  border-radius: 6px;
  color: white;
  margin-left: 5px;
  margin-top: 20px;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;
}

.ajout-platform {
  margin-top: 20px;
  background: #EAEEF0;
  border-radius: 10px;
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
}

.btn-ajout-platform {
  border: 0px;
  height: 40px;
  margin-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 6px;
  background: #EAEEF0;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 1.1px;

}

.red-cross {
  margin-top: 22px;
  margin-left: 10px;
  border-radius: 10px;
  padding: 10px;
  height: 40px;
  width: 40px;
  color: orangered;
  border: 1px solid orangered;
}

.title {
  font: normal normal normal 15px/17px Charlevoix Pro;
  letter-spacing: 1.1px;
  color: #214353;
  opacity: 1;
}

.appli {
  width: 40%;
}

.corp {
  display: flex;
  justify-content: center;

}

.error {
  position: absolute;
  color: rgb(255, 0, 0);
  font: normal normal normal 11px/13px Charlevoix Pro;
}

.showspan {
  display: none;
}

.test {
  border-radius: 10px;
  padding: 15px;
  background-color: #F7F7F7;
  box-shadow: 0px 3px 10px #49545C29;
}

.main-panel {
  background-color: #D6E2E6;
}

.selector {
  position: relative;
  width: 100%;
}
</style>