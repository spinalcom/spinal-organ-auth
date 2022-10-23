<template>
    <v-app class="app">
        <v-card class="d-flex flex-column rounded-lg backup-bar " color="#F7F7F7" elevation="2">
            <span class="title-backupbar">BACKUP LOG TABLE</span>
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

            <div v-for="item in logList" :key="item.id" class="d-flex ">
                <div class="sub-division">
                    <div class="information-backup-bar2">{{ item.id }}</div>
                </div>
                <div class="sub-division">
                    <div class="information-backup-bar2">{{item.parentsInfo.Gparent.name}}</div>
                </div>
                <div class="sub-division">
                    <div class="information-backup-bar2">{{getDate(item.date)}}</div>
                </div>
                <div class="sub-division">
                    <div class="information-backup-bar2">{{item.actor.actorName}}</div>
                </div>
                <div class="sub-division">
                    <div class="information-backup-bar2">{{item.actor.actorId}}</div>
                </div>
                <div class="sub-division">
                    <div class="information-backup-bar2">{{item.message}}</div>
                </div>
            </div>
        </v-card>
    </v-app>
</template>
  
<script>
const instanceAxios = require("../../../services/axiosConfig");

export default {
    name: "App",
    components: {
    },
    data: () => ({
        token: "",
        value: null,
        logList: [],
        logPostion: {},

    }),

    methods: {

        getDate(dateNumber) {
            var date = new Date(dateNumber);
            return date;
        },
        async getLogs() {
            const rep = await instanceAxios.instanceAxios.get("/logs", {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": this.token
                }
            });
            this.logList = rep.data;
        },
    },

    mounted() {
        this.token = localStorage.getItem("token");
        this.getLogs();

    },
}

</script>
  
<style scoped lang="scss">
.app {
    font: normal normal normal 10px/12px Charlevoix Pro;
    letter-spacing: 1px;
    background: #eeeeee00;
}
.backup-bar {
    margin-top: 10px;
    padding: 10px;
}

.sub-division {
    display: flex;
    flex-direction: column;
    width: 20%;
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