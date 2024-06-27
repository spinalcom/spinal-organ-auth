<template>
    <v-app>
        <v-main>
            <BachupInformation title="EDIT USER">
                <form class="formulaire" novalidate @submit.prevent="validateUser">
          <!-- <InputUser
            title="NOM D'UTILISATEUR"
            id="telephone"
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
            >Le nom est invalide</span
          > -->

                    <InputUser title="EMAIL" id="email" v-model="formUser.email" />
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formUser.email.required"
            >Un Email est requis</span
          >
          <InputUser
            title="TELEPHONE"
            id="telephone"
            v-model="formUser.telephone"
          />
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formUser.telephone.required"
            >Un numero de téléphone est requis</span
          >
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-else-if="!$v.formUser.telephone.numeric"
            >Le numéro de téléphone doit être composé uniquement de
            chiffre.</span
          >
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-else-if="!$v.formUser.telephone.minLength"
            >Le numero de telephone est invalide</span
          >
                    <InputUser title="INFO" id="info" v-model="formUser.info" />
          <span
            class="errors"
            :class="{ showspan: iserrors }"
            v-if="!$v.formUser.info.required"
            >Une information est requise</span
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

          <div
            v-for="(platform, index) in newuserplatform"
            class="mt-5 platform-valid"
          >
                        <div class="selector">
              <InputUser
                :readonly="true"
                title="PLATEFORME"
                id="telephone"
                :value="platform.platformName"
              />
              <InputUser
                :readonly="true"
                title="PROFIL D'UTILISATEUR"
                id="telephone"
                :value="platform.userProfile.userProfileName"
              />
                        </div>
            <button
              @click="deletePlatformObjectitem(index)"
              type="button"
              class="red-cross"
            >
              X
            </button>
                    </div>

                    <!-- <AddPlatform :types="'user'" ref="refplatform" :sendplatform="this.detailUser.platformList" /> -->
          <span
            style="position: absolute; margin-top: -45px"
            class="errors"
            :class="{ showspan: !error_platform }"
          >
                        Les accès aux utilisateurs sont incorrects.
                    </span>
                    <div class="d-flex justify-end">
                        <div class="btn-retour" @click="cancelAdd()">RETOUR</div>
            <button type="submit" class="btn-creer">
              MODIFIER L'UTILISATEUR
            </button>
                    </div>
                </form>
            </BachupInformation>
        </v-main>
    </v-app>
</template>

<script>
import BachupInformation from "../Components/BackupInformation.vue";
import InputUser from "../Components/InputUser";
import InputPass from "../Components/InputPassword";
import SelectUser from "../Components/SelectUser.vue";
import AddPlatform from "../Components/AddPlatform";
import { validationMixin } from "vuelidate";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";

export default {
    components: {
        BachupInformation,
        InputUser,
        InputPass,
        SelectUser,
        AddPlatform
    },
    data() {
        return {
            newuserplatform: {},
            formUser: {
                userName: null,
                telephone: null,
                email: null,
                info: null,
                userType: null,
                platformList: null,
            },
      userType: [
        {
          name: "Simple User",
            },
            {
          name: "Super User",
        },
      ],
            iserrors: true,
            error_platform: false,
        };
    },
    validations: {
        formUser: {
            userName: {
                required,
        minLength: minLength(3),
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
        deletePlatformObjectitem(index) {
            if (this.newuserplatform.hasOwnProperty(index)) {
                this.newuserplatform.splice(index, 1);
            }
            console.log(this.newuserplatform);
        },

        cancelAdd() {
            this.$router.push("/Users");
        },

        async updateUserform() {
      await this.$store.dispatch("users/getUser", this.$route.query.id);
            this.formUser.userName = this.detailUser.name;
            this.formUser.telephone = this.detailUser.telephone;
            this.formUser.email = this.detailUser.email;
            this.formUser.info = this.detailUser.info;
            this.formUser.userType = this.detailUser.userType;
      this.newuserplatform = this.detailUser.platformList;
        },

    ...mapActions({ updateUser: "users/updateUser" }),

        async validateUser() {
            // await this.$refs.refplatform.maFonction();
            this.$v.$touch();

            if (!this.$v.$invalid) {
        console.log("valid form");
                var objectBody = {
          // userName: this.formUser.userName,
          userName: this.detailUser.name,
                    email: this.formUser.email,
                    telephone: this.formUser.telephone,
                    info: this.formUser.info,
                    userType: this.formUser.userType.name,
          platformList: this.newuserplatform.map((el) => {
                        return {
                            platformId: el.platformId,
                            platformName: el.platformName,
                            userProfile: {
                                userProfileAdminId: el.userProfile.userProfileAdminId,
                                userProfileBosConfigId: el.userProfile.userProfileBosConfigId,
                userProfileName: el.userProfile.userProfileName,
              },
                        };
          }),
                };

                var profile = [objectBody, this.$route.query.id];
                this.updateUser(profile);
            } else {
                this.iserrors = false;
        }
    },
    },
    computed: {
        ...mapGetters({
      detailUser: "users/detailUser",
      platformObjectList: "users/selectedplatformObjectList",
        }),
    },
    created() {
    this.updateUserform();
  },
};
</script>
  
<style scoped>
.v-application {
    background-color: #d6e2e600;
}

.platform-valid {
    width: 99%;
    height: 150px;
    background-color: #e0eee5;
    border-radius: 6px;
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
}

.selector {
    position: relative;
    width: 100%;
}

.formulaire {
    padding-left: 25%;
    padding-right: 25%;
    padding-bottom: 20px;
}

.red-cross {
    margin-top: 22px;
    margin-left: 10px;
    border-radius: 10px;
    height: 42px;
    width: 45px;
    color: orangered;
    border: 1px solid orangered;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-siplatform_copiee: 15px;
    padding-top: 2px;
    transition: 0.2s;
}

.entrance {
    animation: slideInFromTop 0.4s ease-in-out;
}

@keyframes slideInFromTop {
    0% {
        transform: translateY(-20px);
        opacity: 0;
    }

    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.btn-retour {
    border: 1px solid #14202C;
    border-radius: 6px;
    width: 120px;
    height: 40px;
    margin-right: 10px;
    margin-top: 20px;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.btn-creer {
    min-height: 35px;
    border: 0px;
    padding-left: 30px;
    padding-right: 30px;
    background: #14202C;
    border-radius: 6px;
    color: white;
    /* margin-left: 5px; */
    margin-top: 20px;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;

}

.fade_in {
    animation: fadeIn 0.4s ease-in-out;
}

.errors {
    position: absolute;
    color: rgb(255, 0, 0);
    font: normal normal normal 11px/13px Charlevoix Pro;
}

.showspan {
    display: none;
}
</style>