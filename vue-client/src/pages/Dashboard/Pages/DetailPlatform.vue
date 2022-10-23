<template>
    <v-app>
        <v-main>
            <InformationBar title="INFORMATION DU BOS" :title2="this.platform.name" :icon="'mdi-chip'">
                <div class="d-flex">
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">URL</span>
                        <span class=" bar-information">{{this.platform.url}}</span>
                    </div>
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">ADRESSE</span>
                        <span class="bar-information">{{this.platform.address}}</span>
                    </div>
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">STATUT</span>
                        <!-- <span class="bar-information">{{this.platform.statusPlatform}}</span> -->
                        <StatutButton v-if="this.platform.statusPlatform" :val="this.platform.statusPlatform"
                            title="ONLINE"></StatutButton>
                    </div>
                    <div style="max-width: 500px;" class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">TOKEN</span>
                        <span class="bar-information">{{this.platform.TokenBosAdmin}}</span>
                    </div>
                </div>
            </InformationBar>

            <BachupInformation title="BACKUP PLATFORM DETAIL TABLE">
                <v-tabs v-model="tab" background-color="transparent" hide-slider grow>
                    <v-tab v-for="item in items" :key="item">
                        {{ item }}
                    </v-tab>

                    <v-tabs-items class="mt-6" v-model="tab">
                        <v-tab-item>
                            <div class="d-flex mt-2 mb-2">
                                <div style="width: 20%;" class="d-flex flex-column">
                                    <span class="subtitle-backbar">Nom</span>
                                    <div class="information-backup-bar">Bos 3 étage 23</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">Date</span>
                                    <div class="information-backup-bar">
                                        <button>OFFLINE</button>
                                    </div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">Message</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">Actor id</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">Actor name</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                            </div>
                        </v-tab-item>
                        <v-tab-item>
                            <div class="d-flex mt-2 mb-2">
                                <div style="width: 20%;" class="d-flex flex-column">
                                    <span class="subtitle-backbar">NOM</span>
                                    <div class="information-backup-bar">Bos 3 étage 23</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">DATE</span>
                                    <div class="information-backup-bar">
                                        <button>OFFLINE</button>
                                    </div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">MESSAGE</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">ACTOR ID</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">ACTOR NAME</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                            </div>
                        </v-tab-item>
                        <v-tab-item>
                            <div class="d-flex mt-2 mb-2">
                                <div style="width: 20%;" class="d-flex flex-column">
                                    <span class="subtitle-backbar">NOM</span>
                                    <div class="information-backup-bar">Bos 3 étage 23</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">DATE</span>
                                    <div class="information-backup-bar">
                                        <button>OFFLINE</button>
                                    </div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">MESSAGE</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">ACTOR ID</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">ACTOR NAME</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                            </div>
                        </v-tab-item>
                        <v-tab-item>
                            <div class="d-flex mt-2 mb-2">
                                <div style="width: 20%;" class="d-flex flex-column">
                                    <span class="subtitle-backbar">NOM</span>
                                    <div class="information-backup-bar">Bos 3 étage 23</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">DATE</span>
                                    <div class="information-backup-bar">
                                        <button>OFFLINE</button>
                                    </div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">MESSAGE</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">ACTOR ID</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">ACTOR NAME</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                            </div>
                        </v-tab-item>
                        <v-tab-item>
                            <div class="d-flex mt-2 mb-2">
                                <div style="width: 20%;" class="d-flex flex-column">
                                    <span class="subtitle-backbar">NOM</span>
                                    <div class="information-backup-bar">Bos 3 étage 23</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">DATE</span>
                                    <div class="information-backup-bar">
                                        <button>OFFLINE</button>
                                    </div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">MESSAGE</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">ACTOR ID</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">ACTOR NAME</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                            </div>
                        </v-tab-item>
                        <v-tab-item>
                            <div class="d-flex mt-2 mb-2">
                                <div style="width: 20%;" class="d-flex flex-column">
                                    <span class="subtitle-backbar">NOM</span>
                                    <div class="information-backup-bar">Bos 3 étage 23</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">DATE</span>
                                    <div class="information-backup-bar">
                                        <button>OFFLINE</button>
                                    </div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">MESSAGE</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">ACTOR ID</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                                <div style="flex-grow:1" class="d-flex flex-column ">
                                    <span class="subtitle-backbar">ACTOR NAME</span>
                                    <div class="information-backup-bar">test</div>
                                </div>
                            </div>
                        </v-tab-item>
                    </v-tabs-items>

                </v-tabs>

            </BachupInformation>









        </v-main>
    </v-app>
</template>
  
<script>
const instanceAxios = require("../../../services/axiosConfig");
import InformationBar from "../Components/InformationBar.vue";
import StatutButton from "../Components/StatutButton.vue";
import BachupInformation from "../Components/BackupInformation.vue";


export default {
    name: "App",
    components: {
        InformationBar,
        BachupInformation,
        StatutButton
    },
    data() {
        return {
            token: null,
            user: {},
            platform: {},
            platformList: [],
            tab: null,
            items: [
                'ORGANS', 'USER PROFILES', 'APP PROFILES', 'USERS', 'APPS', 'LOGS',
            ],
        };
    },
    methods: {
        async getPlatform(platformId) {
            const rep = await instanceAxios.instanceAxios.get(
                `/platforms/${platformId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.token
                    }
                }
            );
            this.platform = rep.data;
            // console.log(rep.data);
            return rep.data;
        },
    },

    async mounted() {
        this.token = localStorage.getItem("token");
        // console.log(this.$route.query.id, 'coucou');
        var rep = await this.getPlatform(this.$route.query.id);
        // await this.getplatforms(rep);
        // this.getUserLogs();
    }

}
</script>
  
<style scoped lang="scss">
.v-application {
    background: #eeeeee00;
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

.v-tab.v-tab--active {
    background: #F9F9F9;
    text-align: left;
    border: 1px solid #214353;
    border-bottom: 0px solid #214353;
}

.v-tab {
    background: #EAEEF0;
    color: #214353;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: 1px solid #214353;
    border-left: 1px solid #F9F9F9;
    border-right: 1px solid #F9F9F9;
}

.v-window-item {
    background: #F9F9F9;
}
</style>