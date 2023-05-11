<template>
    <v-app>
        <v-main>
            <InformationBar v-on:btn2="displayEditUser()" v-on:btn3="deleteUser()" title="INFORMATION DE L'UTILISATEUR"
                :title2="this.user.userName" :icon="require('../assets/image/USE_icon.svg')">
                <div class="d-flex">
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">USER ID</span>
                        <span class=" bar-information">{{ this.user.id }}</span>
                    </div>
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">EMAIL</span>
                        <span class="bar-information">{{ this.user.email }}</span>
                    </div>
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">TYPE</span>
                        <span class="bar-information">{{ this.user.type }}</span>
                    </div>
                    <div class="d-flex flex-column mr-16">
                        <span class="bar-sub-title">TELEPHONE</span>
                        <span class="bar-information">{{ this.user.telephone }}</span>
                    </div>
                </div>
                <div class="d-flex flex-column mr-16">
                    <span class="bar-sub-title">INFO</span>
                    <span class="bar-information">{{ this.user.info }}</span>
                </div>
            </InformationBar>

            <BackupInformation style="max-height: 60%;" title="DÉTAIL PROFIL D'UTILISATEUR">
                <Tabs :items="items">
                    <v-tab-item>
                        <div class="d-flex mt-2 mb-2">
                            <div class="sub-division">
                                <span class="subtitle-backbar">Nom</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">Statut</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">Message</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">Id Acteur</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">Nom Acteur</span>
                            </div>
                        </div>
                        <div v-for="item2, index2 in platformObjectList" :key="index2" class="d-flex mt-2 mb-2">
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{ item2._platform.name }}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{ item2._platform.statusPlatform }}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{ item2.userProfile.name }}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{ item2.userProfile.userProfileId }}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{ item2._platform.name }}</div>
                            </div>
                        </div>
                    </v-tab-item>
                    <v-tab-item>
                        <FiltreBar v-on:btn1="filtre()" @logsdate1="logsdate1 = $event" @logsdate2="logsdate2 = $event"
                            v-model:logsnom="logsnom" @logsnom="logsnom = $event" @logsclientid="logsclientid = $event"
                            v-model:logsclientid="logsclientid" ref="filterbar" />
                        <div class="d-flex mt-2 mb-2">
                            <div class="sub-division">
                                <span class="subtitle-backbar">Nom</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">Date</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">Message</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">Id Acteur</span>
                            </div>
                            <div class="sub-division">
                                <span class="subtitle-backbar">Nom Acteur</span>
                            </div>
                        </div>
                        <div v-for="item, index in logList" :key="index">
                            <div v-if="item.name.toLowerCase().includes(logsnom.toLowerCase()) && item.actor.actorId.toLowerCase().includes(logsclientid.toLowerCase()) && filtre(item.date)"
                                class="d-flex mt-2 mb-2">
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{ item.name }}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{ getDate(item.date) }}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{ item.message }}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{ item.actor.actorId }}</div>
                            </div>
                            <div class="sub-division">
                                <div class="information-backup-bar2">{{ item.actor.actorName }}</div>
                            </div>
                            </div>
                        </div>
                    </v-tab-item>
                </Tabs>
            </BackupInformation>
        </v-main>
    </v-app>
</template>
  
<script>
import InformationBar from "../Components/InformationBar.vue";
import BackupInformation from "../Components/BackupInformation.vue";
import Tabs from "../Components/Tabs.vue";
import FiltreBar from "../Components/FiltreBar.vue";

export default {
    name: "App",
    components: {
        InformationBar,
        BackupInformation,
        Tabs,
        FiltreBar
    },
    data() {
        return {
            logsdate1: '',
            logsdate2: '',
            logsnom: '',
            logsclientid: '',
            user: {
                id: 1233456,
                userName: 'nom de la personne',
                email: 'gabriel@a.com',
                type: 'super User',
                telephone: '0123456789',
                info: 'information stoqué en dure , information user stoqué dans un tableau information '
            },
            logList: [{
                name: 'le nom',
                date: '02-02-2000',
                message: 'le message',
                actor: {
                    actorId: '02325',
                    actorName: ' le nom'
                }
            },
            {
                name: 'le nom',
                date: '02-02-2000',
                message: 'le message',
                actor: {
                    actorId: '02325',
                    actorName: ' le nom'
                }
            }],
            items: [
                'PLATFORME', 'LOGS',
            ],
            platformObjectList: [{
                _platform: {
                    name: 'salut',
                    statusPlatform: 'aaa',
                },
                userProfile: {
                    name: 'salut',
                    userProfileId: 'le chocolat'
                }
            }]
        };
    },
    methods: {
        getDate(date) {
            var acDate = new Date(date);
            return acDate;
        },
        displayEditUser() {
            this.$router.push('EditUser');
        },
        
        filtre(dateparam) {
            const date = new Date(dateparam);
            const start = new Date(this.logsdate1);
            const end = new Date(this.logsdate2);
            if (this.logsdate1 != '' && this.logsdate2 != '') {
                if (date > start && date < end) {
                    return true
                } else {
                    return false
                }
            } else if (this.logsdate1 != '' && this.logsdate2 == '') {
                if (date > start) {
                    return true
                } else
                    return false
            } else {
                return true
            }
        }
    
    },

}
</script>
  
<style scoped >
.v-application {
    background: #eeeeee00;
}

.sub-division {
    display: flex;
    flex-direction: column;
    width: 20%;
}

.bar-sub-title {
    color: #949DA6;
    margin-bottom: 6px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 11px;
    letter-spacing: 1.1px;
}

.bar-information {
    margin-bottom: 10px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    letter-spacing: 1.3px;
    font-size: 11px;
    color: #14202C;

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
</style>