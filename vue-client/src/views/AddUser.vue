<template>
  <v-app>
    <v-main>
      <BachupInformation
        style="max-height: 87vh"
        title="AJOUTER UN UTILISATEUR"
      >
        <form class="formulaire" novalidate @submit.prevent="validateUser">
          <p style="margin: 0">Rentrez les informations de l’utilisateur.</p>
          <p style="margin: 0">
            Un e-mail lui sera envoyé pour confirmer son inscription.
          </p>
          <InputUser
            title="NOM DE L'UTILISATEUR"
            id="userName"
            v-model="formUser.userName"
          />
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formUser.userName.required"
            >Un nom est requis</span
          >
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-else-if="!$v.formUser.userName.minLength"
            >Le nom d'utilisateur contenir au moins 3 caractères.
          </span>
          <InputPass
            title="MOT DE PASSE"
            id="password"
            v-model="formUser.password"
          />
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formUser.password.required"
            >Le mot de passe est obligatoire.</span
          >
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-else-if="!$v.formUser.password.minLength"
            >Mot de passe doit contenir au moins 8 caractères</span
          >
          <InputPass
            title="CONFIRMER MOT DE PASSE"
            id="confirmPassword"
            v-model="formUser.confirm_password"
          />
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formUser.confirm_password.required"
            >La confirmation de mot de passe est obligatoire.</span
          >
          <span class="errors" :class="{ showspan: iserrors }" v-if="conf_pass">
            La confirmation de mot de passe doit être identique au mot de passe.
          </span>
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-else-if="!$v.formUser.confirm_password.minLength"
            >Mot de passe doit contenir au moins 8 caractères</span
          >
          <InputUser title="EMAIL" id="Email" v-model="formUser.email" />
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formUser.email.required"
            >Un Email est requis</span
          >

          <SelectUser
            title="TYPE D'UTILISATEUR"
            id="userType"
            :tab="userType"
            v-model="formUser.userType"
          />
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formUser.userType.required"
          >
            The user type is required
          </span>

          <InputUser
            title="TELEPHONE"
            id="telephone"
            v-model="formUser.telephone"
          />
          <!-- <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formUser.telephone.required"
            >Un numero de téléphone est requis</span
          > -->
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formUser.telephone.numeric"
            >Le numéro de téléphone doit être composé uniquement de
            chiffre.</span
          >
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-else-if="!$v.formUser.telephone.minLength"
            >Le numero de telephone doit contenir au moins 8 caractères</span
          >
          <TextareaUser
            title="INFORMATION"
            id="information"
            v-model="formUser.info"
          />
          <!-- <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formUser.info.required"
            >Une information est requise</span
          > -->

          <div class="mt-6">
            <span> Sélectionner les accès de l'utilisateur</span>
          </div>
          <AddPlatform
            :types="'user'"
            ref="refplatform"
            @maFonction="validateUser"
          />
          <span
            style="position: absolute; margin-top: -45px"
            class="errors"
            :class="{ showspan: !error_platform }"
          >
            Les accès aux utilisateurs sont incorrects.
          </span>
          <div class="d-flex justify-end">
            <button class="btn-retour" @click="cancelAdd()">RETOUR</button>
            <button type="submit" class="btn-creer">CRÉER L'UTILISATEUR</button>
          </div>
        </form>
      </BachupInformation>
    </v-main>
  </v-app>
</template>

<script >
import InputUser from "../Components/InputUser";
import SelectUser from "../Components/SelectUser.vue";
import TextareaUser from "../Components/TextareaUser.vue";
import BachupInformation from "../Components/BackupInformation.vue";
import InputPass from "../Components/InputPassword";
import AddPlatform from "../Components/AddPlatform";
import { validationMixin } from "vuelidate";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";

export default {
  mixins: [validationMixin],
  components: {
    InputUser,
    SelectUser,
    TextareaUser,
    BachupInformation,
    InputPass,
    AddPlatform,
  },

  data() {
    return {
      formUser: {
        userName: null,
        password: null,
        confirm_password: null,
        telephone: "",
        email: null,
        info: "",
        userType: null,
      },
      error_platform: false,
      iserrors: true,
      userType: [
        {
          name: "Simple User",
        },
        {
          name: "Super User",
        },
      ],
      conf_pass: false,
    };
  },

  validations: {
    formUser: {
      userName: {
        required,
        minLength: minLength(3),
      },
      password: {
        required,
        minLength: minLength(8),
      },
      confirm_password: {
        required,
        minLength: minLength(8),
      },
      email: {
        required,
        email,
      },
      info: {
        // required,
      },
      telephone: {
        // required,
        numeric,
        minLength: minLength(8),
      },
      userType: {
        required,
      },
    },
  },

  methods: {
    cancelAdd() {
      this.$router.push("/Users");
    },

    ...mapActions({ saveUser: "users/saveUser" }),

    async validateUser() {
      await this.$refs.refplatform.maFonction();

      this.$v.$touch();

      if (
        !this.$v.$invalid &&
        this.formUser.confirm_password == this.formUser.password
      ) {
        console.log("valid form");
        var objectBody = {
          userName: this.formUser.userName,
          password: this.formUser.password,
          email: this.formUser.email,
          telephone: this.formUser.telephone,
          info: this.formUser.info,
          userType: this.formUser.userType.name,
          platformList: this.platformObjectList.map((el) => {
            return {
              platformId: el.platformId,
              userProfile: {
                name: el.userProfile.name,
                userProfileId: el.userProfile.userProfileId,
              },
            };
          }),
        };
        this.saveUser(objectBody);
      } else {
        this.iserrors = false;
        if (this.formUser.confirm_password != this.formUser.password) {
          this.conf_pass = true;
        } else {
          this.conf_pass = false;
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      platformObjectList: "users/selectedplatformObjectList",
    }),
  },
};
</script>

<style scoped>
.errors {
  margin: 0;
  position: absolute;
  transform: translate(0, -10%);
  font-size: 10px;
  color: red;
  padding-left: 2px;
  letter-spacing: 1.1px;
}

.v-application {
  background-color: #d6e2e600;
}

.btn-retour {
  border: 1px solid #14202c;
  border-radius: 6px;
  opacity: 1;
  width: 120px;
  height: 40px;
  margin-right: 5px;
  margin-top: 20px;
  font-size: 10px;
  letter-spacing: 1.1px;
  transition: 0.1s;
}

.btn-retour:hover {
  background-color: #e2e2e2;
}

.btn-creer {
  border: 0px;
  padding-left: 30px;
  padding-right: 30px;
  background: #14202c;
  border-radius: 6px;
  color: white;
  margin-left: 5px;
  margin-top: 20px;
  font-size: 10px;
  letter-spacing: 1.1px;
  transition: 0.1s;
  border: 1px solid #14202c;
  transition: 0.1s;
}

.btn-creer:hover {
  background-color: #e2e2e2;
  color: #14202c;
}

.showspan {
  display: none;
}

.formulaire {
  padding-left: 25%;
  padding-right: 25%;
  padding-bottom: 20px;
  font-size: 14px;
}

.showspan {
  display: none;
}
</style>