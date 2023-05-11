<template>
    <div class="d-flex">
        <v-card style="min-width:800px; width: 100%;" class="d-flex bar-bloc-left rounded-lg" elevation="2">
            <div class="bar-icon">
                <img width="100" height="100" :src="icon" alt="" />
            </div>
            <div class="px-3 py-2">
                <div class="bar-title-section mb-1">{{ title }}</div>
                <div class="mb-4 bar-title-nom">{{ title2 }}</div>
                <slot></slot>
            </div>
        </v-card>

        <v-card v-if="btn != 'off'" class="d-flex flex-column ml-2 pt-2 pb-2 bar-bloc-right justify-center rounded-lg" elevation="2">
            <BlueButton @click.native="$emit('btn1')" :icon="'mdi-plus'" title="AJOUTER À PLATFORME" :val="'blue'" />
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
    props: ['title', 'title2', 'icon', 'btn'],
};
</script>
  
<style >
.bar-bloc-left {
    width: 87%;
    min-height: 171px;
    height: 171px;

}

.bar-bloc-right {
    width: 171px;
    min-width: 171px;
    height: 171px;
}

.bar-icon {
    min-width: 190px;
    height: 100%;
    width: 190px;
    background-color: #F7F8F8;
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 171px;
}

.bar-title-section {
    letter-spacing: 0.6px;
    color: #435567;
    font-size: 12px;
    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: 0.5px;
}

.bar-title-nom {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    letter-spacing: 1.1px;
    font-weight: 100;
    font-size: 24px;
    color: #14202C;
}

.bar-sub-title {
    color: #949DA6;
    font: normal normal normal 11px/13px Charlevoix Pro;
    margin-bottom: 10px;
}
</style>