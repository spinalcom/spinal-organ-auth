<template>
    <v-card class="d-flex flex-column rounded-lg backup-bar" color="#F7F7F7" elevation="2">
        <span class="title-backupbar mb-6">{{title}}</span>
        <div class="d-flex mb-3">
            <span style="width:25%">{{subtitle1}}</span>
            <span>{{subtitle2}}</span>
        </div>
        <!-- debut item  -->
        <slot></slot>
        <!-- FIN ITEM  -->
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