<template>
    <div class="d-flex justify-center">
        <button tile v-if="val.toUpperCase() == 'BLUE'" class=" d-flex align-center justify-start pl-1 blue-btn"
            color="success">
            <v-icon class="mx-1" dark>{{ icon }}</v-icon>
            <span style="width: 56%;">{{ title }}</span>
        </button>
        <button tile v-if="val.toUpperCase() == 'RED'" class=" d-flex align-center justify-start pl-1 red-btn"
            color="success">
            <v-icon class="mx-1" color="orange darken-2" dark>{{ icon }}</v-icon>
            <span style="width: 56%;">{{ title }}</span>
        </button>
    </div>
</template>

<script>
export default {
    name: "blue-button",
    props: ['icon', 'title', 'val'],
};
</script>
  
<style >
.blue-btn {
    margin: 5px;
    min-width: 153px;
    width: 153px;
    height: 40px;
    border-radius: 6px;
    word-wrap: break-word;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
    letter-spacing: 1.1px;
    background: #14202C;
    color: white;
    
}

.red-btn {
    margin: 7px;
    height: 40px;
    border-radius: 6px;
    min-width: 153px;
    word-wrap: break-word;
    color: #EF5F32;
    border: 1px solid #EF5F32;
    font-size: 10px;
    font-family: Arial, Helvetica, sans-serif;
}

.red-btn:hover{
    background: rgb(245, 245, 245);
}
</style>