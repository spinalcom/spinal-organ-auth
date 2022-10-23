<template>
  <div>
    <label class="title-input">{{title}}</label>
    <div style="display:flex ; ">
      <input :value="value" :type="show3 ? 'text' : 'password' " @input="$emit('input', $event.target.value)" class="input-user" />
      <button class="btn-eye" @click="show3 = !show3">
        <v-icon style="color: white;">{{show3 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'}}</v-icon>
      </button>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "input-pass",
  props: ['value', 'title'],
  data() {
    return {
      show3: false,
    }
  },
  methods: {
    lameth() {
      console.log("coucou");
    }
  }

};

</script>
  
<style >
.input-user {
  border-radius: 6px;
  border: 1px solid #E3E7E8;
  width: 100%;
  height: 40px;
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

.btn-eye {
  border-radius: 7px;
  background: #14202C;
  padding: 8px;
  position: relative;
  right: 2px;

}
</style>