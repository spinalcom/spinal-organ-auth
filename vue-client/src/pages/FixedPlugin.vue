<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
  <div class="fixed-plugin" v-click-outside="closeDropDown">
    <div class="dropdown show-dropdown" :class="{ show: isOpen }">
      <a data-toggle="dropdown">
        <i class="fa fa-cog fa-2x" @click="toggleDropDown"> </i>
      </a>
      <ul class="dropdown-menu" :class="{ show: isOpen }">
        <li class="header-title">Config Admin</li>
        <li class="adjustments-line sidebar-mini">
          <md-button
            class="md-fab-top-center md-fab-bottom-center md-fab-bottom-left"
            @click="EditProfileAdmin"
          >
            <i class="material-icons">person</i> Edit Admin
          </md-button>
          <md-button class="md-fixed" @click="logout">
            <i class="material-icons">logout</i> logout
          </md-button>
        </li>

        <li class="header-title">Sidebar Filters</li>

        <li class="adjustments-line text-center">
          <span
            v-for="item in sidebarColors"
            :key="item.color"
            class="badge filter"
            :class="[`badge-${item.color}`, { active: item.active }]"
            :data-color="item.color"
            @click="changeSidebarBackground(item)"
          >
          </span>
        </li>
        <li class="header-title">Sidebar Background</li>
        <li class="adjustments-line text-center">
          <span
            v-for="item in sidebarBg"
            :key="item.colorBg"
            class="badge filter"
            :class="[`badge-${item.colorBg}`, { active: item.active }]"
            :data-color="item.colorBg"
            @click="changeSidebarBg(item)"
          >
          </span>
        </li>
        <li class="adjustments-line sidebar-mini">
          Sidebar Mini
          <md-switch
            :value="!sidebarMini"
            @change="(val) => updateValue('sidebarMini', val)"
          ></md-switch>
        </li>
        <li class="adjustments-line sidebar-img">
          Sidebar Image
          <md-switch
            :value="!sidebarImg"
            @change="(val) => updateValueImg('sidebarImg', val)"
          ></md-switch>
        </li>

        <li class="header-title">Images</li>
        <li
          v-for="item in sidebarImages"
          :key="item.image"
          :class="{ active: item.active }"
          @click="changeSidebarImage(item)"
        >
          <a class="img-holder switch-trigger">
            <img :src="item.image" alt="" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    sidebarMini: Boolean,
    sidebarImg: Boolean
  },
  data() {
    return {
      isOpen: false,
      backgroundImage: "./img/sidebar-2.jpg",
      sidebarColors: [
        // { color: "purple", active: false },
        // { color: "azure", active: false },
        { color: "green", active: true },
        { color: "orange", active: false },
        // { color: "rose", active: false },
        { color: "danger", active: false }
      ],
      sidebarBg: [
        { colorBg: "black", active: true },
        { colorBg: "white", active: false }
      ],
      sidebarImages: [
        { image: "./img/sidebar-1.jpg", active: false },
        { image: "./img/sidebar-2.jpg", active: true },
        { image: "./img/sidebar-3.jpg", active: false },
        { image: "./img/sidebar-4.jpg", active: false }
      ]
    };
  },
  methods: {
    toggleDropDown() {
      this.isOpen = !this.isOpen;
    },
    closeDropDown() {
      this.isOpen = false;
    },
    toggleList(list, itemToActivate) {
      list.forEach(listItem => {
        listItem.active = false;
      });
      itemToActivate.active = true;
    },
    updateValue(name, val) {
      this.$emit(`update:${name}`, val);
    },
    updateValueImg(name, val) {
      this.$emit(`update:${name}`, val);

      if (this.sidebarImg) {
        document.body.classList.toggle("sidebar-image");
        this.$emit("update:image", "");
      } else {
        document.body.classList.toggle("sidebar-image");
        this.$emit("update:image", this.backgroundImage);
      }
    },
    changeSidebarBackground(item) {
      this.$emit("update:color", item.color);
      this.toggleList(this.sidebarColors, item);
    },
    changeSidebarBg(item) {
      this.$emit("update:colorBg", item.colorBg);
      this.toggleList(this.sidebarBg, item);
    },
    changeSidebarImage(item) {
      if (this.sidebarImg) {
        this.$emit("update:image", item.image);
      }
      this.backgroundImage = item.image;
      this.toggleList(this.sidebarImages, item);
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/Login");
    },
    EditProfileAdmin() {
      this.$router.push("/EditAdminProfile");
    }
  }
};
</script>
<style>
.centered-row {
  display: flex;
  height: 100%;
  align-items: center;
}

.button-container .btn {
  margin-right: 10px;
}

.centered-buttons {
  display: flex;
  justify-content: center;
}
/* .itemProfile {
  display: flex;
  align-items: center;
  justify-content: space-between;
} */
.btn {
  background-color: rgb(199, 97, 15);
  border: none;
  color: white;
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: rgb(225, 161, 65);
}
</style>
