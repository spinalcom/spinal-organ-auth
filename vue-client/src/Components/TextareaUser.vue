<template>
    <div>
        <label class="title-input">{{title}}</label>
        <textarea class="tarea-user" :value="value" @input="$emit('input', $event.target.value)" cols="30" rows="10"></textarea>
    </div>
</template>
  
<script>
export default {
    name: "Texarea-user",
    props: ['value', 'title']
};
</script>
  
<style>
.tarea-user {
    border-radius: 6px;
    border: 1px solid #E3E7E8;
    width: 100%;
    height: 140px;
    background: white;
    outline-width: 0;
    padding-left: 10px;
    padding-right: 8px;
}
</style>