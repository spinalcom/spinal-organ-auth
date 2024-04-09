<template>
  <div id="app">
    <Navbar v-if="!isLoginRoute"></Navbar>
    <router-view id="content" />
  </div>
</template>

<script>
import Navbar from "./views/SideBar.vue";
export default {
  name: 'App',
  components: {
    Navbar
  },
  methods: {
    
  },
  computed: {
    isLoginRoute() {
      return this.$route.path === '/Login' ||  this.$route.path === '/login';
    },
  },

}
</script>

<style>
#app {
  overflow-x: scroll;
}

#content {
  margin-top: 80px;
  padding: 10px;
}
</style>
