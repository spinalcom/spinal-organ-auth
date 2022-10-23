<template>
  <div>
    <label class="title-input">{{title}}</label>
    <input autocomplete="false" :value="value" @input="$emit('input', $event.target.value)" class="input-user" type="text">
  </div>
</template>

<script>
export default {
  name: "input-user",
  props: ['value', 'title']
};

</script>

<style >
.input-user {
  border-radius: 6px;
  border: 1px solid #E3E7E8;
  width: 100%;
  height: 40px ;
  background: #ffffff;
  padding-left: 10px;
}


.title-input {
  position: relative;
  top: 9px;
  margin-left: 5px;
  font: normal normal normal 10px/8px Charlevoix Pro;
  letter-spacing: 2.1px;
  color: #000000;

}
</style>