<template>
    <v-dialog v-model="dialog" persistent class="codeUniqueDialog" width="600px !important">
        <template v-slot:activator="{ on, attrs }">
            <v-btn dark v-bind="attrs" v-on="on">
                <v-icon left>mdi-key</v-icon>
                Generer des clés uniques
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <span class="text-h5">Generer des clés uniques</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field type="number" label="Nombre de clés" required
                                v-model="data.count"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-select :items="selectItems" label="Selectionner un type de profile" v-model="profileType"
                                item-text="text" item-value="value"></v-select>
                        </v-col>

                        <v-col cols="12" class="colonne">
                            <!-- <add-platform :types="profileType" ref="appplatform" @maFonction="validateApp" /> -->
                            <add-platform :types="profileType" ref="appplatform" @change="plateformChanged" />
                        </v-col>
                    </v-row>

                    <!-- <v-row>
                        <v-col cols="6" class="colonne">
                            <div>Profile d'utilisateur</div>
                            <add-platform :types="'user'" ref="userplatform" @maFonction="validateUser" />
                        </v-col>

                        <v-col cols="6" class="colonne">
                            <div>Profile d'application</div>
                            <add-platform :types="'app'" ref="appplatform" @maFonction="validateApp" />
                        </v-col>
                    </v-row> -->

                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="cancel">
                    Annuler
                </v-btn>
                <v-btn @click="generateKey" color="success" :disabled="data.count <= 0 || data.profiles.length <= 0">
                    <v-icon>mdi-key</v-icon>
                    Generer
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

import AddPlatform from '../Components/AddPlatform.vue';
import lodash from 'lodash';

export default {
    name: 'codeUniqueDialog',
    components: {
        AddPlatform
    },
    data() {
        this.selectItems = [
            { text: 'Utilisateur', value: 'user' },
            { text: 'Application', value: 'app' }
        ]


        return {
            dialog: false,
            profileType: this.selectItems[0].value,
            data: {
                profiles: [],
                count: 1,
            }
        };
    },
    methods: {
        generateKey() {
            this.$emit('generateKey', this.data);
            this.dialog = false;
        },

        cancel() {
            this.data = {
                profiles: [],
                count: 0,
            };

            this.dialog = false;
        },

        plateformChanged(platformList) {
            this.data.profiles = platformList.map((({ platformSelected, profileSelected }) => {
                const type = profileSelected.type === "AuthServiceUserProfile" ? "user" : "app";

                return {
                    platformId: platformSelected.id,
                    ...(type === "user" && { userProfileId: profileSelected.userProfileId }),
                    ...(type === "app" && { appProfileId: profileSelected.appProfileId }),
                }
            }));
        },
    },
}
</script>

<style scoped>
/* .codeUniqueDialog {
    width: 600px !important;
    max-width: 600px !important;
} */

.colonne {
    max-height: 500px !important;
}
</style>