<template>
    <v-app>
        <v-main>
            <InformationBar v-on:btn1="trigtest()" v-on:btn2="displayEditUser()" v-on:btn3="deleteUser()"
                title="INFORMATION DE L'UTILISATEUR" :title2="this.user.userName" :icon="'mdi-account' ">
                <div class="d-flex">
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">USER ID</span>
                        <span class=" bar-information">{{this.user.id}}</span>
                    </div>
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">EMAIL</span>
                        <span class="bar-information">{{this.user.email}}</span>
                    </div>
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">TYPE</span>
                        <span class="bar-information">{{this.user.type}}</span>
                    </div>
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">TELEPHONE</span>
                        <span class="bar-information">{{this.user.telephone}}</span>
                    </div>
                </div>
                <div class="d-flex flex-column mr-16">
                    <span class="bar-sub-title">INFO</span>
                    <span class="bar-information">{{this.user.info}}</span>
                </div>
            </InformationBar>


            <BachupInformation title="BACKUP PLATFORM DETAIL TABLE">
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
                            <div class="sub-division">
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
                            <div class="sub-division">
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
import Tabs from "../Components/Tabs.vue";


export default {
    name: "App",
    components: {
        InformationBar,
        BachupInformation,
        Tabs
    },
    data() {
        return {
            token: null,
            user: {},
            logList: [],
            items: [
                'PLATFORMS', 'LOGS',
            ],
            platformObjectList: [],
        };
    },
    methods: {
        displayEditUser() {
            if (this.user.name === "authAdmin") {
                this.$router.push({ name: "EditAdminProfile" });
            } else {
                this.$router.push({ name: "EditUser", query: { id: this.user.id } });
            }
        },
        getDate(date) {
            var acDate = new Date(date);
            return acDate;
        },
        async getplatforms(_user) {
            for (const platform of _user.platformList) {
                const _platform = await this.getplatform(platform.platformId);
                let infoPlatform = {
                    _platform: _platform,
                    userProfile: {
                        name: platform.userProfile.userProfileName,
                        userProfileId: platform.userProfile.userProfileBosConfigId
                    }
                };
                this.platformObjectList.push(infoPlatform);
            }
            console.log(this.platformObjectList);
            return this.platformObjectList;
        },
        async getUserLogs() {
            const rep = await instanceAxios.instanceAxios.get(
                `/users/${this.user.id}/userLogs`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.token
                    }
                }
            );
            this.logList = rep.data;
        },
        async getUser(userId) {
            const rep = await instanceAxios.instanceAxios.get(`/users/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": this.token
                }
            });
            this.user = rep.data;
            return rep.data;
        },

        trigtest() {
            console.log("je test ma function");
        },

        async deleteUser(ask = true) {
            let r = true;
            if (ask)
                r = confirm(
                    "Êtes vous sur de vouloir supprimer cet utilisateur ?"
                );
            if (r === true) {
                if (this.user.name === "authAdmin") {
                    alert("you cannot delete this item");
                } else {
                    await instanceAxios.instanceAxios.delete(`/users/${this.user.id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "x-access-token": this.token
                        }
                    });
                    this.$router.push({ name: "Users", params: { id: this.user.id } });
                }
            }
        },
    },


    async mounted() {
        this.token = localStorage.getItem("token");
        var rep = await this.getUser(this.$route.query.id);
        await this.getplatforms(rep);
        this.getUserLogs();
    }

}
</script>
  
<style scoped lang="scss">
.v-application {
    background: #eeeeee00;
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