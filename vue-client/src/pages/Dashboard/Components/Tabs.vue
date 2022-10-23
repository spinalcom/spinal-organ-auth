<template>
    <v-tabs v-model="tab" background-color="transparent" hide-slider grow>
        <v-tab v-for="item in items" :key="item">
            {{ item }}
        </v-tab>

        <v-tabs-items class="mt-6" v-model="tab">
            <slot></slot>
            
        </v-tabs-items>

    </v-tabs>
</template>
  
<script>

export default {
    name: "tabs",
    props: ['items'],
data() {
        return {
            token: null,
            user: {},
            platform: {},
            platformList: [],
            tab: null,
            
        };
    },
};

</script>
  
<style  lang="scss">

.v-application {
    background: #eeeeee00;
}

.bar-sub-title {
    color: #949DA6;
    font: normal normal normal 11px/13px Charlevoix Pro;
    margin-bottom: 10px;
}

.bar-information {
    margin-bottom: 10px;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
}

.v-tab.v-tab--active {
    background: #F9F9F9;
    text-align: left;
    border: 1px solid #214353;
    border-bottom: 0px solid #214353;
}

.v-tab {
    background: #EAEEF0;
    color: #214353;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: 1px solid #214353;
    border-left: 1px solid #F9F9F9;
    border-right: 1px solid #F9F9F9;
}

.v-window-item {
    background: #F9F9F9;
}
</style>