<template>
    <v-card elevation="4" outlined class="cardContainer">
        <div class="header">
            <code-unique-dialog :data="data" @generateKey="generateKey"></code-unique-dialog>
        </div>
        <div class="table">

            <div class="tableHeader">
                <div>
                    <h2>Codes Uniques</h2>
                </div>

                <div>
                    <v-text-field v-model="textSearched" append-icon="mdi-magnify" outlined label="Search" clearable
                        dense hide-details></v-text-field>
                </div>
            </div>

            <v-data-table :headers="headers" :items="codesDisplayed" :search="textSearched" class="datatable"
                hide-default-footer>

                <template v-slot:item.used="{ item }">
                    <v-chip class="ma-2" :color="getColor(item.used)" outlined>
                        <v-avatar left>
                            <v-icon>{{ item.used ? 'mdi-check' : "mdi-minus" }}</v-icon>
                        </v-avatar>
                        {{ item.used ? 'utilisé' : 'Non utilisé' }}
                    </v-chip>
                </template>


                <template v-slot:item.createdAt="{ item }">
                    {{ formatDate(item.createdAt) }}
                </template>


                <template v-slot:item.usedAt="{ item }">
                    {{ formatDate(item.usedAt) }}
                </template>


                <template v-slot:item.actions="{ item }">
                    <div class="actions">
                        <v-btn icon @click="deleteCode(item)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </div>
    </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import codeUniqueDialog from '../Components/codeUniqueDialog.vue';

export default {
    components: {
        codeUniqueDialog
    },
    data() {
        this.headers = [
            { class: 'headerCell', text: 'Code', value: 'code' },
            { class: 'headerCell', text: 'Date de creation', value: 'createdAt' },
            { class: 'headerCell', text: 'Utilisation', value: 'used' },
            { class: 'headerCell', text: 'Date d\'utilisation', value: 'usedAt' },
            { class: 'headerCell', text: '', value: 'actions' }
        ];

        return {
            data: {
                profiles: [],
                count: 0,
            },

            textSearched: '',
            codesDisplayed: [],
        };
    },
    async mounted() {
        await this.getAllCode();
        console.log(this.codes);
    },
    methods: {
        ...mapActions('codeUnique', ['getAllCode', 'generateCode', 'getCode', 'removeCode', 'removeCodes']),

        async generateKey(data) {
            await this.generateCode(data);
        },

        deleteCode(item) {
            const yes = confirm(`Voulez-vous vraiment supprimer le code ${item.code} ?`);
            if (yes) this.removeCode(item.id);
        },

        deleteCodes(codes) {
            const yes = confirm(`Voulez-vous vraiment supprimer le code ${codes.length} items ?`);
            if (yes) this.removeCodes(codes);
        },

        getColor(used) {
            console.log("used", used);
            return used ? 'green' : 'red';
        },

        formatDate(date) {
            if (date == -1 || !date) return "-";

            return new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        },
    },

    computed: {
        ...mapGetters('codeUnique', ['codes', 'codeById']),
    },
    watch: {
        codes: {
            handler(newVal) {
                this.codesDisplayed = newVal;
            },
            immediate: true,
        },
    },
}
</script>

<style>
.cardContainer {
    margin: 20px;
    width: calc(100% - 40px);
    height: calc(100vh - 100px);
    background: transparent !important;
}

.cardContainer .header {
    height: 70px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}

.cardContainer .table {
    height: calc(100% - 70px);
    border-radius: 0 0 10px 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.headerCell {
    text-align: left !important;
}

.cardContainer .table .datatable {
    background: transparent !important;
}

.tableHeader {
    width: 100%;
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
</style>