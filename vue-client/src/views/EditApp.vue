<template>
    <v-app>
        <BackupInformation title="">
            <form class="formulaire" novalidate @submit.prevent="validateApp">
                <div class="formContainer">
                    <div class="title">Modifier une application</div>
                    <InputUser title="NOM DE L'APPLICATION" id="appName" v-model="formApp.appName" />
                    <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.appName.required">le nom
                        de
                        l'application est requis</span>

                    <span class="errors" :class="{ showspan: iserrors }" v-else-if="!$v.formApp.appName.minLength">Le
                        nom doit
                        contenir au moins 3 caractères</span>

                    <InputUser title="URL DE REDIRECTION L'APPLICATION" id="redirectUri"
                        v-model="formApp.redirectUri" />

                    <!-- <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.redirectUri.required">l'url de
            redirection d'application est requis</span> -->
                    <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.redirectUri.invalid">
                        l'url est invalid
                    </span>

                    <InputPass readonly="true" title="CLIENT ID" id="clientId" v-model="formApp.clientId" />
                    <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.clientId.required">
                        un id client est requis
                    </span>

                    <InputPass readonly="true" title="CLIENT SECRET" id="clientSecret" v-model="formApp.clientSecret" />
                    <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.clientSecret.required">Le
                        mot de
                        passe
                        est nécessaire</span>

                    <SelectGrant title="GRANT TYPES" id="grant_types" v-model="formApp.grant_types" />
                    <span class="errors" :class="{ showspan: iserrors }" v-if="!$v.formApp.grant_types.isValid">Au
                        moins un type
                        d'autorisation est nécessaire</span>

                    <div class="accessList">
                        <div v-for="(platform, index) in newappplatform" class="mt-5 platform-valid">
                            <div class="selector">
                                <InputUser :readonly="true" title="PLATEFORME" id="telephone"
                                    :value="platform.platformName" />
                                <InputUser :readonly="true" title="PROFIL D'UTILISATEUR" id="telephone"
                                    :value="platform.appProfile.appProfileName" />
                            </div>
                            <button @click="deletePlatformObjectitem(index)" type="button" class="red-cross">X</button>
                        </div>
                    </div>

                </div>


                <div class="d-flex justify-end">
                    <button class="btn-retour" @click="cancelAdd()">RETOUR</button>
                    <button type="submit" class="btn-creer">Modifier L’APPLICATION</button>
                </div>
            </form>
        </BackupInformation>
    </v-app>
</template>


<script>
import BachupInformation from "../Components/BackupInformation.vue";
import InputUser from "../Components/InputUser";
import InputPass from "../Components/InputPassword";
import AddPlatform from "../Components/AddPlatform";
import SelectGrant from "../Components/SelectGrants.vue";
import { required, minLength } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";

export default {
    name: "App",
    components: {
        BachupInformation,
        InputUser,
        InputPass,
        AddPlatform,
        SelectGrant
    },
    data() {
        return {
            newappplatform: {},
            formApp: {
                appName: "",
                redirectUri: "",
                clientId: "",
                clientSecret: "",
                appType: "app",
                grant_types: [],
            },
            iserrors: true,
            error_platform: false,
        };

    },
    validations: {
        formApp: {
            appName: {
                required,
                minLength: minLength(3)
            },
            clientId: {
                required,
            },
            clientSecret: {
                required,
            },
            redirectUri: {
                invalid(value) {
                    if (!value) return true; // If no value, skip validation
                    const regex =
                        /https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))/gm;
                    return regex.test(value);
                },
            },
            grant_types: {
                isValid(value) {
                    return value.length > 0;
                },
            },

        }
    },
    methods: {
        deletePlatformObjectitem(index) {
            if (this.newappplatform.hasOwnProperty(index)) {
                this.newappplatform.splice(index, 1);
            }
        },
        cancelAdd() {
            this.$router.go(-1);
            // this.$router.push("/Application");
        },

        async updateAppForm() {
            await this.$store.dispatch('applications/getApp', this.$route.query.id);
            this.formApp.appName = this.detailApp.name;
            this.formApp.clientId = this.detailApp.clientId;
            this.formApp.clientSecret = this.detailApp.clientSecret;
            this.formApp.redirectUri = this.detailApp.redirectUri;
            this.formApp.grant_types = this.detailApp.grant_types;
            this.newappplatform = this.detailApp.platformList;
        },

        ...mapActions({ updateApp: 'applications/updateApp' }),

        async validateApp() {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                var objectBody = {
                    name: this.formApp.appName,
                    clientId: this.formApp.clientId,
                    clientSecret: this.formApp.clientSecret,
                    grant_types: this.formApp.grant_types,
                    // appType: this.formApp.appType,
                    redirectUri: this.formApp.redirectUri,
                    platformList: this.newappplatform.map(el => {
                        return {
                            platformId: el.platformId,
                            // platformName: el.platformName,
                            appProfile: {
                                appProfileAdminId: el.appProfile.appProfileAdminId,
                                appProfileBosConfigId: el.appProfile.appProfileBosConfigId,
                                appProfileName: el.appProfile.appProfileName
                            }
                        };
                    })
                }
                var profile = [objectBody, this.$route.query.id];
                this.updateApp(profile);
            } else {
                this.iserrors = false;
            }
        }
    },
    computed: {
        ...mapGetters({
            detailApp: 'applications/detailApp',
        }),
    },
    created() {
        this.updateAppForm()
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

.btn-retour {
    border: 1px solid #14202C;
    border-radius: 6px;
    width: 120px;
    height: 40px;
    margin-right: 5px;
    margin-top: 20px;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
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

.errors {
    position: absolute;
    color: rgb(255, 0, 0);
    font: normal normal normal 11px/13px Charlevoix Pro;
}

.showspan {
    display: none;
}
</style>