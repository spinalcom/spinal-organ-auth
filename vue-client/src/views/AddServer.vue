<template>

    <v-card class="creationCardContent" elevation="4">
        <form class="formulaire" novalidate @submit.prevent="validateServerInfo">

            <div class="formulaire_info">
                <h4>Saisissez les informations du serveur</h4>

                <div class="formItem">
                    <InputUser title="NOM DU SERVEUR" id="serverName" v-model="serverInfo.name" />
                    <span class="errors" :class="{ hideSpan: hideErrors }" v-if="!$v.serverInfo.name.required">
                        Le nom est requis
                    </span>
                    <span class="errors" :class="{ hideSpan: hideErrors }" v-else-if="!$v.serverInfo.name.minLength">
                        Le doit nom contenir au moins 2 caractères
                    </span>
                </div>

                <div class="formItem">
                    <SelectConnectionType title="METHODE DE CONNEXION" id="connectionMethod" :tab="connectionMethods"
                        v-model="serverInfo.authentication_method" :default_value="defaultAuthenticationMethod"
                        :edit="isEditPage" />
                    <span class="errors" :class="{ hideSpan: hideErrors }"
                        v-if="!$v.serverInfo.authentication_method.required">
                        Le mode d'authentification est obligatoire
                    </span>
                </div>


                <div class="server_info" v-if="serverInfo.authentication_method === 'saml'">

                    <div class="formItem">
                        <InputUser title="Emetteur (Entity ID)" id="issuer"
                            v-model="serverInfo.authentication_info.issuer" />
                    </div>

                    <div class="formItem">
                        <InputUser title="url de connexion" id="entryPoint"
                            v-model="serverInfo.authentication_info.entryPoint" />
                    </div>


                    <div class="formItem">
                        <InputUser title="url de retour" id="callbackUrl"
                            v-model="serverInfo.authentication_info.callbackUrl" />
                    </div>


                    <div class="formItem">
                        <InputUser title="url de deconnexion" id="logoutUrl"
                            v-model="serverInfo.authentication_info.logoutUrl" />
                    </div>


                    <div class="formItem">
                        <TextareaUser title="certificat de l'emetteur" id="cert"
                            v-model="serverInfo.authentication_info.cert" />
                    </div>

                </div>

                <div class="server_info" v-else-if="serverInfo.authentication_method === 'oauth2'">

                    <div class="formItem">
                        <InputUser title="App Client Id" id="appClientId"
                            v-model="serverInfo.authentication_info.clientId" />
                    </div>

                    <div class="formItem">
                        <InputPass title="App Client Secret" id="appClientSecret"
                            v-model="serverInfo.authentication_info.clientSecret" />
                    </div>

                    <div class="formItem">
                        <InputUser title="Scopes (separés par un espace)" id="scopes"
                            v-model="serverInfo.authentication_info.scopes" />
                    </div>

                    <div class="formItem">
                        <SelectGrant title="GRANT TYPES" id="grant_types"
                            v-model="serverInfo.authentication_info.grant_type" />
                    </div>

                    <div class="formItem">
                        <InputUser title="url de connexion" id="endpoint"
                            v-model="serverInfo.authentication_info.endpoint" />
                    </div>

                    <div class="formItem">
                        <InputUser title="url de retour" id="callbackUrl"
                            v-model="serverInfo.authentication_info.callbackUrl" />
                    </div>

                    <div class="formItem">
                        <InputUser title="url de deconnexion" id="logoutUrl"
                            v-model="serverInfo.authentication_info.logoutUrl" />
                    </div>

                </div>

            </div>

            <div class="validation-btn">
                <button class="btn-retour" type="reset" @click="cancelAdd()">ANNULER</button>

                <button type="submit" class="btn-creer">
                    {{ isEditPage ? "MODIFIER LE SERVEUR" : "AJOUTER LE SERVEUR" }}
                </button>
            </div>

        </form>

    </v-card>

</template>

<script>

import BlueButton from "../Components/BlueButton.vue";
import SelectGrant from "../Components/SelectGrants.vue";
import SelectConnectionType from "../Components/SelectPatformConnexionType.vue";
import InputUser from "../Components/InputUser";
import InputPass from "../Components/InputPassword";
import TextareaUser from "../Components/TextareaUser"
import { validationMixin } from "vuelidate";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";

export default {
    name: "ServerList",
    mixins: [validationMixin],
    components: {
        BlueButton,
        SelectGrant,
        SelectConnectionType,
        InputUser,
        TextareaUser,
        InputPass
    },
    async mounted() {
        if (this.$route.name === "EditServer") {
            this.editChargement = true;
            this.isEditPage = true;

            const id = this.$route.query.id;
            this.serverInfo = await this.getServerById(id);
            this.defaultAuthenticationMethod = { name: this.serverInfo.authentication_method, value: this.serverInfo.authentication_method }
        }

    },
    data() {
        this.connectionMethods = [
            { name: "saml", value: "saml" },
            { name: "oauth2", value: "oauth2" }
        ]
        return {
            serverInfo: {
                name: "",
                authentication_method: "",
                authentication_info: {}
            },
            editChargement: false,
            isEditPage: false,
            hideErrors: true,
            defaultAuthenticationMethod: this.connectionMethods[0]
        }
    },
    validations: {
        serverInfo: {
            name: {
                required,
                minLength: minLength(3),
            },

            authentication_method: {
                required,
                format: (value) => {
                    return ["saml", "oauth2"].some(el => el == value);
                }
            }
        },
    },

    methods: {
        ...mapActions({
            addServer: "serverLogin/addServer",
            getServerById: "serverLogin/getServerById",
            editServer: "serverLogin/editServer"
        }),

        cancelAdd() {
            this.$router.push("/Servers");
        },

        async validateServerInfo() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                this.hideErrors = false;
                return
            }

            this.hideErrors = true;

            this.createOrEdit()
                .then(() => {
                    this.$router.push("/Servers");
                }).catch((err) => {
                    console.error(err);
                });
        },

        async createOrEdit() {
            if (!this.isEditPage) return this.addServer(this.serverInfo);

            const editValue = {
                authentication_info: this.serverInfo.authentication_info,
                authentication_method: this.serverInfo.authentication_method,
                name: this.serverInfo.name
            }
            return this.editServer({ serverId: this.$route.query.id, server: editValue });
        }
    },

    watch: {
        "serverInfo.authentication_method": function () {
            console.log(this.editChargement)
            // cette partie permet de ne pas continuer l'execution du watcher
            // lors du chargement de l'edit 
            if (this.editChargement) {
                this.editChargement = false
                return;
            }

            if (this.serverInfo.authentication_method === 'saml') {
                this.serverInfo.authentication_info = {
                    issuer: "",
                    entryPoint: "",
                    cert: "",
                    callbackUrl: "",
                    logoutUrl: "",
                }
            } else if (this.serverInfo.authentication_method === 'oauth2') {
                this.serverInfo.authentication_info = {
                    clientId: "",
                    clientSecret: "",
                    callbackUrl: "",
                    endpoint: "",
                    logoutUrl: "",
                    grant_type: [],
                    scopes: ""
                }
            }
        }
    }
}
</script>

<style scoped>
.creationCardContent {
    width: calc(100% - 20px);
    height: calc(100vh - 100px) !important;
    margin: auto;
    display: flex;
    justify-content: center;
    background: transparent !important;
}

.formulaire {
    /* padding-left: 25%;
  padding-right: 25%;
  padding-bottom: 20px; */
    width: 60%;
    height: 100%;
    font-size: 14px;
    margin: auto;
}

.validation-btn {
    display: flex;
    justify-content: flex-end;
}

.formulaire .formulaire_info {
    width: 100%;
    min-height: 100px;
    /* height: calc(100% - 100px); */
    display: flex;
    flex-direction: column;
    /* justify-content: space-around; */
}

.formulaire .formItem {
    margin-bottom: 20px;
}

.creationCardContent .btn-retour {
    border: 1px solid #14202c;
    border-radius: 6px;
    opacity: 1;
    width: 120px;
    height: 40px;
    margin-right: 5px;
    margin-top: 20px;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
}

.creationCardContent .btn-creer {
    height: 40px;
    border: 0px;
    padding-left: 30px;
    padding-right: 30px;
    background: #14202c;
    border-radius: 6px;
    color: white;
    margin-left: 5px;
    margin-top: 20px;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
}

.creationCardContent .errors {
    margin: 0;
    position: absolute;
    /* background-color: red; */
    /* position: absolute; */
    transform: translate(0, -10%);
    font-size: 10px;
    color: red;
    padding-left: 2px;
    letter-spacing: 1.1px;
}

.creationCardContent .error {
    position: absolute;
    color: rgb(255, 0, 0);
    font: normal normal normal 11px/13px Charlevoix Pro;
}

.creationCardContent .hideSpan {
    display: none;
}
</style>