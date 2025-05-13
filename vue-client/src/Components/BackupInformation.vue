<template>
  <v-card class="d-flex flex-column rounded-lg backup-bar" color="#F7F7F7" elevation="2">
    <div class="header">
      <div class="title-backupbar">{{ title }}</div>
      <div class="subtitle-backupbar" v-if="subtitle1">{{ subtitle1 }}</div>
      <div class="subtitle-backupbar" v-if="subtitle1">{{ subtitle2 }}</div>
    </div>

    <div class="slotContainer">
      <slot></slot>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "backup-information",
  props: ['title', 'subtitle1', 'subtitle2'],
};
</script>

<style>
.backup-bar {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  height: calc(100vh - 180px);
  /* min-width: 980px; */
  /* max-height: 800px; */
  /* max-height: 80vh; */
  overflow-y: auto;
}

.header {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header .title-backupbar {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 2em;
  /* font-size: 11px; */
  letter-spacing: 1.1px;
  color: #214353;
  margin-top: 5px;
  text-transform: capitalize;
}

.header .subtitle-backbar {
  /* font: normal normal normal 10px/12px Charlevoix Pro; */
  font-size: 1em;
  letter-spacing: 1px;
}

.information-backup-bar {
  background: rgb(255, 255, 255);
  margin: 5px;
  margin-left: 1px;
  margin-right: 1px;
  padding: 20px;
  font: normal normal normal 9px/11px Charlevoix Pro;
  letter-spacing: 0.9px;

}

.slotContainer {
  width: 100%;
  height: calc(100% - 60px);
}



/*
* Custom scrollbar styles
*/

.backup-bar::-webkit-scrollbar {
  width: 10px;
}

.backup-bar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(206, 206, 206);
  border-radius: 4px;
}

.backup-bar::-webkit-scrollbar-thumb {
  background: rgba(133, 133, 133, 0.281);
  border: 1px solid rgba(0, 82, 48, 0.212);
  border-radius: 4px;
}

.backup-bar::-webkit-scrollbar-thumb:hover {
  background: rgba(29, 29, 29, 0.281);
}
</style>