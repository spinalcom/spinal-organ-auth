<template>
  <div>
    <label class="title-input">{{ title }}</label>
    <input :readonly="readonly" :value="value" @input="$emit('input', $event.target.value)" class="input-user" type="text">
  </div>
</template>

<script>
export default {
  name: "input-user",
  props: ['value', 'title', 'readonly']
};

</script>

<style>
.input-user {
  user-select: none;
  border-radius: 6px;
  border: 1px solid #E3E7E8;
  width: 100%;
  height: 40px;
  background: #ffffff;
  padding-left: 10px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  letter-spacing: 2.1px;
  outline-width: 0;
}

.title-input {
  user-select: none;
  position: relative;
  top: 9px;
  margin-left: 5px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9px;
  letter-spacing: 2.1px;
  color: #000000;
  background-color: rgba(253, 253, 253, 0.658);
  border-radius: 5px;
}
</style>