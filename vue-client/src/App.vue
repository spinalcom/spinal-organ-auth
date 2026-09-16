<template>
  <div id="app">
    <div
      v-if="isRouteLoading"
      class="pageLoader"
      role="status"
      aria-live="polite"
    >
      <div class="loaderCard">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
    </div>

    <Navbar v-if="!isLoginRoute"></Navbar>
    <router-view class="content" :class="{ auth: isLoginRoute }" />

    <v-snackbar
      v-model="popup.visible"
      :color="popup.color"
      :timeout="popup.timeout"
      top
      right
    >
      {{ popup.message }}
    </v-snackbar>

    <v-dialog v-model="confirmPopup.visible" max-width="520" persistent>
      <v-card>
        <v-card-title class="headline">{{ confirmPopup.title }}</v-card-title>
        <v-card-text>{{ confirmPopup.message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="resolveConfirmation(false)">
            {{ confirmPopup.cancelText }}
          </v-btn>
          <v-btn color="red darken-1" text @click="resolveConfirmation(true)">
            {{ confirmPopup.confirmText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Navbar from "./views/SideBar.vue";
import { routeLoadingState } from "./router";
import { POPUP_EVENT_NAME, CONFIRM_EVENT_NAME } from "./services/popup";

export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      popup: {
        visible: false,
        message: "",
        color: "error",
        timeout: 4000,
      },
      confirmPopup: {
        visible: false,
        title: "Confirmation",
        message: "",
        confirmText: "Confirmer",
        cancelText: "Annuler",
        resolve: null,
      },
    };
  },
  methods: {
    onPopupEvent(event) {
      const detail = event && event.detail ? event.detail : {};
      this.popup.message = detail.message || "Une erreur est survenue.";
      this.popup.color = detail.color || "error";
      this.popup.timeout = detail.timeout || 4000;
      this.popup.visible = false;

      this.$nextTick(() => {
        this.popup.visible = true;
      });
    },
    onConfirmEvent(event) {
      const detail = event && event.detail ? event.detail : {};
      this.confirmPopup.title = detail.title || "Confirmation";
      this.confirmPopup.message = detail.message || "Voulez-vous continuer ?";
      this.confirmPopup.confirmText = detail.confirmText || "Confirmer";
      this.confirmPopup.cancelText = detail.cancelText || "Annuler";
      this.confirmPopup.resolve =
        typeof detail.resolve === "function" ? detail.resolve : null;
      this.confirmPopup.visible = true;
    },
    resolveConfirmation(value) {
      const resolver = this.confirmPopup.resolve;
      this.confirmPopup.visible = false;
      this.confirmPopup.resolve = null;

      if (resolver) resolver(value);
    },
  },
  computed: {
    isLoginRoute() {
      return (
        this.$route.path === "/Login" ||
        this.$route.path === "/login" ||
        this.$route.path.toLowerCase().includes("/authorize")
      );
    },
    isRouteLoading() {
      return routeLoadingState.isLoading;
    },
  },
  mounted() {
    window.addEventListener(POPUP_EVENT_NAME, this.onPopupEvent);
    window.addEventListener(CONFIRM_EVENT_NAME, this.onConfirmEvent);
  },
  beforeDestroy() {
    window.removeEventListener(POPUP_EVENT_NAME, this.onPopupEvent);
    window.removeEventListener(CONFIRM_EVENT_NAME, this.onConfirmEvent);
  },
};
</script>

<style>
#app .content {
  margin-top: 80px;
  padding: 10px;
}

.content.auth {
  margin: 0 !important;
  padding: 10px;
}

.pageLoader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loaderCard {
  min-width: 180px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 24px;
}

.loaderCard p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.loaderSpinner {
  width: 34px;
  height: 34px;
  border: 4px solid #d6d6d6;
  border-top-color: #1976d2;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
