<template>
    <v-app class="app">
        <v-card style="background-color: #F7F7F7; min-width: 980px; padding: 10px;">
            <div @click="affichage()">
                <div class="titlelog">LISTE DES LOGS</div>
                <v-card-title>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Rechercher" single-line
                        hide-details>
                    </v-text-field>
                </v-card-title>
                <v-data-table fixed-header style="background-color: #F7F7F7;" :footer-props="{
                    'items-per-page-options': [10, -1]
                }" :items-per-page="30" height="70vh" :headers="headers" :items="this.formattedLogList" :search="search">
                </v-data-table>
            </div>
        </v-card>
    </v-app>
</template>

<script>
import BackupInformation from "../Components/BackupInformation.vue"
import FiltreBar from "../Components/FiltreBar.vue"
import { mapActions, mapGetters } from "vuex";

export default {
    name: "App",
    components: {
        BackupInformation,
        FiltreBar
    },
    data: () => ({
        token: "",
        search: '',
        value: null,
        logsdate1: '',
        logsdate2: '',
        logsnom: '',
        logsclientid: '',
        headers: [{ text: 'ID', value: 'id' },
        { text: 'Type Dévénement', value: 'parentsInfo.parent.name' },
        { text: 'Date', value: 'date' },
        { text: 'Acteur', value: 'actor.actorName' },
        { text: 'Id Acteur', value: 'actor.actorId' },
        { text: 'Resultat', value: 'message' }],

        logPostion: {},
    }),

    methods: {
        updatelogList() {
            this.$store.dispatch('logs/getLogs')
        },
        affichage() {
            var a = document.querySelector("#app > div.v-menu__content.theme--light.menuable__content__active");
            if (a != null){
                a.style.position = "fixed";
            }
        }
    },
    computed: {
        ...mapGetters({ logList: 'logs/getlogList' }),
        formattedLogList() {
            return this.logList.map(log => {
                log.date = new Date(log.date).toLocaleString();
                return log;
            });
        }
    },

    created() {
        this.updatelogList();
    }
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
    width: 100%;
}

.v-data-table::-webkit-scrollbar {
    width: 10px;
}

.v-data-table::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgb(116, 116, 116);
    border-radius: 4px;
}

.v-data-table::-webkit-scrollbar-thumb {
    background: rgba(133, 133, 133, 0.281);
    border: 1px solid rgba(0, 82, 48, 0.212);
    border-radius: 4px;
}

.v-data-table::-webkit-scrollbar-thumb:hover {
    background: rgba(29, 29, 29, 0.281);
}

.information-backup-bar2 {
    background: rgb(255, 255, 255);
    /* display: flex;
    align-items: center; */
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
    letter-spacing: 0.9px;
    height: 50px;
    margin-bottom: 3px;
    margin-top: 2px;
    margin-left: 1px;
    padding-left: 8px;
    width: 100px;
    /* width: 20%; */
}

.subtitle-backbar {
    width: 16%;
}

.parenttd {
    text-align: start;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
    letter-spacing: 0.9px;
}

.childtd {
    background-color: white;
    border: 1px solid #F7F7F7;
    border-bottom: 2px solid #F7F7F7;
    padding: 10px;
    padding-top: 15px;
    padding-bottom: 15px;
    min-width: 156px;
    width: 20%;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    letter-spacing: 0.9px;
}

.v-data-table>>>td {
    background-color: white;
    border-top: 10px solid #F7F7F7;
    border-bottom: solid 0px black !important;
    height: 60px !important;
    font-size: 11px !important;
}



.v-data-table>>>th {
    background: #F7F7F7 !important;
}

#content>div>div>div>div.v-card__title {
    padding: 10px;
    background-color: rgb(255, 255, 255);
    border: 1px solid #E3E7E8;
    border-radius: 6px;
    margin-top: 20px;
}

#content>div>div>div>div.v-card__title>div {
    padding: 0px;
}

.titlelog {
    padding-top: 10px;
    padding-left: 10px;
    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: 1.1px;
    font-size: 12px;
}
</style>
