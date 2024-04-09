<template >
    <div class="parent d-flex justify-center">
        <div v-if="obj == 'bos'" class="d-flex align-center pl-1" :class="'state-btn-bos'">
            <v-icon dark>{{  icon  }}</v-icon>
            <span>{{  content1  }}</span>
            <span>{{content2}}</span>
        </div>
        <div v-if="obj == 'app'" class="d-flex align-center pl-1" :class="'state-btn-app'">
            <v-icon dark>{{  icon  }}</v-icon>
            <span>{{  content1  }}</span>
            <span>{{  content2  }}</span>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "state-button",
    props: ['obj', 'icon', 'content1', 'content2'],
};

</script>
  
<style >
.state-btn-bos {
    background: #14202C;
    font: normal normal normal 13px/15px Charlevoix Pro;
    letter-spacing: 1.2px;
    color: white;
    border-radius: 3px;
    height: 28px;
    padding-right: 50px;
    gap: 5px;
    /* margin-left: 5px;
    margin-right: 5px; */
    /* margin-top: 15px;
    margin-bottom: 15px; */
    width: 200px;
}

.parent{
    /* max-height: 50px; */
    padding: 8px;
}
.state-btn-app {
    background: #516376;
    font: normal normal normal 12px/14px Charlevoix Pro;
    letter-spacing: 1.2px;
    color: white;
    border-radius: 3px;
    height: 28px;
    padding-right: 50px;
    gap: 5px;
    /* margin-top: 15px;
    margin-bottom: 15px; */
    /* margin-left: 5px; */
    width: 250px;
}
</style>