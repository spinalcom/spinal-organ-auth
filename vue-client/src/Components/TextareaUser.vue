<template>
    <div>
        <label class="title-input">{{ title }}</label>
        <textarea class="tarea-user" :value="value" @input="$emit('input', $event.target.value)" cols="30"
            rows="10"></textarea>
    </div>
</template>

<script>
export default {
    name: "Texarea-user",
    props: ['value', 'title']
};
</script>

<style scoped>
.tarea-user {
    border-radius: 6px;
    border: 1px solid #000;
    width: 100%;
    height: 140px;
    background: white;
    outline-width: 0;
    padding: 10px;
    /* padding-left: 10px; */
    /* padding-right: 8px; */
}

.title-input {
    user-select: none;
    position: relative;
    top: 9px;
    margin-left: 15px;
    padding: 0 5px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    letter-spacing: 2.1px;
    color: #000000;
    background-color: #fff !important;
    border-radius: 5px;
}
</style>