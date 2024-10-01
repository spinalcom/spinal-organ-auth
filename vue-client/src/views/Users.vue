<!--
Copyright 2023 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <v-app class="app">

    <div class="d-flex justify-end" style="width: 100%; min-width: 980px">
      <v-card class="
          d-flex
          flex-column
          ml-2
          pl-1
          pt-1
          pb-1
          pr-1
          justify-center
          rounded-lg
        " elevation="2">
        <BlueButton @click.native="adduser()" :icon="'mdi-plus'" title="AJOUTER UN UTILISATEUR" :val="'blue'" />
      </v-card>
    </div>
    <BackupInformation @click.native="showapplist()" title="TABLES DES UTILISATEURS">
      <div class="d-flex mb-2 mt-4">
        <div style="width: 22%">Nom d'utilisateur</div>
        <div style="width: 78%">État</div>
      </div>
      <div v-for="item in this.userList" :key="item.id">

        <div class="d-flex mb-2">
          <div style="width: 22%" class="content-list rounded-l-lg pl-10">
            {{ item.userName }}
          </div>
          <div style="width: 78%" class="content-list">
            <div v-for="(platform, index) in item.platformList"  class="stateButton-container">
              <StateButton :obj="'bos'" :content1="item.platformList[index].platformName" :content2="''" :icon="'mdi-chip'" />
              <StateButton :obj="'app'" :content1="item.platformList[index].userProfile.userProfileName" :content2="''" :icon="'mdi-apps'" />
            </div>
          </div>
          <div class="content-list rounded-r-lg hover">
            <button class="pr-2" style="height: 100%" @click="deleteUser(item)">
              <v-icon>mdi-delete-outline</v-icon>
            </button>
          </div>

          <div class="content-list rounded-r-lg hover">
            <button class="pr-2" style="height: 100%" @click="goToEditUser(item)">
              <v-icon>mdi-pencil</v-icon>
            </button>
          </div>

           <div class="content-list rounded-r-lg hover">
            <button class="pr-2" style="height: 100%" @click="displayDetail(item)">
              <v-icon>mdi-arrow-right</v-icon>
            </button>
          </div>
        </div>
      </div>
    </BackupInformation>
  </v-app>
</template>

<script>
import BlueButton from "../Components/BlueButton.vue";
import BackupInformation from "../Components/BackupInformation.vue";
import StateButton from "../Components/StateButton.vue";
import { mapActions, mapGetters } from "vuex";


export default {
  name: "App",
  components: {
    BlueButton,
    BackupInformation,
    StateButton
  },
  data: () => ({
    display: false,
    token: "",
  }),
  methods: {
    ...mapActions({ deleteUserFunc: "users/deleteUser" }),
    showapplist(){
      console.log(this.userList);
    },

    updateUserlist() {
      this.$store.dispatch('users/getUsers')
    },

    //Route : 
    displayDetail(item) {
      this.$router.push({ name: "DetailUser", query: { id: item.id } });
    },

    adduser() {
      this.$router.push("/AddUser");
    },

    goToEditUser(item) {
      this.$router.push({
        name: "EditUser",
        query: { id: item.id },
      });
    },

    deleteUser(item) {
      var user = {
        id: item.id,
        name: item.userName,
      };
      
      this.deleteUserFunc(user);
    },

  },
  computed: {
    ...mapGetters({ userList: 'users/userList' }),
  },

  created() {
    this.updateUserlist()
  }
};
</script>

<style scoped>
.app {
  font: normal normal normal 10px/12px Charlevoix Pro;
  letter-spacing: 1px;
  background: #eeeeee00;
}

.content-list {
  border: 1px solid rgba(216, 216, 216, 0.623);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  min-height: 50px;
  padding-left: 10px;
  font: normal normal normal 12px/14px Charlevoix Pro;
  letter-spacing: 1.2px;
  margin: 1px;
  flex-wrap: wrap;
}

.hover:hover {
  background: rgb(228, 228, 228);
  transition: 0.3s;
}

.stateButton-container {
  width: 100%;
  display: flex;
}
</style>
