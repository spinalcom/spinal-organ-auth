<template>
    <v-app>
        <v-main>
            <div v-if="show" class="popup_platform">
                <v-card class="popup">
                    <div @click="show = false" class="popup-closebtn">
                        <span>X</span>
                    </div>
                    <p class="mb-6">AJOUTER À UNE PLATFORME</p>
                    <div class="choix_platform">
                        <SelectUser style="z-index: 99;" v-model="formPlatformObjectapp.platform"
                            @select="getAppProfileList()" title="PLATFORM" id="userType" :tab="platformList"
                            :value="formPlatformObjectapp.platform" />

                        <SelectUser v-model="formPlatformObjectapp.appProfileValue" title="APPLICATION" id="userType"
                            :tab="appProfileList" :value="formPlatformObjectapp.appProfileValue" />
                    </div>
                    <div @click="addAppPlatform()" class="mt-4 ml-1 popup-btn-ajouter">
                        <span>AJOUTER</span>
                    </div>
                    <div @click="show = false" class="mt-4 ml-1 popup-btn-fermer">
                        <span>FERMER</span>
                    </div>
                </v-card>
            </div>
            <InformationBar v-on:btn1="showplatform()" v-on:btn2="displayEditApp()" v-on:btn3="deletebtn()"
                title="INFORMATION DE L’APPLICATION" :title2="app.name" :icon="require('../assets/image/APP_icon.svg')">
                <div class="d-flex">
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">APP ID</span>
                        <span class=" bar-information">{{ app.id }}</span>
                    </div>
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">CLIENT ID</span>
                        <span class="bar-information">{{ app.clientId }}</span>
                    </div>
                    <div class="d-flex flex-column mr-8">
                        <span class="bar-sub-title">TYPE</span>
                        <span class="bar-information">{{ app.type }}</span>
                    </div>
                    <!-- <div style="width:20% ;transform: translate(0,-8px);" class="d-flex flex-column ml-2">
                        <BlueButton :icon="'mdi-eye'" title="SECRET ID" :val="'blue'" />
                    </div> -->
                </div>
            </InformationBar>
            <BachupInformation style="max-height: 70%; min-height: 70%;" title="BACKUP PLATFORM APPLICATION TABLE">
                <Tabs :items="items">
                    <v-tab-item>
                        <v-card style="background-color: #F7F7F7;">
                            <div @click="affichage()">
                                <v-data-table fixed-header style="background-color:#F7F7F7;" :footer-props="{
                                    'items-per-page-options': [10, -1]
                                }" :items-per-page="30" height="53vh" :headers="headers2" :items="platformObjectList"
                                    :search="search">
                                </v-data-table>
                            </div>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card style="background-color: #F7F7F7;">
                            <div @click="affichage()">
                                <v-card-title>
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Rechercher"
                                        single-line hide-details>
                                    </v-text-field>
                                </v-card-title>
                                <v-data-table fixed-header style="background-color:#F7F7F7;" :footer-props="{
                                    'items-per-page-options': [10, -1]
                                }" :items-per-page="30" height="47.5vh" :headers="headers"
                                    :items="this.formattedLogList" :search="search">
                                </v-data-table>
                            </div>
                        </v-card>
                    </v-tab-item>
                </Tabs>
            </BachupInformation>
        </v-main>
    </v-app>
</template>

<script>
import InformationBar from "../Components/InformationBar.vue";
import BachupInformation from "../Components/BackupInformation.vue";
import BlueButton from "../Components/BlueButton.vue";
import Tabs from "../Components/Tabs.vue";
import FiltreBar from "../Components/FiltreBar.vue";
import SelectUser from "../Components/SelectUser.vue";
import { mapActions, mapGetters } from "vuex";
export default {
    name: "App",
    components: {
        InformationBar,
        BlueButton,
        BachupInformation,
        Tabs,
        FiltreBar,
        SelectUser,
    },
    data() {
        return {
            newapp: {},
            formPlatformObjectapp: {
                platform: [],
                appProfileValue: []
            },
            appProfileList: [],
            search: '',
            show: false,
            headers: [{ text: 'Nom', value: 'name' },
            { text: 'Date', value: 'date' },
            { text: 'Message', value: 'message' },
            { text: 'Acteur', value: 'actor.actorName' },
            { text: 'Id Acteur', value: 'actor.actorId' },
            ],
            headers2: [{ text: 'Nom de platforme ', value: '_platform.name' },
            { text: 'Statut', value: '_platform.statusPlatform' },
            { text: 'Type', value: '_platform.type' },
            { text: 'Id Application', value: '_platform.id' },
            { text: 'Platforme', value: '_platform.name' },
            ],

            items: [
                'PLATFORMS', 'LOGS',
            ],

        };
    },
    methods: {

        ...mapActions({ updateAppPlatform: 'applications/updateApp' }),
        addAppPlatform() {
            console.log('app1', this.app);
            // this.newapp = this.app;
            this.newapp = JSON.parse(JSON.stringify(this.app));
            delete this.newapp.type;
            delete this.newapp.id;

            console.log('app2', this.app);
            // console.log('newapp:',this.newapp);
            this.newapp.platformList.forEach(platform => {
                delete platform.idPlatformOfAdmin;
            });

            let newPlatform = {
                platformId: this.formPlatformObjectapp.platform.id,
                platformName: this.formPlatformObjectapp.platform.name,
                appProfile: {
                    appProfileAdminId: this.formPlatformObjectapp.appProfileValue.id,
                    appProfileBosConfigId: this.formPlatformObjectapp.appProfileValue.appProfileId,
                    appProfileName: this.formPlatformObjectapp.appProfileValue.name,
                }
            };

            let existingPlatform = this.newapp.platformList.some(platform => platform.platformName === newPlatform.platformName);
            if (existingPlatform) {
                console.log('Error: Platform name already exists.');
                alert('Error: Platform name already exists.');
                this.show = false;
            } else {
                this.newapp.platformList.push(newPlatform);

                var profile = [this.newapp, this.$route.query.id];
                // console.log(profile);
                this.updateAppPlatform(profile);
                // console.log('pas pareil');
                this.show = false;
            }
            // var objectBody = {
            //     name: this.formApp.name,
            //     clientId: this.formApp.clientId,
            //     clientSecret: this.formApp.clientSecret,
            //     appType: this.formApp.appType,
            //     platformList: this.platformObjectList.map(el => {
            //         return {
            //             platformId: el.platformId,
            //             platformName: el.platformName,
            //             appProfile: {
            //                 appProfileAdminId: el.appProfile.appProfileAdminId,
            //                 appProfileBosConfigId: el.appProfile.appProfileBosConfigId,
            //                 appProfileName: el.appProfile.appProfileName
            //             }
            //         };
            //     })
            // };

        },

        showplatform() {
            this.show = true;
            console.log(this.platformList);
        },

        ...mapActions({ deleteApp: 'applications/deleteApp' }),

        deletebtn() {
            this.deleteApp(this.$route.query.id);
        },

        updateApp() {
            this.$store.dispatch('applications/getApp', this.$route.query.id);
            this.$store.dispatch('applications/getApplicationLogs', this.$route.query.id);
        },
        getDate(date) {
            var acDate = new Date(date);
            return acDate;
        },
        displayEditApp() {
            this.$router.push({ name: "EditApp", query: { id: this.app.id } });
        },
        affichage() {
            var a = document.querySelector("#app > div.v-menu__content.theme--light.menuable__content__active");
            if (a != null) {
                a.style.position = "fixed";
            }
        },

        async getAppProfileList() {
            var id = this.formPlatformObjectapp.platform.id
            this.appProfileList = await this.$store.dispatch('applications/getAppProfileList', id);
        },
        getDataFromStore() {

            this.$store.dispatch('users/getplatformList');
        },

    },
    computed: {

        ...mapGetters({
            app: 'applications/detailApp',
            logList: 'applications/appLogList',
            platformObjectList: 'applications/platformObjectList',
            platformList: 'users/platformList',
        }),
        formattedLogList() {
            return this.logList.map(log => {
                log.date = new Date(log.date).toLocaleString();
                return log;
            });
        }
    },
    created() {
        this.updateApp();
        this.getDataFromStore();
    }
}
</script>

<style scoped>
.v-application {
    background-color: #d6e2e600;
}

.v-data-table>>>td {
    background-color: white;
    border-top: 10px solid #F7F7F7;
    border-bottom: solid 0px black !important;
    height: 60px !important;
    font-size: 11px !important;
}

#content>div>main>div>div.d-flex.flex-column.rounded-lg.backup-bar.v-card.v-sheet.theme--light.elevation-2>div.v-tabs.v-tabs--grow.theme--light>div.v-window.v-item-group.theme--light.v-tabs-items>div>div.v-window-item.v-window-item--active>div>div>div.v-card__title>div {
    margin-top: 0;
    padding-top: 0;
}

.choix_platform {
    width: 99%;
    height: 150px;
    background-color: #EAEEF0;
    border-radius: 6px;
    padding-left: 10px;
    padding-right: 10px;
}

.popup {
    position: relative;
    width: 615px;
    height: 280px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    transform: translate(-50%, -100%);
    left: 50%;
    top: 50%;
    border-radius: 10px;
    font-family: Arial, Helvetica, sans-serif;
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
    left: 73%;
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
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
}

.popup-btn-ajouter {
    position: absolute;
    left: 48%;
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
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
}

.v-data-table>>>th {
    background: #F7F7F7 !important;

}

#content>div>main>div>div.d-flex.flex-column.rounded-lg.backup-bar.v-card.v-sheet.theme--light.elevation-2>div.v-tabs.v-tabs--grow.theme--light>div.v-window.v-item-group.theme--light.v-tabs-items>div>div.v-window-item.v-window-item--active>div>div>div.v-card__title {
    padding: 10px;
    background-color: rgb(255, 255, 255);
    border: 1px solid #babbbb;
    border-left: 0px;
    border-right: 0px;
    border-radius: 6px;
}

/* .titlelog {
    padding-top: 10px;
    padding-left: 10px;
    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: 1.1px;
    font-size: 12px;
} */


.sub-division {
    display: flex;
    flex-direction: column;
    width: 20%;
}

.bar-sub-title {

    color: #949DA6;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    margin-bottom: 10px;
}

.bar-information {
    margin-bottom: 10px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    letter-spacing: 1.1px;
}

.information-backup-bar2 {
    background: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9px;
    letter-spacing: 0.9px;
    height: 50px;
    margin-bottom: 3px;
    margin-top: 2px;
    margin-left: 1px;
    padding-left: 8px;
}


.popup_platform {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 99;
    backdrop-filter: blur(5px);
}
</style>