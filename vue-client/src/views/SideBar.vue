<template>
  <v-app>
    <v-main>
      <div class="navBarItem">
        <div @click="menu2IsOpen ? menu2IsOpen = false : menu2IsOpen = true" class="navBarDropMenu">
          <div class="list"></div>
          <div class="list"></div>
          <div class="list"></div>
        </div>
        <div v-on:mouseleave="menu2IsOpen = false" v-if="menu2IsOpen" class="menu2">
          <div @click="logout" class="btn_menu2">Déconnexion</div>
        </div>
        <a href="https://www.spinalcom.com">
          <div class="navBarIcon">
            <img width="100" src="../assets/logo1.jpg" alt="">
          </div>
        </a>
        <div v-on:mouseleave="menuIsOpen = false" @click="menuIsOpen ? menuIsOpen = false : menuIsOpen = true"
          :style="menuIsOpen ? 'border : 1px solid black' : ''" class="navBarSelector">
          <span class="mt-1">
            <v-icon class="mr-2" color="black">{{ itemSelected.icon }}</v-icon>
            {{ itemSelected.name }}
          </span>
          <div class="navBarSelectorTitle">APPLICATION</div>
          <div v-if="menuIsOpen" class="navBarItemSelection">
            <div @click="gotoView(item)" v-for="(item, index) in menuList" :key="index" class="navBarItemElement">
              <v-icon class="mr-2" color="black">{{ item.icon }}</v-icon>
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>
<script>
import { mapActions } from 'vuex';
import { menuList } from "../router/microAppsRoutes";


export default {

  data() {
    return {

      menuList: [
        { name: "Toutes les applications", icon: "mdi-chart-tree", route: "", subRoutes: [] },
        ...menuList
      ],

      menuIsOpen: false,
      menu2IsOpen: false,
      itemSelected: false,
      currentRoute: ''
    };
  },
  components: {

  },
  methods: {

    gotoView(item) {
      let currentPath = this.$route.path;
      if (currentPath != "/" + item.route) {
        this.$router.push("/" + item.route);
        this.itemSelected = item;
      }
    },

    checkroute() {

      const path = this.$route.path.replace(/^\//, "");

      const found = this.menuList.find(item => {
        if (item.route.toLowerCase() == path.toLowerCase()) return true;
        const subRoute = item.subRoutes.find(subItem => subItem.toLowerCase() == path.toLowerCase());
        if (subRoute) return true;
        return false;
      });

      if (found) this.itemSelected = found;
      else this.itemSelected = this.menuList[0];

    },
    ...mapActions({
      logout: 'login/logout'
    }),
  },
  created() {
    this.checkroute();
  },
  watch: {
    $route(to, from) {
      this.checkroute()
    }
  }
}
</script>

<style scoped>
.v-application {
  position: fixed;
  z-index: 99;
  top: 0px;
}

.btn_menu2 {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid rgb(224, 224, 224);
  cursor: pointer;
  font-size: 12px;
  color: #000000;
}

.btn_menu2:hover {
  background-color: rgb(238, 238, 238);
}

.navBarItem {
  position: fixed;
  width: 432px;
  height: 65px;
  background: #FFFFFF 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 10px #49545C29;
  border: 1px solid #F7F7F7;
  border-radius: 0px 10px 10px 0px;
  opacity: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  user-select: none;
  margin-top: 10px;
}

.navBarDropMenu {
  width: 40px;
  height: 40px;
  border: 1px solid #EDF0F2;
  border-radius: 6px;
  opacity: 1;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: 0.2s;
  z-index: 99;
}


.navBarDropMenu:hover {
  background-color: #14202C;
}

.list {
  border-bottom: 1px solid rgb(197, 197, 197);
  width: 40%;
  margin-bottom: 2px;
  margin-top: 2px;
}

.navBarIcon {
  width: 92px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu2 {
  position: absolute;
  background-color: white;
  width: 150px;
  height: 180px;
  top: 13px;
  left: 10px;
  border-radius: 6px;
  border: 1px solid black;
  display: flex;
  align-items: flex-end;
  -webkit-animation: scale-in-tl 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: scale-in-tl 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@-webkit-keyframes scale-in-tl {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
}

@keyframes scale-in-tl {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    opacity: 1;
  }
}


.navBarSelector {
  width: 242px;
  height: 40px;
  border: 1px solid #EDF0F2;
  border-radius: 6px;
  opacity: 1;
  cursor: pointer;
  display: flex;
  padding-left: 10px;
  font-size: 12px;
  align-items: center;
}

@-webkit-keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
}

@keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
}


.navBarSelectorTitle {
  position: absolute;
  top: 6px;
  transform: translate(50%);
  text-align: left;
  font-size: 8px;
  letter-spacing: 0.7px;
  color: #000000;
  opacity: 1;
  background: white;
}

.navBarItemSelection {
  display: flex;
  width: 242px;
  position: absolute;
  top: 49px;
  right: 9px;
  background-color: white;
  border: solid black 1px;
  border-top: 0px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  flex-direction: column;
  user-select: none;
  -webkit-animation: scale-in-ver-top 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: scale-in-ver-top 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.navBarItemElement {
  height: 40px;
  border: 1px solid #EDF0F2;
  align-items: center;
  display: flex;
  padding-left: 10px;
  border-radius: 6px;
  font-size: 12px;
  color: #000000;
}

.navBarItemElement:hover {
  background-color: rgb(238, 238, 238);
}
</style>