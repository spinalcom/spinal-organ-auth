<template>
    <v-app>
        <v-main>

            <BachupInformation title="BACKUP PLATFORM DETAIL TABLE">
                <Tabs :items="items">
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
                </Tabs>
            </BachupInformation>

        </v-main>
    </v-app>
</template>
  
<script>
const instanceAxios = require("../../../services/axiosConfig");
import BachupInformation from "../Components/BackupInformation.vue";
import Tabs from "../Components/Tabs.vue";


export default {
    name: "App",
    components: {
        BachupInformation,
        Tabs
    },
    data() {
        return {
            token: null,
            user: {},
            platform: {},
            platformList: [],
            tab: null,
            items: [
                'PLATFORMS', 'LOGS',
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