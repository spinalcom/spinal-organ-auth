<template>
    <v-app class="app">
        <div class="d-flex justify-end" style="width: 100%; min-width: 980px;">
            <InputPassword :readonly="true" id="password" v-model="this.token" />
            <v-card class="d-flex flex-column ml-2 pl-1 pt-1 pb-1 pr-1 justify-center rounded-lg" elevation="2">
                <BlueButton @click.native="generateKey()" :icon="'mdi-sync'" title="GÉNERER UNE CLÉ" :val="'blue'" />
            </v-card>
        </div>
        <BachupInformation title="LISTE DES PLATEFORMES">
            <div class="d-flex mt-2">
                <div style="width:19%;min-width: 230px;" class="sub-division">
                    <span class="subtitle-backbar">Nom</span>
                </div>
                <div class="sub-division">
                    <span class="subtitle-backbar">Nombre d'organe</span>
                </div>
                <div class="sub-division">
                    <span class="subtitle-backbar">Nombre de Profil d'utilisateur</span>
                </div>
                <div class="sub-division">
                    <span class="subtitle-backbar">Nombre de Profil d'application</span>
                </div>
                <div class="sub-division">
                    <span class="subtitle-backbar">statut</span>
                </div>
                <div class="sub-division">
                    <span class="subtitle-backbar"></span>
                </div>
            </div>

            <div v-for="item in this.platformList" :key="item.id">
                <div class="d-flex mb-2">
                    <div style="width:20% ; min-width: 230px;" class="d-flex flex-column">
                        <div class="btn-valider-user rounded-l-lg">
                            <!-- <StateButton :obj="'bos'" :content1="item.name" :icon="'mdi-chip'" /> -->
                            {{ item.name }}
                        </div>

                    </div>
                    <div style="width:16%" class="d-flex flex-column ">
                        <div class="btn-valider-user">
                            <span>{{ item.organs.length }}</span>
                        </div>
                    </div>
                    <div style="width: 16%" class="d-flex flex-column ">
                        <div class="btn-valider-user">
                            <span>{{ item.userProfiles.length }}</span>
                        </div>
                    </div>
                    <div style="width: 16%" class="d-flex flex-column ">
                        <div class="btn-valider-user">
                            <span>{{ item.appProfiles.length }}</span>
                        </div>
                    </div>
                    <div style="width: 36%" class="d-flex flex-column ">
                        <div class="btn-valider-user">
                            <StatutButton :val="item.statusPlatform" title="ONLINE"></StatutButton>
                        </div>
                    </div>
                    <div class="d-flex">
                        <div class="btn-valider-user rounded-r-lg pr-2 hover">
                            <button @click="deletePlatform(item)">
                                <v-icon>mdi-delete-outline</v-icon>
                            </button>
                        </div>

                        <div class="btn-valider-user rounded-r-lg pr-2 hover">
                            <button @click="displayDetail(item)">
                                <v-icon>mdi-arrow-right</v-icon>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </BachupInformation>
        <div v-if="show" class="popup-back">
            <v-card class="popup">
                <div @click="show = false" class="popup-closebtn">
                    <span>X</span>
                </div>
                <p class="mb-12">NOUVELLE CLÉ</p>
                <InputUser :readonly="true" class="mb-12 mt-6" title="CLÉ ENREGISTRÉE" :value="this.registerKey.value">
                </InputUser>
                <div @click="show = false" class="mt-4 ml-1 popup-btn-fermer">
                    <span>FERMER</span>
                </div>
            </v-card>
        </div>
    </v-app>
</template>
  
<script>
import BlueButton from "../Components/BlueButton.vue"
import StatutButton from "../Components/StatutButton.vue"
import InputUser from "../Components/InputUser.vue"
import BachupInformation from "../Components/BackupInformation.vue"
import StateButton from "../Components/StateButton.vue"
import InputPassword from "../Components/InputPassword.vue"
import { mapActions, mapGetters } from "vuex";

export default {
    name: "App",
    components: {
        BlueButton,
        BachupInformation,
        StatutButton,
        InputUser,
        StateButton,
        InputPassword
    },
    data: () => ({
        // token: "",
        show: false,
    }),

    methods: {
        ...mapActions({
            generateRegisterKey: 'platforms/generateRegisterKey',
            deletePlatformItem: 'platforms/deletePlatformItem'
        }),

        getDataFromStore() {
            this.$store.dispatch('platforms/getPlatformlist');
            this.$store.dispatch('platforms/getRegisterKey');
            // this.$store.dispatch('platforms/getApplications');
        },

        async generateKey() {
            this.show = true;
            this.generateRegisterKey();
        },
        displayDetail(item) {
            this.$router.push({ name: "DetailPlatform", query: { id: item.id } });
        },

        async deletePlatform(item) {
            const res = confirm("Voulez-vous vraiment supprimer cette plateforme?");
            if(res) await this.deletePlatformItem(item.id);
        },


    },
    computed: {
        ...mapGetters({
            platformList: 'platforms/platformList',
            registerKey: 'platforms/registerKey'
        }),
        token() {
            return this.registerKey && this.registerKey.value ? this.registerKey.value : null;
        }
    },
    created() {

        this.getDataFromStore();
    }
}
</script>
  
<style scoped >
.app {
    font: normal normal normal 10px/12px Charlevoix Pro;
    letter-spacing: 1px;
    background: #ffffff00;
}

.popup-back {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 99;
    backdrop-filter: blur(5px);
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
}

.btn-valider-user {
    background-color: #ffffff;
    height: 100%;
    display: flex;
    align-items: center;
    min-height: 50px;
    padding-left: 10px;
    font: normal normal normal 12px/14px Charlevoix Pro;
    letter-spacing: 1.2px;
    margin: 1px;
}

.sub-division {
    display: flex;
    flex-direction: column;
    width: 15%;
}

.popup-closebtn {
    top: 7px;
    right: 7px;
    width: 40px;
    height: 40px;
    border: 2px solid #E9ECEE;
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

.popup-btn-fermer {
    position: absolute;
    left: 60%;
    top: 75%;
    width: 145px;
    height: 40px;
    background-color: #14202C;
    border-radius: 6px !important;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.hover:hover {
  background: rgb(228, 228, 228);
  transition: 0.3s;
}
</style>
