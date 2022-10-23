<template>
    <div>
        <label class="title-input">{{title}}</label>
        <textarea class="tarea-user" name="" id="" cols="30" rows="10"></textarea>
    </div>
</template>
  
<script>
export default {
    name: "Texarea-user",
    props: ['title']
};

</script>
  
<style>
.tarea-user {
    border-radius: 6px;
    border: 1px solid #E3E7E8;
    width: 100%;
    height: 140px;
    background: white;
}
</style>