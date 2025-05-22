<template>
    <v-app>
        <v-main>
            <BachupInformation title="EDIT USER">
                <form class="formulaire" novalidate @submit.prevent="validateUser">
                    <InputUser title="NOM D'UTILISATEUR" id="telephone" v-model="formUser.userName" />
                    <span class="errors" :class="{ 'showspan': iserrors }" v-if="!$v.formUser.userName.required">Un nom
                        est
                        requis</span>
                    <span class="errors" :class="{ 'showspan': iserrors }"
                        v-else-if="!$v.formUser.userName.minLength">Le nom est
                        invalide</span>
                    <!-- <InputPass title="ANCIEN MOT DE PASSE" id="password" v-model="formUser.oldPassword" />
                    <span class="errors" :class="{ 'showspan': iserrors }" v-if="!$v.formUser.oldPassword.required">Le
                        mot
                        de passe
                        est obligatoire.</span>
                    <span class="errors" :class="{ 'showspan': iserrors }"
                        v-else-if="!$v.formUser.oldPassword.minLength">Mot de
                        passe invalide</span>
                    <InputPass title="NOUVEAU MOT DE PASSE" id="password" v-model="formUser.password" />
                    <span class="errors" :class="{ 'showspan': iserrors }" v-if="!$v.formUser.password.required">La
                        confirmation de mot de passe est obligatoire.</span>
                    <span class="errors" :class="{ 'showspan': iserrors }"
                        v-else-if="!$v.formUser.password.minLength">Mot
                        de passe invalide</span> -->

                    <!-- <button @click="modif_mdp = true" type="button" class="btn-creer">MODIFIER LE MOT DE PASSE</button>
                    <button v-if="modif_mdp" @click="generatePassword" type="button" class="btn-creer fade_in">GENERER
                        UN MOT DE PASSE</button>
                    <InputPass v-if="modif_mdp" class="entrance" title="NOUVEAU MOT DE PASSE" id="password"
                        v-model="formUser.password" /> -->




                    <InputUser title="EMAIL" id="email" v-model="formUser.email" />
                    <span class="errors" :class="{ 'showspan': iserrors }" v-if="!$v.formUser.email.required">Un Email
                        est
                        requis</span>
                    <InputUser title="TELEPHONE" id="telephone" v-model="formUser.telephone" />
                    <span class="errors" :class="{ 'showspan': iserrors }" v-if="!$v.formUser.telephone.required">Un
                        numero de
                        téléphone est requis</span>
                    <span class="errors" :class="{ 'showspan': iserrors }" v-else-if="!$v.formUser.telephone.numeric">Le
                        numéro de
                        téléphone doit être composé uniquement de chiffre.</span>
                    <span class="errors" :class="{ 'showspan': iserrors }"
                        v-else-if="!$v.formUser.telephone.minLength">Le numero
                        de telephone est invalide</span>
                    <InputUser title="INFO" id="info" v-model="formUser.info" />
                    <span class="errors" :class="{ 'showspan': iserrors }" v-if="!$v.formUser.info.required">Une
                        information est
                        requise</span>
                    <SelectUser title="TYPE D'UTILISATEUR" id="userType" :tab="userType" v-model="formUser.userType"
                        :value="formUser.userType" />

                    <span class="errors" :class="{ 'showspan': iserrors }" v-if="!$v.formUser.userType.required">
                        The user type is required
                    </span>
                    <AddPlatform :types="'user'" ref="refplatform" :sendplatform="this.detailUser.platformList" />
                    <span style="position: absolute;margin-top:-45px;" class="errors"
                        :class="{ 'showspan': !error_platform }">
                        Les accès aux utilisateurs sont incorrects.
                    </span>
                    <div class="d-flex justify-end">
                        <div class="btn-retour" @click="cancelAdd()">RETOUR</div>
                        <button type="submit" class="btn-creer">MODIFIER L'UTILISATEUR</button>
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
            formUser: {
                userName: null,
                // oldPassword: null,
                // password: null,
                telephone: null,
                email: null,
                info: null,
                userType: null,
                platformList: null,
            },
            userType: [{
                name: 'Simple User'
            },
            {
                name: 'Super User'
            }],
            iserrors: true,
            error_platform: false,
            // modif_mdp: false,
        };
    },
    validations: {
        formUser: {
            userName: {
                required,
                minLength: minLength(3)
            },
            email: {
                required,
                email
            },
            info: {
                required,
            },
            telephone: {
                required,
                numeric,
                minLength: minLength(8)
            },
            userType: {
                required
            }
        }
    },
    methods: {
        // generatePassword() {
        //     let password = "";
        //     const minLength = 16;
        //     const possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};':\"<>,.?/\\|";
        //     for (let i = 0; i < minLength; i++) {
        //         password += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        //     }
        //     if (!/[A-Z]/.test(password)) {
        //         password = password.substring(0, 15) + "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
        //     }
        //     this.formUser.password = password
        // },

        cancelAdd() {
            this.$router.push("/UsersList");
        },

        async updateUserform() {

            await this.$store.dispatch('users/getUser', this.$route.query.id);
            this.formUser.userName = this.detailUser.name;
            this.formUser.telephone = this.detailUser.telephone;
            this.formUser.email = this.detailUser.email;
            this.formUser.info = this.detailUser.info;
            this.formUser.userType = this.detailUser.userType;
            // this.formUser.oldPassword = this.detailUser.password
        },

        ...mapActions({ updateUser: 'users/updateUser' }),

        async validateUser() {
            await this.$refs.refplatform.maFonction();
            this.$v.$touch();
            if (!this.$v.$invalid) {

                console.log('valid form');

                // var platformObjectLists = {
                //     platformId: "0123",
                //     platformName: "lenom",
                //     userProfile: {
                //         userProfileAdminId: "0123",
                //         userProfileBosConfigId: "012",
                //         userProfileName: 'name'
                //     }
                // }
                // if (this.formUser.password != null) {
                //     var objectBody = {
                //         userName: this.formUser.userName,
                //         password: this.formUser.password,
                //         email: this.formUser.email,
                //         telephone: this.formUser.telephone,
                //         info: this.formUser.info,
                //         userType: this.formUser.userType.name,

                //         platformList: this.platformObjectList.map(el => {
                //             return {
                //                 platformId: el.platformId,
                //                 platformName: el.platformName,
                //                 userProfile: {
                //                     userProfileAdminId: el.userProfile.userProfileAdminId,
                //                     userProfileBosConfigId: el.userProfile.userProfileBosConfigId,
                //                     userProfileName: el.userProfile.userProfileName
                //                 }
                //             };
                //         })
                //     };
                // } else {
                var objectBody = {
                    userName: this.formUser.userName,
                    email: this.formUser.email,
                    telephone: this.formUser.telephone,
                    info: this.formUser.info,
                    userType: this.formUser.userType.name,
                    platformList: this.platformObjectList.map(el => {
                        return {
                            platformId: el.platformId,
                            platformName: el.platformName,
                            userProfile: {
                                userProfileAdminId: el.userProfile.userProfileAdminId,
                                userProfileBosConfigId: el.userProfile.userProfileBosConfigId,
                                userProfileName: el.userProfile.userProfileName
                            }
                        };
                    })
                };
                // }

                var profile = [objectBody, this.$route.query.id];
                this.updateUser(profile);

            } else {
                this.iserrors = false;
            }
        }
    },
    computed: {
        ...mapGetters({
            detailUser: 'users/detailUser',
            platformObjectList: 'users/selectedplatformObjectList',
        }),

    },
    created() {
        this.updateUserform()
    }

}
</script>

<style scoped>
.v-application {
    background-color: #d6e2e600;
}

.formulaire {
    padding-left: 25%;
    padding-right: 25%;
    padding-bottom: 20px;
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