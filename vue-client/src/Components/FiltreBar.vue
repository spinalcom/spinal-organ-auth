<template >
    <div class="d-flex filterBar">
        <span class="filterBar-title">CHOIX DES FILTRES :</span>
        <input :value="logsnom" @input="$emit('logsnom', $event.target.value)" class="filterBar-information" type="text"
            placeholder="NOM">
        <input :value="logsclientid" @input="$emit('logsclientid', $event.target.value)" class="filterBar-information"
            type="text" placeholder="ID ACTEUR">
        <v-dialog ref="dialog" v-model="modal2" :return-value.sync="date2" persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
                <div style="position: relative;">
                    <span class="filterBar-information-title">Date début</span>
                    <input type="text" class="filterBar-information" prepend-icon="mdi-calendar" v-model="date2"
                        readonly v-bind="attrs" v-on="on" />
                </div>
            </template>
            <v-date-picker locale="fr" header-color="#14202C" color="#14202C" :if="modal2" v-model="date2" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="#14202C" @click="modal2 = false">
                    Annuler
                </v-btn>
                <v-btn text color="#14202C" @click="$refs.dialog.save(date2); $emit('logsdate1', date2)">
                    OK
                </v-btn>
            </v-date-picker>
        </v-dialog>
        <v-dialog ref="dialog1" v-model="modal1" :return-value.sync="date1" persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
                <div style="position: relative;">
                    <span class="filterBar-information-title">Date fin</span>
                    <input type="text" class="filterBar-information" v-model="date1" readonly v-bind="attrs"
                        v-on="on" />
                </div>
            </template>
            <v-date-picker locale="fr" color="#14202C" header-color="#14202C" :if="modal1" v-model="date1" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="#14202C" @click="modal1 = false">
                    Annuler
                </v-btn>
                <v-btn text color="#14202C" @click="$refs.dialog1.save(date1); $emit('logsdate2', date1)">
                    OK
                </v-btn>
            </v-date-picker>
        </v-dialog>
        <div style="margin-bottom: 5px; margin-right:5px">
            <BlueButton @click.native="getall()" :icon="'mdi-note-search-outline'" title="TOUT VISUALISER"
                :val="'blue'" />
        </div>
    </div>
</template>
  
<script>
import BlueButton from "./BlueButton.vue"
export default {
    components: {
        BlueButton
    },
    name: "filtre-bar",
    data() {
        return {
            date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            modal1: false,
            modal2: false,
        }
    },
    props: ['logsnom', 'logsclientid'],

    methods: {
        getall(date2) {
            this.$emit("logsnom", '');
            this.$emit("logsclientid", '');
            this.$emit("logsdate1", '');
            this.$emit("logsdate2", '');
        }
    }
};


</script>
  
<style >

.filterBar {
    margin-left: 1px;
    margin-right: 1px;
    background-color: #f1f1f1;
    border-radius: 6px;
    align-items: center;
    height: 60px;
    margin-top: 15px;
    position: relative;
    padding-left: 10px;
    padding-top: 8px;
    justify-content: end;
    margin-bottom: 20px;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}

.filterBar-title{
    position: absolute;
    left: 5px;
    top : 4px;
    font-size: 11px;
    letter-spacing: 0.7px;
    color: #2f3a46;
}

.filterBar-information {
    color: black;
    background-color: white;
    height: 35px;
    outline-width: 0;
    border-radius: 6px;
    border: 1px solid #E3E7E8;
    margin-top: 0;
    max-width: 300px;
    padding-left: 20px;
    margin-right: 10px;
    overflow: visible;
    padding-top: 2px;
    width: 150px;
    letter-spacing: 1.1px;
    font-size: 13px;
}


.filterBar-information-title {
    position: absolute;
    top: -10px;
    background: rgb(255, 255, 255);
    font-size: 12px;
    border-radius: 3px;
    padding-left: 10px;
    padding-right: 10px;
    right: 10px;
    border-top: 1px solid #E3E7E8;
    border-left: 1px solid #E3E7E8;
    border-right: 1px solid #E3E7E8;
    height: 14px;
    letter-spacing: 1.1px;
}

.v-picker__body {
    width: 350px !important;
}

.v-dialog {
    width: 350px !important;
}

/* .v-overlay__scrim{
    backdrop-filter: blur(5px) ;
    background-color: transparent ;
    opacity: 1 ;
} */
</style>