<template>
    <v-app class="app">
        <BackupInformation style=";" title="TABLE DES LOGS">
            <FiltreBar v-on:btn1="filtre()" @logsdate1="logsdate1 = $event" @logsdate2="logsdate2 = $event"
                v-model:logsnom="logsnom" @logsnom="logsnom = $event" @logsclientid="logsclientid = $event"
                v-model:logsclientid="logsclientid" ref="filterbar" />
            <div class="content_log">
                <div class="d-flex mt-2 ">
                    <div class="sub-division">
                        <span class="subtitle-backbar">Nom</span>
                    </div>
                    <div class="sub-division">
                        <span class="subtitle-backbar">Type D'événement</span>
                    </div>
                    <div class="sub-division">
                        <span class="subtitle-backbar">Date</span>
                    </div>
                    <div class="sub-division">
                        <span class="subtitle-backbar">Acteur</span>
                    </div>
                    <div class="sub-division">
                        <span class="subtitle-backbar">Id Acteur</span>
                    </div>
                    <div class="sub-division">
                        <span class="subtitle-backbar">Resultat</span>
                    </div>

                </div>
                <div v-for="item in logList" :key="item.id">
                    <div v-if="item.id.toLowerCase().includes(logsnom.toLowerCase()) && item.actor.actorId.toLowerCase().includes(logsclientid.toLowerCase()) && filtre(item.date)"
                        class="d-flex ">
                        <div class="sub-division">
                            <div class="information-backup-bar2">{{ item.id }}</div>
                        </div>
                        <div class="sub-division">
                            <div class="information-backup-bar2">{{ item.parentsInfoname }}</div>
                        </div>
                        <div class="sub-division">
                            <div class="information-backup-bar2">{{ item.date }}</div>
                        </div>
                        <div class="sub-division">
                            <div class="information-backup-bar2">{{ item.actor.actorName }}</div>
                        </div>
                        <div class="sub-division">
                            <div class="information-backup-bar2">{{ item.actor.actorId }}</div>
                        </div>
                        <div class="sub-division">
                            <div class="information-backup-bar2">{{ item.message }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </BackupInformation>
    </v-app>
</template>
  
<script>
import BackupInformation from "../Components/BackupInformation.vue"
import FiltreBar from "../Components/FiltreBar.vue"

export default {
    name: "App",
    components: {
        BackupInformation,
        FiltreBar
    },
    data: () => ({
        token: "",
        value: null,
        logsdate1: '',
        logsdate2: '',
        logsnom: '',
        logsclientid: '',
        logList: [{
            id: '25412',
            parentsInfoname: 'le nomdu parent',
            date: "18 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '8569',
            parentsInfoname: 'le nomdu parent',
            date: "18 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '99',
            parentsInfoname: 'le nomdu parent',
            date: "18 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '7869',
            parentsInfoname: 'le nomdu parent',
            date: "1 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '555',
            parentsInfoname: 'le nomdu parent',
            date: "15 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '555',
            parentsInfoname: 'le nomdu parent',
            date: "15 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '555',
            parentsInfoname: 'le nomdu parent',
            date: "15 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '555',
            parentsInfoname: 'le nomdu parent',
            date: "15 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '555',
            parentsInfoname: 'le nomdu parent',
            date: "15 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '555',
            parentsInfoname: 'le nomdu parent',
            date: "15 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '555',
            parentsInfoname: 'le nomdu parent',
            date: "15 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '555',
            parentsInfoname: 'le nomdu parent',
            date: "15 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '555',
            parentsInfoname: 'le nomdu parent',
            date: "15 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '555',
            parentsInfoname: 'le nomdu parent',
            date: "15 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '555',
            parentsInfoname: 'le nomdu parent',
            date: "15 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        },
        {
            id: '1235',
            parentsInfoname: 'le nomdu parent',
            date: "14 nov 2020",
            actor: {
                actorName: 'acteur name',
                actorId: '013654'
            },
            message: 'salut'
        }],
        logPostion: {},
    }),
    methods: {
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
  
<style scoped>
.app {
    background: #eeeeee00;
}

.sub-division {
    display: flex;
    flex-direction: column;
    width: 20%;
}

.content_log {
    max-height: 800px;
    overflow: auto; 
}

.content_log::-webkit-scrollbar {
  width: 10px;
}
.content_log::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(116, 116, 116); 
  border-radius: 4px;
}
.content_log::-webkit-scrollbar-thumb {
  background: rgba(133, 133, 133, 0.281);
  border: 1px solid rgba(0, 82, 48, 0.212);
  border-radius: 4px;
}
.content_log::-webkit-scrollbar-thumb:hover {
  background: rgba(29, 29, 29, 0.281);
}
.information-backup-bar2 {
    background: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
    letter-spacing: 0.9px;
    height: 50px;
    margin-bottom: 3px;
    margin-top: 2px;
    margin-left: 1px;
    padding-left: 8px;
}
</style>
