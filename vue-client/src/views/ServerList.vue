<template>
    <div class="div_content">
        <div class="header">
            <v-card class="creationCard" elevation="2">
                <BlueButton @click.native="goToCreationPage()" :icon="'mdi-plus'" title="AJOUTER UN SERVEUR"
                    :val="'blue'" />
            </v-card>
        </div>

        <v-card class="serverListContent d-flex flex-column rounded-lg backup-bar" color="#F7F7F7" elevation="4">

            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="subtitle-backbar">Nom</th>
                            <th class="subtitle-backbar">Type de serveur</th>
                            <th class="subtitle-backbar">methode d'authentification</th>
                            <th class="subtitle-backbar"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in servers" :key="item.id">

                            <td class="btn-valider-user rounded-l-lg">
                                {{ item.name }}
                            </td>

                            <td class="btn-valider-user">
                                {{ item.type | formatType }}
                            </td>

                            <td class="btn-valider-user">
                                {{ item.authentication_method }}
                            </td>

                            <td class="actions">
                                <!-- <div class="btn-valider-user action_btn">
                                    <button @click="deleteServer(item)">
                                        <v-icon>mdi-trash-can-outline</v-icon>
                                    </button>
                                </div>

                                <div class="btn-valider-user action_btn">
                                    <button @click="displayDetail(item)">
                                        <v-icon>mdi-arrow-right</v-icon>
                                    </button>
                                </div> -->

                                <v-btn icon @click="deleteServer(item)" title="supprimer" v-if="isNotLocalServer(item)">
                                    <v-icon>mdi-trash-can-outline</v-icon>
                                </v-btn>

                                <v-btn icon @click="editServer(item)" title="modifier" v-if="isNotLocalServer(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>

                                <v-btn icon @click="displayDetail(item)" title="voir le detail">
                                    <v-icon>mdi-arrow-right</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

            <!--
            <div class="d-flex mt-2">
                <div class="sub-division">
                    <span class="subtitle-backbar">Nom</span>
                </div>

                <div class="sub-division">
                    <span class="subtitle-backbar">Type de serveur</span>
                </div>

                <div class="sub-division">
                    <span class="subtitle-backbar">methode d'authentification</span>
                </div>

                <div class="sub-division">
                    <span class="subtitle-backbar"></span>
                </div>
            </div>
            
        <div v-for="item in servers" :key="item.id">
                <div class="d-flex mb-2">
                    <div class="d-flex flex-column serverColumn ">
                        <div class="btn-valider-user rounded-l-lg">
                            {{ item.name }}
                        </div>
                    </div>

                    <div class="d-flex flex-column serverColumn">
                        <div class="btn-valider-user">
                            <span>{{ item.type | formatType }}</span>
                        </div>
                    </div>

                    <div class="d-flex flex-column serverColumn">
                        <div class="btn-valider-user">
                            <span>{{ item.authentication_method }}</span>
                        </div>
                    </div>

                    <div class="d-flex serverColumn actions">
                        <div class="btn-valider-user rounded-r-lg pr-2 hover">
                            <button @click="deleteServer(item)">
                                <v-icon>mdi-trash-can-outline</v-icon>
                            </button>
                        </div>

                        <div class="btn-valider-user rounded-r-lg pr-2 hover">
                            <button @click="displayDetail(item)">
                                <v-icon>mdi-arrow-right</v-icon>
                            </button>
                        </div>
                    </div>

                </div>
            </div>    

-->

        </v-card>
    </div>
</template>

<script>

import { mapActions, mapGetters } from "vuex";
import BlueButton from "../Components/BlueButton.vue";

export default {
    name: "ServerList",
    components: {
        BlueButton
    },
    data() {
        return {}
    },
    async mounted() {
        await this.getAllServers();
    },
    filters: {
        formatType(val) {
            switch (val) {
                case "INTERNAL_SERVER":
                    return "Serveur Interne";

                case "EXTERNAL_SERVER":
                    return "Serveur Externe";
            }
        }
    },
    methods: {
        ...mapActions({
            getAllServers: "serverLogin/getAllServers",
            deleteServerReq: "serverLogin/deleteServer",
        }),
        goToCreationPage() {
            this.$router.push({ name: "AddServer" });
        },

        async deleteServer(item) {
            const confirmation = confirm(`voulez-vous supprimer "${item.name}" ?`);
            if (confirmation) {
                await this.deleteServerReq(item.id);
            }
        },

        displayDetail(item) {
            this.$router.push({ name: "ServerDetail", query: { id: item.id } });
        },

        editServer(item) {
            this.$router.push({ name: "EditServer", query: { id: item.id } });
        },

        isNotLocalServer(item) {
            return item.type !== "INTERNAL_SERVER";
        }
    },
    computed: {
        ...mapGetters({ servers: "serverLogin/servers" })
    }
}
</script>

<style scoped>
.div_content {
    width: 100%;
    height: calc(100vh - 100px) !important;
}

.div_content .header {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: flex-end;
}

.div_content .header .creationCard {
    height: 60px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.serverListContent {
    width: 100%;
    height: calc(100% - 70px);
    background-color: transparent !important;
}

.subtitle-backbar {
    text-align: justify;
}

.actions {
    display: flex;
    justify-content: flex-end;
}

.actions .action_btn {
    width: 50px;
}
</style>