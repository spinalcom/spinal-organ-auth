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
  <v-card class="userListCard" elevation="4">
    <div class="addUserBtn">
      <div class="searchBar">
        <v-text-field v-model="searchQuery" label="Rechercher un utilisateur" prepend-inner-icon="mdi-magnify" clearable
          dense outlined hide-details />
      </div>

      <v-btn color="#14202C" dark large @click.native="adduser()">
        <v-icon left> mdi-plus </v-icon>
        AJOUTER UN UTILISATEUR
      </v-btn>
    </div>

    <!-- <v-data-table class="tableContent" :headers="headers" :items="searched" disable-pagination hide-default-footer> -->
    <v-data-table class="tableContent" :headers="headers" :items="filteredUserList" disable-pagination
      hide-default-footer>
      <template slot="item.platformList" slot-scope="{ item }">
        {{ item.platformList.length }}
      </template>

      <template slot="item.actions" slot-scope="{ item }">
        <div class="actions">
          <div class="btn-valider-user rounded-r-lg pr-2 hover">
            <button @click="deletebtn(item)" title="Supprimer">
              <v-icon>mdi-trash-can-outline</v-icon>
            </button>
          </div>

          <div class="btn-valider-user rounded-r-lg pr-2 hover">
            <button @click="goToEdit(item)" title="Modifier">
              <v-icon>mdi-pencil</v-icon>
            </button>
          </div>

          <div class="btn-valider-user rounded-r-lg pr-2 hover">
            <button @click="displayDetail(item)" title="Détails">
              <v-icon>mdi-arrow-right</v-icon>
            </button>
          </div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  data: () => ({
    searchQuery: "",
    headers: [
      { text: "Nom d'utilisateur", value: "userName" },
      { text: "Nombre de plateforme autorisés", value: "platformList" },
      { text: "", value: "actions", width: "200px" },
    ],
  }),
  methods: {
    ...mapActions({ deleteUser: "users/deleteUser" }),

    updateUserlist() {
      this.$store.dispatch("users/getUsers");
    },

    //Route :
    displayDetail(item) {
      this.$router.push({ name: "DetailUser", query: { id: item.id } });
    },

    adduser() {
      this.$router.push("/AddUser");
    },

    goToEdit(item) {
      this.$router.push({ name: "EditUser", query: { id: item.id } });
    },

    deletebtn(item) {
      const user = {
        id: item.id,
        name: item.userName,
      };
      this.deleteUser(user);
    },
  },
  computed: {
    ...mapGetters({ userList: "users/userList" }),
    filteredUserList() {
      if (!this.searchQuery) return this.userList;

      const query = this.searchQuery.toLowerCase().trim();
      return this.userList.filter((user) => {
        return String(user.userName || "").toLowerCase().includes(query);
      });
    },
  },

  created() {
    this.updateUserlist();
  },
};
</script>

<style scoped>
.userListCard {
  width: calc(100% - 30px);
  margin: auto;
  height: calc(100vh - 100px);
  background: transparent !important;
}

.addUserBtn {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.searchBar {
  width: 360px;
}

.tableContent {
  max-height: calc(100% - 70px);
  overflow-y: auto;
  background: transparent;
}

.btn-valider-user {
  height: 100%;
  display: flex;
  align-items: center;
  min-height: 50px;
  padding-left: 10px;
  font: normal normal normal 12px/14px Charlevoix Pro;
  letter-spacing: 1.2px;
  margin: 1px;
}

.hover:hover {
  background: rgb(228, 228, 228);
  transition: 0.3s;
}
</style>

<style>
.tableContent th {
  text-align: left;
  /* white-space: nowrap; */
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
}
</style>
