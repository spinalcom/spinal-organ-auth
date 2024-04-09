<template>
    <div>
        <label class="title-input">{{ title }}</label>
        <select v-model="selectedValue" @change="selectItem()" class="input-user" type="text" :disabled="disabled">
            <option></option>
            <option v-for="item in tab" :key="item.tab">
                {{ item.name }}
            </option>
        </select>
    </div>
</template>
  
<script>
export default {
    name: "select-user",
    props: ['tab', 'title', 'value','disabled'],
    data() {
        return {
            selectedValue: '',
        }
    },
    methods: {
        selectItem() {
            let selectedItem = this.tab.find(item => item.name === this.selectedValue)
            this.$emit("input", selectedItem)
        }
    }
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
    z-index: 9;
    position: relative;
    top: 9px;
    margin-left: 5px;
    /* font: normal normal normal 10px/8px Charlevoix Pro; */
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9px;
    letter-spacing: 2.1px;
    color: #14202C;
}
</style>