<template>
    <v-app>
        <v-main>
            <BachupInformation title="MODIFICATION PLATEFORME">
                <form class="formulaire" novalidate @submit.prevent="validateApp">
                    <InputUser title="NOM DE LA PLATEFORME" id="telephone" v-model="formPlatform.platformName" />
                    <span class="errors" :class="{ 'showspan': iserrors }"
                        v-if="!$v.formPlatform.platformName.minLength">Nom
                        invalide</span>
                    <span class="errors" :class="{ 'showspan': iserrors }"
                        v-else-if="!$v.formPlatform.platformName.required">Un
                        nom de plateforme est requis</span>
                    <div class="d-flex justify-end">
                        <div class="btn-retour" @click="cancelAdd()">RETOUR</div>
                        <button type="submit" class="btn-creer">MODIFIER LA PLATEFORME</button>
                    </div>
                </form>
            </BachupInformation>
        </v-main>
    </v-app>
</template>

<script>
import BachupInformation from "../Components/BackupInformation.vue";
import InputUser from "../Components/InputUser";
import { validationMixin } from "vuelidate";
import { required, email, minLength, numeric } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";

export default {
    name: "App",
    components: {
        BachupInformation,
        InputUser,
    },
    data() {
        return {
            formPlatform: {
                platformName: null,
            },
            iserrors: true,
            error_platform: false,
        };

    },
    validations: {
        formPlatform: {
            platformName: {
                required,
                minLength: minLength(3)
            },
        }
    },
    methods: {
        cancelAdd() {
            this.$router.push("/Platforms");
        },

        // async updateAppForm() {
        //    await this.$store.dispatch('applications/getApp', this.$route.query.id);
        //     console.log(this.detailApp);
        //     this.formApp.appName = this.detailApp.name;
        //     this.formApp.clientId = this.detailApp.clientId;
        //     this.formApp.clientSecret = this.detailApp.clientSecret;
        //     this.formApp.appType = this.detailApp.appType;
        // },

        ...mapActions({ editPlatformItem: 'platforms/editPlatformItem' }),


        async validateApp() {
            this.$v.$touch();

            if (!this.$v.$invalid) {
                console.log('valid form');

                var profile = [this.formPlatform.platformName, this.$route.query.id];
                this.editPlatformItem(profile);
            } else {
                this.iserrors = false;
            }
        }
    },
    computed: {
        ...mapGetters({

        }),
    },
    created() {
        // this.updateAppForm()
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

.errors {
    position: absolute;
    color: rgb(255, 0, 0);
    font: normal normal normal 11px/13px Charlevoix Pro;
}

.showspan {
    display: none;
}
</style>