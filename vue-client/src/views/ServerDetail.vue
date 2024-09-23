<template>
    <v-app>
        <v-main v-if="server">
            <InformationBar :btn="'off'" v-on:btn2="goToEditPage()" v-on:btn3="deleteServer()"
                title="INFORMATION DU SERVEUR" :title2="server.name"
                :icon="require('../assets/image/server-security.svg')" class="header-bar">
                <div class="d-flex platform-information-bar">
                    <div class="d-flex bar-bloc-left" style="width: 89%">

                        <div class="detailItems d-flex flex-column mr-16">
                            <span class="bar-sub-title">Methode de connexion </span>
                            <span class="bar-information">{{ server.authentication_method }}</span>
                        </div>

                        <div class="detailItems d-flex flex-column mr-16">
                            <span class="bar-sub-title">url de connexion</span>
                            <span class="bar-information">{{ (server.authentication_info &&
                                (server.authentication_info.entryPoint ||
                                    server.authentication_info.endpoint)) || "Local" }}</span>
                        </div>

                        <div class="detailItems d-flex flex-column mr-16">
                            <span class="bar-sub-title">url de retour (callback)</span>
                            <span class="bar-information">{{ (server.authentication_info &&
                                server.authentication_info.callback) || "" }}</span>
                        </div>


                        <!-- <div style="max-width: 500px" class="d-flex flex-column mr-16">
              <span class="bar-sub-title">TOKEN</span>
              <span class="bar-information">{{
                this.platform.TokenBosAdmin
              }}</span>
            </div> -->
                    </div>

                    <div class="d-flex flex-column bar-bloc-right justify-center" style="width: 10%; height: 100%"
                        v-if="server.authentication_method !== 'local'">
                        <!-- class="d-flex align-center pl-1 blue-btn" -->
                        <button tile class="d-flex align-center pl-1 blue-btn" color="success" @click="goToEditPage">
                            <v-icon class="mx-1" dark>mdi-pencil-outline</v-icon>
                            <span style="width: 56%">EDITER</span>
                        </button>

                        <button tile class="d-flex align-center pl-1 red-btn" color="red" @click="deleteServer">
                            <v-icon class="mx-1" color="orange darken-2" dark>mdi-close</v-icon>
                            <span style="width: 56%">SUPPRIMER</span>
                        </button>
                    </div>
                </div>
            </InformationBar>
        </v-main>
    </v-app>
</template>

<script>
import InformationBar from "../Components/InformationBar.vue";
import StatutButton from "../Components/StatutButton.vue";
import BackupInformation from "../Components/BackupInformation.vue";

import { mapActions } from "vuex";
import { title } from "process";

export default {
    name: "ServerDetail",
    components: {
        InformationBar,
        StatutButton,
        BackupInformation
    },
    data() {
        return {
            server: null
        }
    },
    async created() {
        const serverId = this.$route.query.id;
        this.server = await this.getServerById(serverId);
        console.log(this.server);
    },
    methods: {
        ...mapActions({
            getServerById: "serverLogin/getServerById",
            deleteServerReq: "serverLogin/deleteServer"
        }),

        goToEditPage() {
            this.$router.push({ name: "EditServer", query: { id: this.server.id } });
        },

        async deleteServer() {
            const confirmation = confirm(`voulez-vous supprimer "${item.name}" ?`);
            if (confirmation) {
                await this.deleteServerReq(item.id);
            }
        }
    }
}
</script>

<style scoped>
.detailItems {
    max-width: 250px;
}

.detailItems .bar-information {
    text-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>