<template>
    <v-app>
        <v-main>
            <InformationBar v-on:btn1="deleteApp()" v-on:btn2="deleteApp()" v-on:btn3="deleteApp()"
                title="INFORMATION DE L’APPLICATION" :title2="app.name" :icon="'mdi-power-plug'">
                <div class="d-flex">
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">APP ID</span>
                        <span class=" bar-information">{{app.id}}</span>
                    </div>
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">CLIENT ID</span>
                        <span class="bar-information">{{app.clientId}}</span>
                    </div>
                    <div class="d-flex flex-column mr-8">
                        <span class="bar-sub-title">TYPE</span>
                        <span class="bar-information">{{app.type}}</span>
                    </div>
                    <div style="width:20%" class="d-flex flex-column">
                        <BlueButton :icon="'mdi-eye'" title="SECRET ID" :val="'blue'" />
                    </div>
                </div>
            </InformationBar>

            <BachupInformation title="BACKUP PLATFORM APPLICATION TABLE">
                <Tabs :items="items">
                    <v-tab-item>
                        <div class="d-flex mt-2 mb-2">
                            <div class="sub-division">
                                <span class="subtitle-backbar">NOM</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">DATE</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">MESSAGE</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">ACTOR ID</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">ACTOR NAME</span>
                            </div>
                        </div>
                        <div v-for="item2, index2 in platformObjectList" :key="index2" class="d-flex mt-2 mb-2">
                            <div style="width: 20%;" class="d-flex flex-column">
                                <div class="information-backup-bar2">{{item._platform.name}}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{item._platform.statusPlatform}}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{item.userProfile.name}}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{item.userProfile.userProfileId}}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{item._platform.name}}</div>
                            </div>
                        </div>
                    </v-tab-item>

                    <v-tab-item>
                        <div class="d-flex mt-2 mb-2">
                            <div class="sub-division">
                                <span class="subtitle-backbar">NOM</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">DATE</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">MESSAGE</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">ACTOR ID</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">ACTOR NAME</span>
                            </div>
                        </div>
                        <div v-for="item, index in logList" :key="index" class="d-flex mt-2 mb-2">
                            <div style="width: 20%;" class="d-flex flex-column">
                                <div class="information-backup-bar2">{{ item.name }}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{getDate(item.date)}}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{item.message}}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{item.actor.actorId}}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{item.actor.actorName}}</div>
                            </div>
                        </div>
                    </v-tab-item>


                </Tabs>


            </BachupInformation>
        </v-main>
    </v-app>
</template>
  
<script>
const instanceAxios = require("../../../services/axiosConfig");
import InformationBar from "../Components/InformationBar.vue";
import BachupInformation from "../Components/BackupInformation.vue";
import BlueButton from "../Components/BlueButton.vue";
import Tabs from "../Components/Tabs.vue";

export default {
    name: "App",
    components: {
        InformationBar,
        BlueButton,
        BachupInformation,
        Tabs,
    },
    data() {
        return {
            token: null,
            app: {},
            items: [
                'PLATFORMS', 'LOGS',
            ],
            logList: [],
            platformObjectList: [],
        };
    },
    methods: {

        async getplatforms(_app) {
            for (const platform of _app.platformList) {
                const _platform = await this.getplatform(platform.platformId);
                let infoPlatform = {
                    _platform: _platform,
                    appProfile: {
                        name: platform.appProfile.name,
                        appProfileId: platform.appProfile.appProfileId
                    }
                };
                this.platformObjectList.push(infoPlatform);
            }
            return this.platformObjectList;
        },
        getDate(date) {
            var acDate = new Date(date);
            return acDate;
        },
        async getApplicationLogs() {
            const rep = await instanceAxios.instanceAxios.get(
                `/applications/${this.app.id}/applicationLogs`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.token
                    }
                }
            );
            this.logList = rep.data;
        },
        async getApp(appId) {
            const rep = await instanceAxios.instanceAxios.get(
                `/applications/${appId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.token
                    }
                }
            );
            this.app = rep.data;
            return rep.data;
        },
        async deleteApp(ask = true) {
            let r = true;
            if (ask)
                r = confirm(
                    "Êtes vous sure de vouloir supprimer cette application ?"
                );
            if (r === true) {
                await instanceAxios.instanceAxios.delete(
                    `/applications/${this.app.id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "x-access-token": this.token
                        }
                    }
                );
                this.$router.push({
                    name: "Application",
                    params: { id: this.app.id }
                });
            }
        },
    },
    async mounted() {
        this.token = localStorage.getItem("token");
        var rep = await this.getApp(this.$route.query.id);
        await this.getplatforms(rep);
        this.getApplicationLogs();
    }
}
</script>
  
<style scoped lang="scss">
.v-application {
    background-color: #d6e2e600;
}

.sub-division{
    display: flex;
    flex-direction: column;
    width: 20%;
}

.bar-sub-title {
    color: #949DA6;
    font: normal normal normal 11px/13px Charlevoix Pro;
    margin-bottom: 10px;
}

.bar-information {
    margin-bottom: 10px;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
}

.information-backup-bar2 {
    background: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    font: normal normal normal 9px/11px Charlevoix Pro;
    letter-spacing: 0.9px;
    height: 50px;
    margin-bottom: 3px;
    margin-top: 2px;
    margin-left: 1px;
    padding-left: 8px;
}
</style>