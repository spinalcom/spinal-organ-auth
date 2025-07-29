<template>
  <v-app>
    <v-main class="ml-12">
      <div>
        <div class="d-flex">
          <div style="min-width: 325px;">
            <v-icon style="color: black" class="input-icon">mdi-magnify</v-icon>
            <input v-model="filtersData.search" class="input-menu" placeholder="rechercher" type="text">
          </div>
          <!-- <div style="min-width: 500px;">
            <v-icon style="color: black" class="input-icon">mdi-chevron-down</v-icon>
            <select class="input-select">
              <option class="option-Select-Menu" value="">Toutes les catégories</option>
              <option class="option-Select-Menu" value="">Toutes les catégories</option>
            </select>
          </div> -->
        </div>
      </div>
      <div class="mt-5">
        <span class="admin-title">ADMINISTRATION</span>
        <div class="menu-card">
          <div class="menu-title">
            <hr class="line-division">
            CONFIGURATION
          </div>
          <div class="menu-administraton">
            <hr style="min-width: 1100px;" class="line-division">
            <div class="container-cardmenu">

              <CardMenu v-for="item in menuList" :key="item.name" :icon="item.icon" :verif="filtersData.search"
                :link="item.route" :title="item.name" :subtitle="item.subtitle">
              </CardMenu>

              <!--
              <CardMenu :icon="'mdi-shield-crown'" :verif="filtersData.search" :link="'platformsList'"
                :title="'PLATEFORMES'" :subtitle="'Configuration des Plateformes'">
              </CardMenu>

               <CardMenu :icon="'mdi-view-list'" :verif="filtersData.search" :link="'LogsList'" :title="'LOGS'"
                :subtitle="'Connexions et utilisations du logiciel'"></CardMenu>

              <CardMenu :icon="'mdi-account'" :verif="filtersData.search" :link="'usersList'" :title="'UTILISATEURS'"
                :subtitle="'Gestion des utilisateurs'">
              </CardMenu>

              <CardMenu :icon="'mdi-apps'" :verif="filtersData.search" :link="'Application'" :title="'APPLICATIONS'"
                :subtitle="'Gestion des applications'"></CardMenu>

              <CardMenu :icon="'mdi-server-security'" :verif="filtersData.search" :link="'Servers'"
                :title="'SERVEUR D\'AUTHENTIFICATION'" :subtitle="'Gestion de serveur d\'authentification'"></CardMenu>

              <CardMenu :icon="'mdi-key'" :verif="filtersData.search" :link="'CodeUnique'" :title="'CLÉS UNIQUE'"
                :subtitle="'Gestion de clés uniques'"></CardMenu> -->
            </div>
          </div>
        </div>
        <div class="menu-card">
          <div class="menu-title">
            <hr class="line-division">
            CRÉATION
          </div>
          <div class="menu-administraton">
            <hr style="min-width: 1100px;" class="line-division">
            <div class="container-cardmenu">
              <CardMenu :icon="'mdi-account'" :verif="filtersData.search" :link="'AddUser'"
                :title="'AJOUTER UN UTILISATEUR'" :subtitle="'Créer un utilisateur'"></CardMenu>

              <CardMenu :icon="'mdi-apps'" :verif="filtersData.search" :link="'AddApp'"
                :title="'AJOUTER UNE APPLICATION'" :subtitle="'Créer une application'"></CardMenu>

              <CardMenu :icon="'mdi-server-security'" :verif="filtersData.search" :link="'AddServer'"
                :title="'AJOUTER UN SERVER D\'AUTHENTIFICATION'" :subtitle="'Créer un serveur d\'authentification'">
              </CardMenu>
            </div>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import CardMenu from "../Components/CardMenu";
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
import { menuList } from "../router/microAppsRoutes";
export default {
  components: {
    CardMenu,
  },
  data: () => ({
    filtersData: {
      search: "",
    },
    menuList: menuList,
  }),
  computed: {
    ...mapState({
      data: state => state.module.data
    })

  },
  methods: {
    ...mapActions({
      fetchData: 'module/fetchData',
      getToken: 'login/getToken'
    }),

  },
  mounted() {
    this.getToken();
  }
}
</script>

<style scoped>
.v-application {
  background-color: #d6e2e600;
}

.input-icon {
  background-color: white;
  height: 40px;
  background: #FFFFFF 0% 0% no-repeat padding-box;
  border: 1px solid #F0F0F0;
  border-right: 0px;
  left: 5px;
  z-index: 1;
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
  padding: 5px;
}

.information-menu {
  text-align: left;
  font-size: 14px;
  letter-spacing: 0px;
  margin-top: 10px;
}

.input-menu {
  background: #FFFFFF 0% 0% no-repeat padding-box;
  border: 1px solid #F0F0F0;
  border-bottom-right-radius: 6px;
  border-top-right-radius: 6px;
  height: 40px;
  padding-left: 10px;
  font: normal normal normal 13px/13px Charlevoix Pro;
  letter-spacing: 0.88px;
  padding-right: 100px;
  outline-width: 0;
}

.input-select {
  background: #FFFFFF 0% 0% no-repeat padding-box;
  border: 1px solid #F0F0F0;
  border-bottom-right-radius: 6px;
  border-top-right-radius: 6px;
  height: 40px;
  margin-right: 10px;
  padding-left: 10px;
  position: relative;
  bottom: 1px;
  font: normal normal normal 11px/13px Charlevoix Pro;
  letter-spacing: 0.88px;
  padding-right: 20px;
  outline-width: 0;
}

.admin-title {
  letter-spacing: 2.2px;
  color: #9BBCC4;
  margin-left: 100px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 1000;
  font-size: 10px;
}

.menu-card {
  display: flex;
}

.container-cardmenu {
  position: relative;
  width: 100%;
  min-height: 100px;
  display: flex !important;
  flex-wrap: wrap;
}

.menu-administraton {
  margin-left: 6px;
  text-align: left;
  width: 90%;
}

.menu-title {
  letter-spacing: 1.7px;
  color: #6AA0AD;
  opacity: 1;
  color: #6AA0AD;
  min-width: 91px;
  width: 91px;
  font-size: 7px;
  font-weight: 900;
}

.option-Select-Menu {
  font-size: 15px;
}

hr.line-division {
  border-top: 1px solid #6AA0AD;
}
</style>