<template >
    <div class="d-flex justify-center">
        <button tile v-if="val.toUpperCase() == 'BLUE'" class=" d-flex align-center justify-start pl-1 blue-btn" color="success">
            <v-icon style="margin-left: 5px; margin-right:5px" dark>{{icon}}</v-icon>
            <span style="width: 100%;">{{title}}</span>
        </button>

        <button tile v-if="val.toUpperCase() == 'RED'" class=" d-flex align-center justify-start pl-1 red-btn"  color="success">
            <v-icon style="margin-left: 5px; margin-right:5px" color="orange darken-2" dark>{{icon}}</v-icon>
            <span style="width: 100%;">{{title}}</span>
        </button>
    </div>
</template>
  
<script>

export default {
    name: "blue-button",
    props: ['icon', 'title' ,'val'],
};

</script>
  
<style >
.blue-btn {
    margin: 5px;
    height: 40px;
    border-radius: 6px;
    width: 85%;
    word-wrap: break-word;
    font: normal normal normal 11px/13px Charlevoix Pro;
    letter-spacing: 1.1px;
    background: #14202C;
    color: white;
}

.red-btn {
    margin: 7px;
    height: 40px;
    border-radius: 6px;
    width: 85%;
    word-wrap: break-word;
    font: normal normal normal 11px/13px Charlevoix Pro;
    color: #EF5F32;
    border: 1px solid #EF5F32;
}

</style>