<template>
    <v-card class="d-flex flex-column rounded-lg backup-bar" color="#F7F7F7" elevation="2">
        <span class="title-backupbar">BACKUP PLATFORM APPLICATION TABLE</span>
        <div class="d-flex mt-2 mb-2">
            <div style="width: 20%;" class="d-flex flex-column">
                <span class="subtitle-backbar">Nom de la platforme</span>
                <div class="information-backup-bar">Bos 3 étage 23</div>
            </div>
            <div style="width: 15%;" class="d-flex flex-column ">
                <span class="subtitle-backbar">Access</span>
                <div class="information-backup-bar">
                    <button>OFFLINE</button>
                </div>
            </div>
            <div style="width: 65%;" class="d-flex flex-column ">
                <span class="subtitle-backbar">Access</span>
                <div class="information-backup-bar">test</div>
            </div>
        </div>
    </v-card>
</template>
  
<script>

export default {
    name: "backup-bar",

};

</script>
  
<style  >
.backup-bar {
    margin-top: 10px;
    padding: 10px;
}

.title-backupbar {
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
    margin-bottom: 10px;
}

.subtitle-backbar {
    font: normal normal normal 10px/12px Charlevoix Pro;
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
</style>