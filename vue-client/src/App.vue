<template>
  <div id="app">
    <Navbar v-if="!isLoginRoute"></Navbar>
    <router-view id="content" />
  </div>
</template>

<script>
import Navbar from "./views/SideBar.vue";
export default {
  name: "App",
  components: {
    Navbar,
  },
  methods: {},
  computed: {
    isLoginRoute() {
      return (
        this.$route.path === "/Login" ||
        this.$route.path === "/login" ||
        this.$route.path.toLowerCase().includes("/authorize")
      );
    },
  },
};
</script>

<style>
#app {
  /* width: 100vw;
  height: 100vh; */
  overflow-x: scroll;
}

.content {
  margin-top: 80px;
  padding: 10px;
}

.content.auth {
  margin: 0 !important;
  padding: 10px;
}
</style>
