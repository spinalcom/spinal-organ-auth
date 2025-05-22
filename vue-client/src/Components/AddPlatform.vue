<template>
    <div class="authorizePlatform">
        <div class="userAccess">

            <div class="accessheader">
                <div>Autoriser l'accès aux plateformes</div>
                <div>
                    <v-btn @click="addPlatform" outlined>
                        <v-icon>mdi-plus</v-icon>
                        AJOUTER UNE PLATFORME
                    </v-btn>
                </div>
            </div>

            <div class="platContainer">
                <div v-for="(item, index) in platformToSelect" :key="item" class="ajout-platform" :id="index">
                    <div class="selector">
                        <SelectUser :id="index" class="platform" @select="setItemProfileList(item, index)"
                            :tab="platformList" v-model="item.platformSelected" title="PLATFORM"
                            :value="item.platformSelected" />

                        <SelectUser :id="index" class="profilut" :tab="item.profiles" v-model="item.profileSelected"
                            @select="sendChangeEvent" :value="item.profileSelected" title="PROFIL" />
                    </div>
                    <button v-if="index > 0" @click="deletePlatformObjectitemapp(item, index)" type="button"
                        class="red-cross">X</button>
                </div>
            </div>
        </div>


        <!-- <div v-if="types == 'user'" class="userAccess">
            <div class="accessheader">
                <div>Autoriser l'accès aux plateformes</div>
                <div>
                    <v-btn @click="addplatform()" outlined>
                        <v-icon>mdi-plus</v-icon>
                        AJOUTER UNE PLATFORME
                    </v-btn>
                </div>
            </div>

            <div class="platContainer">
                <div v-for="(item, index) in nbPlatform" :key="item" class="ajout-platform"
                    :style="disableobjet[index] ? disableobjet[index].plat == true ? 'background : #e6f3ed' : '' : ''"
                    :id="index">
                    <div @click="setplatform()" class="selector">
                        <SelectUser :id=index class="platform" @select="getuserfromplatform" :tab="platformList"
                            v-model="formPlatformObject.platform" title="PLATFORM"
                            :disabled="disableobjet[index] ? disableobjet[index].plat == true ? true : false : false" />
                        <SelectUser :id=index class="profilut"
                            :disabled="disableobjet[index] ? disableobjet[index].plat == true ? true : false : false"
                            :tab="userProfileList" v-model="formPlatformObject.userProfileValue"
                            title="PROFIL UTILISATEUR" />
                    </div>
                    <button @click="deletePlatformObjectitem(index)" type="button" class="red-cross">X</button>
                </div>
            </div>

        </div>

        <div v-if="types == 'app'" class="userAccess">

            <div class="accessheader">
                <div>Autoriser l'accès aux plateformes</div>
                <div>
                    <v-btn @click="addplatformapp()" outlined>
                        <v-icon>mdi-plus</v-icon>
                        AJOUTER UNE PLATFORME
                    </v-btn>
                </div>
            </div>

            <div class="platContainer">
                <div v-for="(item, index) in nbPlatform" :key="item" class="ajout-platform"
                    :style="disableobjet[index].plat == true ? 'background : #e6f3ed' : ''" :id="index">
                    <div class="selector">
                        <SelectUser :id=index class="platform" @select="getAppProfileList()" :tab="platformList"
                            v-model="formPlatformObjectapp.platform" title="PLATFORM"
                            :disabled="disableobjet[index] ? disableobjet[index].plat == true ? true : false : false" />
                        <SelectUser :id=index class="profilut"
                            :disabled="disableobjet[index] ? disableobjet[index].plat == true ? true : false : false"
                            :tab="appProfileList" v-model="formPlatformObjectapp.appProfileValue"
                            title="PROFIL APPLICATION" />
                    </div>
                    <button @click="deletePlatformObjectitemapp(index)" type="button" class="red-cross">X</button>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
import SelectUser from "../Components/SelectUser.vue";
import { mapActions, mapGetters } from "vuex";
export default {
    name: "add-platform",
    components: {
        SelectUser,
    },
    props: ['types', 'tab', 'sendplatform'],
    data() {
        return {
            platformToSelect: [this._getNewPlatform()],

            /*
            platformsend: [],
            nbPlatform: 1,
            formPlatformObject: {
                platform: [],
                userProfileValue: [],
                plat: [],
            },
            formPlatformObjectapp: {
                platform: [],
                appProfileValue: []
            },
            userProfileList: [],
            appProfileList: [],
            disableobjet: [
                {
                    plat: false,
                }
            ],
            userList: [],
            platformObjectList: [],
            */
        };
    },
    methods: {
        ...mapActions({
            lafonction: 'users/lafonction',
            lafonctionapp: 'applications/lafonctionapp'
        }),

        getDataFromStore() {
            this.$store.dispatch('users/getplatformList');
        },

        addPlatform() {
            this.platformToSelect = [...this.platformToSelect, this._getNewPlatform()];
        },

        _getNewPlatform() {
            return {
                profiles: [],
                platformSelected: null,
                profileSelected: null,
            }
        },

        getProfileList(platformId) {
            if (this.types == 'user') {
                return this.getuserProfiles(platformId);
            } else if (this.types == 'app') {
                return this.getAppProfileList(platformId);
            }

            return [];
        },


        async getuserProfiles(platformId) {
            return this.$store.dispatch('users/getUserProfileList', platformId);
        },


        async getAppProfileList(platformId) {
            return this.$store.dispatch('applications/getAppProfileList', platformId);
        },


        async setItemProfileList(item, index) {

            let firstIndex = this.platformToSelect.findIndex((el) => el.platformSelected.id === item.platformSelected.id);
            if (firstIndex !== -1 && firstIndex !== index) {
                // Si la plateforme est déjà sélectionnée dans un autre élément
                alert("vous ne pouvez pas sélectionner la même plateforme deux fois");
                item.platformSelected = null;
                item.profileSelected = null;
                return;
            }
            const platformId = item.platformSelected.id;
            item.profiles = await this.getProfileList(platformId);
            item.profileSelected = null;
        },

        deletePlatformObjectitemapp(item, index) {
            this.platformToSelect = this.platformToSelect.slice(0, index).concat(this.platformToSelect.slice(index + 1));
            this.sendChangeEvent(); // Emit the change event after deletion;
        },


        sendChangeEvent() {
            const data = this.platformToSelect.filter((item) => item.platformSelected && item.profileSelected);
            this.$emit("change", data);
        },


        /*detailPlatform(tab) {
            if (this.types == 'user') {
                this.nbPlatform = tab.length
            } else {

            }
        },

        async maFonction() {
            if (this.types == "user") {
                if (this.formPlatformObject.platform.name != undefined && this.formPlatformObject.userProfileValue.name != undefined) {
                    this.addplatform();
                }
            } else if (this.types == "app") {
                if (this.formPlatformObjectapp.platform.name != undefined && this.formPlatformObjectapp.appProfileValue.name != undefined) {
                    this.addplatformapp();
                }
            }
        },
        


        addplatform() {

            var test = true;
            var plat = true;




            for (const platformObject of this.platformObjectList) {
                if (platformObject.platformId === this.formPlatformObject.platform.id) {//verification unicité
                    alert("you cannot select platform even twice");
                    this.formPlatformObject.platform = [];
                    this.formPlatformObject.userProfileValue = [];
                    test = false;
                    plat = false;
                    this.nbPlatform--;
                    this.disableobjet.splice(-1, 1);
                }
            }
            if (test === true && this.formPlatformObject.platform.name != undefined) {
                this.platformObjectList.push({
                    platformId: this.formPlatformObject.platform.id,
                    platformName: this.formPlatformObject.platform.name,
                    userProfile: {
                        name: this.formPlatformObject.userProfileValue.name,
                        userProfileId: this.formPlatformObject.userProfileValue
                            .userProfileId
                    }
                });
                this.formPlatformObject.platform = [];
                this.formPlatformObject.userProfileValue = [];
            }

            if (this.platformObjectList.length > 0) {
                this.platformObjectList.forEach((element, index) => {
                    if (element.userProfile.userProfileId == undefined) {
                        alert("platform vide");
                        // this.nbPlatform--;
                        //  this.disableobjet.splice(-1, 1);
                        test = false;
                        plat = false;
                        this.platformObjectList.splice(index, 1); // Supprimer l'élément
                        return;
                    }
                });
            }
            if (plat == true) {
                this.nbPlatform++;
                this.disableobjet[this.disableobjet.length - 1].plat = true;
                this.disableobjet.push({
                    plat: false,
                })
            }
            this.lafonction(this.platformObjectList);




            // } else {
            //     alert("Merci de compléter la platform")
            //     this.nbPlatform--;
            //     this.disableobjet.splice(-1, 1);
            //     this.nbPlatform++;

            // }

        },


        addplatformapp() {
            // if (this.formPlatformObjectapp.appProfileValue.appProfileId) {
            var test = true;
            var plat = true;





            //if this.platformObjectList est superieur a 0 et tant que this.platformObjectList.toutlesobjet si this.platformObjectList.appprofil.appprofilID == undefined alerte vous ne pouvez pas ajouter de platformvide supprime l element en question


            for (const platformObject of this.platformObjectList) {
                if (platformObject.platformId === this.formPlatformObjectapp.platform.id) {
                    alert("you cannot select platform even twice");
                    this.formPlatformObjectapp.platform = [];
                    this.formPlatformObjectapp.appProfileValue = [];
                    test = false;
                    plat = false;
                    this.nbPlatform--;
                    this.disableobjet.splice(-1, 1);
                }
            }
            if (test === true && this.formPlatformObjectapp.platform.name != undefined) {
                this.platformObjectList.push({
                    platformId: this.formPlatformObjectapp.platform.id,
                    platformName: this.formPlatformObjectapp.platform.name,
                    appProfile: {
                        name: this.formPlatformObjectapp.appProfileValue.name,
                        appProfileId: this.formPlatformObjectapp.appProfileValue.appProfileId
                    }
                });
                this.formPlatformObjectapp.platform = [];
                this.formPlatformObjectapp.appProfileValue = [];
            }
            if (this.platformObjectList.length > 0) {
                this.platformObjectList.forEach((element, index) => {
                    if (element.appProfile.appProfileId == undefined) {
                        alert("platform vide");
                        // this.nbPlatform--;
                        //  this.disableobjet.splice(-1, 1);
                        test = false;
                        plat = false;
                        this.platformObjectList.splice(index, 1); // Supprimer l'élément
                        return;
                    }
                });
            }

            if (plat == true) {
                this.nbPlatform++;
                this.disableobjet[this.disableobjet.length - 1].plat = true;
                this.disableobjet.push({
                    plat: false,
                })
            }




            this.lafonctionapp(this.platformObjectList);




            // } else {
            //     alert("Merci de compléter le profile de la plateforme")
            //     this.nbPlatform--;
            //     this.disableobjet.splice(-1, 1); //erreur
            //     // this.platformObjectList.splice(-1, 1);
            //     // console.log(this.disableobjet);

            //     this.nbPlatform++;  
            // }
        },

        deletePlatformObjectitem(index) {
            document.getElementById(index).style.display = "none";
            this.platformObjectList.splice(index, 1);
            this.disableobjet[index].plat = false;
            this.formPlatformObject.platform = [];
            this.formPlatformObject.userProfileValue = null;
        },

        deletePlatformObjectitemapp(index) {
            // console.log(this.platformObjectList);
            document.getElementById(index).style.display = "none";
            this.platformObjectList.splice(index, 1);
            this.disableobjet[index].plat = false;
            this.formPlatformObjectapp.platform = [];
            this.formPlatformObjectapp.userProfileValue = null;
        },

        async getuserfromplatform() {
            var id = this.formPlatformObject.platform.id
            this.userProfileList = await this.$store.dispatch('users/getUserProfileList', id);
        },


        async getAppProfileList() {
            var id = this.formPlatformObjectapp.platform.id
            this.appProfileList = await this.$store.dispatch('applications/getAppProfileList', id);
        },

        


        setplatform() {
            // console.log("laa");
            // console.log(this.sendplatform);
            // console.log(this.formPlatformObject);
            // this.sendplatform.forEach(element => {
            //     this.formPlatformObject.platform.id = element.platformId;
            //     this.formPlatformObject.platform.name = element.platformName;
            //     this.formPlatformObject.userProfileValue.name = element.userProfile.userProfileName;
            //     this.formPlatformObject.userProfileValue.userProfileId = element.userProfile.userProfileAdminId;
            //     console.log("1");
            //     console.log(this.formPlatformObject);
            //     console.log("2");
            //     // this.addplatform();
            // });
            // this.nbPlatform = this.sendplatform.length
            // formPlatformObject.platform = 
            // console.log("laa");
            // this.nbPlatform = this.sendplatform.length

        }*/
    },
    computed: {
        ...mapGetters({
            platformList: 'users/platformList',
        }),

    },
    mounted() {
        this.getDataFromStore();
        // this.setplatform();
    },

    watch: {
        types: function () {
            this.platformToSelect = [this._getNewPlatform()];
        },
        // "formPlatformObject.userProfileValue": function (newVal) {
        //     this.$emit("change", this.platformObjectList);
        // },
        // "formPlatformObjectapp.appProfileValue": function (newVal) {
        //     this.$emit("change", this.platformObjectList);
        // }
    }


};
</script>

<style>
.authorizePlatform {
    width: 100%;
    height: 100%;
}

.authorizePlatform .userAccess {
    width: 100%;
    height: 100%;
}

.authorizePlatform .userAccess .accessheader {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.authorizePlatform .userAccess .platContainer {
    width: 100%;
    height: calc(100% - 50px);
    overflow-y: auto;
}


.platform {
    z-index: 99;
}

.ajout-platform {
    margin-top: 20px;
    background: #EAEEF0;
    border-radius: 10px;
    display: flex;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    -webkit-animation: slide-in-fwd-center 0.7s cubic-beplatform_copieier(0.250, 0.460, 0.450, 0.940) both;
    animation: slide-in-fwd-center 0.7s cubic-beplatform_copieier(0.250, 0.460, 0.450, 0.940) both;
}

@-webkit-keyframes slide-in-fwd-center {
    0% {
        -webkit-transform: translateplatform_copie(-1400px);
        transform: translateplatform_copie(-1400px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateplatform_copie(0);
        transform: translateplatform_copie(0);
        opacity: 1;
    }
}

@keyframes slide-in-fwd-center {
    0% {
        -webkit-transform: translateplatform_copie(-1400px);
        transform: translateplatform_copie(-1400px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateplatform_copie(0);
        transform: translateplatform_copie(0);
        opacity: 1;
    }
}

.btn-ajout-platform {
    border: 0px;
    height: 40px;
    margin-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 6px;
    background: #EAEEF0;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
}

.red-cross {
    margin-top: 22px;
    margin-left: 10px;
    border-radius: 10px;
    height: 42px;
    width: 45px;
    color: orangered;
    border: 1px solid orangered;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-siplatform_copiee: 15px;
    padding-top: 2px;
    transition: 0.2s;
}

.red-cross:hover {
    background: #EF5F32;
    color: #ffffff;
    border: 1px solid #ffffff;
}

.selector {
    position: relative;
    width: 100%;
}

.btn-ajout-platform {
    border: 0px;
    height: 40px;
    margin-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 6px;
    background: #ebf0ea;
    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: 1.3px;
    transition: 0.2s;
}

.btn-ajout-platform:hover {
    background-color: rgb(189, 189, 189);
}
</style>