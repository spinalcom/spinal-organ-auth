<template>
    <v-tabs v-model="tab" background-color="transparent" hide-slider grow>
       
        <v-tab v-for="item in items" :key="item">
            {{ item }}
        </v-tab>
       
        <v-tabs-items style="border: 1px solid black; border-top: none;border-bottom:1px solid black; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px;transform: translate(0,-1.3%);" v-model="tab">
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
  
<style >
.v-application {
    background: #eeeeee00;
}

.v-tab.v-tab--active {
    background: rgb(233, 233, 233);
    text-align: left;
    border: 1px solid #214353;
    border-bottom: 0px solid #214353;
    color: black;
}

.v-slide-group__prev {
    display: none !important;
}

.v-tab {
    background: #EAEEF0;
    color: #214353;
    font-size: 10px;
    letter-spacing: 1.1px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: 1px solid #214353;
    border-left: 1px solid #F9F9F9;
    border-right: 1px solid #F9F9F9;
    padding-right: 50px;
    height: 40px;
}

.v-window-item {
    background: #F9F9F9;
}

.v-input__slot::before {

    display: none;
}

.v-input__slot::after {
    display: none;
}

</style>