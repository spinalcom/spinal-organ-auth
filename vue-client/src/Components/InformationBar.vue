<template>
  <div class="d-flex header-bar">
    <!-- style="min-width: 800px; width: 100%" -->
    <v-card class="bar-bloc-left rounded-lg" elevation="4">
      <div class="bar-icon">
        <img :src="icon" alt="person" />
      </div>

      <div class="px-3 py-2" :class="{ total: btn === 'off' }">
        <div class="bar-title-nom mb-4">{{ title || "unknow" }}</div>
        <div v-if="title2" class="mb-4 bar-title-nom">{{ title2 }}</div>
        <div class="slotContent">
          <slot></slot>
        </div>
      </div>
    </v-card>

    <v-card v-if="btn != 'off'" class="bar-bloc-right rounded-lg" elevation="4">

      <v-btn @click.native="$emit('btn4')" title="Modifier le mot de passe" depressed dark>
        <v-icon left>
          mdi-security
        </v-icon>
        Modifier le mot de passe
      </v-btn>

      <v-btn @click.native="$emit('btn1')" title="AUTORISER UNE PLATFORME" depressed dark>
        <v-icon left>
          mdi-plus
        </v-icon>

        AUTORISER UNE PLATFORME
      </v-btn>

      <v-btn @click.native="$emit('btn2')" title="EDITER" color="warning" depressed>
        <v-icon left>
          mdi-pencil-outline
        </v-icon>
        EDITER
      </v-btn>


      <v-btn @click.native="$emit('btn3')" title="SUPPRMIER" color="error" class="mb-2" depressed>
        <v-icon left>
          mdi-close
        </v-icon>
        SUPPRMIER
      </v-btn>
    </v-card>
  </div>
</template>
<script>
import BlueButton from "./BlueButton.vue";

export default {
  name: "information-bar",
  components: {
    BlueButton,
  },
  props: ["title", "title2", "icon", "btn"],
};
</script>

<style scoped>
.header-bar {
  width: 100%;
  height: 230px;
  background: transparent;
  display: flex;
  justify-content: space-between;
}

.bar-bloc-left {
  width: 80%;
  height: 100%;
  background: transparent !important;
  display: flex;
}

.bar-bloc-right {
  width: calc(20%- 10px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: transparent !important;
  padding: 10px;
}

.bar-icon {
  width: 190px;
  height: 230px !important;
  background-color: #f7f8f8;
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 171px;
}

.bar-icon img {
  width: 100%;
  height: 100%;
}

.bar-title-section {
  height: 20px;
  letter-spacing: 0.6px;
  color: #435567;
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: 0.5px;
}

.bar-title-nom {
  height: 40px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 1.1px;
  font-weight: 100;
  font-size: 24px;
  color: #14202c;
}

.bar-sub-title {
  color: #949da6;
  font: normal normal normal 11px/13px Charlevoix Pro;
  margin-bottom: 10px;
}

.slotContent {
  width: 100%;
  height: calc(100% - 70px);
}

.px-3.py-2.total {
  width: calc(100% - 190px) !important;
}
</style>