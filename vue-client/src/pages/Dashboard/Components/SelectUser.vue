<template>
      <div>
        <label class="title-input">{{title}}</label>
        <select class="input-user" type="text">
            <option></option>
            <option v-for="item in test"  :key="item.test">
                {{ item.name }}
            </option>
        </select>
    </div>
</template>
  
<script>
export default {
    name: "select-user",
    props: ['test','title'],
};

</script>
  
<style>
.input-user {
    border-radius: 6px;
    border: 1px solid #E3E7E8;
    width: 100%;
    height: 40px;
    background: white;
}

.title-input {
    position: relative;
    top: 9px;
    margin-left: 5px;
    font: normal normal normal 10px/8px Charlevoix Pro;
    letter-spacing: 2.1px;
    color: #14202C;
}
</style>