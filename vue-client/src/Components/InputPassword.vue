<template>
  <div>
    <label class="title-input">{{ title }}</label>
    <div class="d-flex">
      <input
        :readonly="readonly"
        :required="required"
        :value="value"
        :type="show3 ? 'text' : 'password'"
        @input="$emit('input', $event.target.value)"
        class="input-user"
      />

      <div class="btn-eye" v-if="generate" @click="generatePassword">
        <v-icon style="color: white"> mdi-autorenew </v-icon>
      </div>

      <div class="btn-eye" @click="show3 = !show3">
        <v-icon style="color: white">{{
          show3 ? "mdi-eye-outline" : "mdi-eye-off-outline"
        }}</v-icon>
      </div>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "input-pass",
  props: ["value", "title", "readonly", "required", "generate"],
  data() {
    return {
      show3: false,
    };
  },
  methods: {
    generatePassword() {
      this.$emit("generate");
    },
  },
};
</script>

<style >
.input-user {
  border-radius: 6px;
  border: 1px solid #e3e7e8;
  width: 100%;
  height: 40px;
  background: #ffffff;
  padding-left: 10px;
  outline-width: 0;
}

.title-input {
  position: relative;
  top: 9px;
  margin-left: 5px;
  /* font: normal normal normal 10px/8px Charlevoix Pro; */
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9px;
  letter-spacing: 2.1px;
  color: #000000;
}

.btn-eye {
  border-radius: 7px;
  background: #14202c;
  padding: 8px;
  position: relative;
  right: 2px;
  cursor: pointer;
}
</style>