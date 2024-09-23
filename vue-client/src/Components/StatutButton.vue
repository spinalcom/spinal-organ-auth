<template >
  <div class="d-flex justify-center">
    <div
      v-if="val.toUpperCase() == 'CONNECTED'"
      tile
      class="d-flex align-center justify-start pl-1"
      :class="'online-btn'"
    >
      <v-icon size="13" dark>mdi-check</v-icon>
      <span class="ml-2">{{ title }}</span>
    </div>

    <div
      v-else-if="val.toUpperCase() == 'NOT CONNECTED'"
      tile
      class="d-flex align-center justify-start pl-1"
      :class="'offline-btn'"
    >
      <v-icon size="13" dark>mdi-close</v-icon>
      <span class="ml-2">{{ title }}</span>
    </div>

    <div
      v-else
      tile
      class="d-flex align-center justify-start pl-1"
      :class="'danger-btn'"
    >
      <v-icon size="13" dark>mdi-close</v-icon>
      <span class="ml-2">{{ title }}</span>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "statut-button",
  props: ["icon", "title", "val"],
};
</script>
  
<style >
.online-btn {
  background: #3fa57a;
  font: normal normal normal 12px/14px Charlevoix Pro;
  letter-spacing: 1.2px;
  color: white;
  border-radius: 10px;
  width: 90px;
  height: 28px;
}

.offline-btn {
  background: #f44336;
  font: normal normal normal 12px/14px Charlevoix Pro;
  letter-spacing: 1.2px;
  color: white;
  border-radius: 10px;
  width: 90px;
  height: 28px;
}

.danger-btn {
  background: #f39b37;
  font: normal normal normal 12px/14px Charlevoix Pro;
  letter-spacing: 1.2px;
  color: white;
  border-radius: 10px;
  width: 90px;
  height: 28px;
}
</style>