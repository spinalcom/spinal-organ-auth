<template>
    <v-app>

        <form class="formulaire" novalidate @submit.prevent="validateUser">
            <span class="title-add-app">AJOUTER UNE APPLICATION</span>
            <div class="corp">
                <div class="appli">
                    <p style="margin-bottom: 18px;font: normal normal normal 13px/17px Charlevoix Pro;">Rentrez les
                        informations
                        de l’application.</p>
                    <InputUser title="NOM DE L'APPLICATION" id="appName" v-model="formApp.appName" />
                    <span class="error" :class="{'showspan' : iserror }" v-if="!$v.formApp.appName.required">Le nom
                        de l'application est requis</span>

                    <InputPass title="CLIENT ID" id="password" v-model="formApp.password" />
                    <InputPass title="CLIENT SECRET" id="password" v-model="formApp.password2" />

                    <SelectUser title="TYPE D’APPLICATION"></SelectUser>

                    <p class="mt-6">Sélectionnez les accès de plateformes.</p>
                    <!-- composant à faire -->
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
                        <button type="submit" class="btn-creer">CRÉER L’APPLICATION</button>
                    </div>
                </div>
            </div>


        </form>



    </v-app>
</template>
  
<script >
const instanceAxios = require("../../../services/axiosConfig");
import InputUser from "../Components/InputUser";
import InputPass from "../Components/InputPassword";
import SelectUser from "../Components/SelectUser.vue";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
    mixins: [validationMixin],
    components: {
        InputUser,
        SelectUser,
        InputPass,
    },
    // ...

    data() {
        return {
            show1: false,
            show2: false,
            token: null,
            formApp: {
                appName: null,
                password: null,
                password2: null,
                userType: null,
            },
            platformList: [],
            userType: [],
            iserror: true,
            userProfileList: []
        };
    },
    validations: {
        formApp: {
            appName: {
                required,
                minLength: minLength(3)
            },
            password: {
                required,
            },
            password2: {
                required,
            },
            userType: {
                required
            }
        }
    },
    methods: {
        validateUser() {
            this.$v.$touch();
            if (!this.$v.$invalid) {
            } else {

                console.log(this.iserror);
                this.iserror = false;

            }
        },
        cancelAdd() {
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

.title-add-app {
    text-align: left;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
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

.v-application {
    background-color: #21435300;
}

.formulaire {
    border-radius: 10px;
    padding: 15px;
    background-color: #F7F7F7;
    box-shadow: 0px 3px 10px #49545C29;

}

.main {
    background: #D6E2E6;
}



.selector {
    position: relative;
    width: 100%;
}

.testo {
    background: #73ace6;
}
</style>