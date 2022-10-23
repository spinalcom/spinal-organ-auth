<template>
    <div class="d-flex">
        <v-card class="d-flex bar-bloc-left rounded-lg" elevation="2">
            <div class="bar-icon">
                <v-icon style="color: black;" size="100">{{icon}}</v-icon>
            </div>
            <div style="width: 100%;" class="px-3 py-2">
                <div class="bar-title-section mb-2">{{title}}</div>
                <div class="mb-4 bar-title-nom">{{title2}}</div>
                <slot></slot>
            </div>
        </v-card>
        <v-card class="d-flex flex-column ml-2 pt-2 pb-2 bar-bloc-right justify-center rounded-lg" elevation="2">
            <!-- <BlueButton @click.native="$emit('btn1')" :icon="'mdi-plus'" title="AJOUTER À PLATFORME" :val="'blue'"/> -->
            <BlueButton @click.native="$emit('btn2')" :icon="'mdi-pencil-outline'" title="EDITER" :val="'blue'" />
            <BlueButton @click.native="$emit('btn3')" :icon="'mdi-close'" title="SUPPRMIER" :val="'red'" class="mb-2" />
        </v-card>
    </div>
</template>
  
<script>
import BlueButton from "./BlueButton.vue"

export default {
    name: "information-bar",
    components: {
        BlueButton
    },
    props: ['title', 'title2', 'icon'],
   
};

</script>
  
<style >
.main-panel{
    background: transparent linear-gradient(121deg, #F8FAFA 0%, #D6E2E6 100%) 0% 0% no-repeat padding-box;
}

.bar-bloc-left {
    width: 87%;
}

.bar-bloc-right {
    width: 13%;
}

.bar-icon {
    height: 100%;
    width: 22%;
    background-color: #F7F8F8;
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.bar-title-section {
    font: normal normal normal 12px/14px Charlevoix Pro;
    letter-spacing: 0.6px;
    color: #435567;
}

.bar-title-nom {
    font: normal normal normal 23px/28px Charlevoix Pro;
    letter-spacing: 1.1px;
}

.bar-sub-title {
    color: #949DA6;
    font: normal normal normal 11px/13px Charlevoix Pro;
    margin-bottom: 10px;
}
</style>