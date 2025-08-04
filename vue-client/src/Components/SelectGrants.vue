<template>
  <div class="custom-select">
    <label class="title-input">{{ title }}</label>
    <div class="select-container">
      <div class="select-trigger" @click="toggleOptions">
        {{ selectedValue.join(", ") }}
        <span class="arrow" :class="{ 'arrow-rotate': rotateArrow }"></span>
      </div>
      <div class="options" v-show="showOptions">
        <div v-for="(item, index) in tab" :key="index" class="option"
          :class="{ selected: selectedValue.includes(item.value) }" @click="selectItem(item.value)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "select-user",
  props: ["title", "value", "disabled"],
  data() {
    this.tab = [
      { value: "client_credentials", name: "client_credentials" },
      { value: "password", name: "password" },
      { value: "refresh_token", name: "refresh_token" },
      { value: "authorization_code", name: "authorization_code" },
    ];
    return {
      selectedValue: [],
      showOptions: false,
      rotateArrow: false, // Ajout de la propriété rotateArrow
    };
  },
  watch: {
    tab: function (newValue, oldValue) {
      // Réinitialiser la selectedValue lorsque tab change
      this.selectedValue = [];
    },
    value: function (newValue, oldValue) {
      this.selectedValue = newValue;
    },
  },
  methods: {
    selectItem(item) {
      const isAreadySelected = this.selectedValue.includes(item);

      if (isAreadySelected) {
        this.selectedValue = this.selectedValue.filter((value) => value !== item);
      } else {
        this.selectedValue = [...this.selectedValue, item];
      }
      // this.selectedValue = item;
      this.$emit("input", this.selectedValue);
      this.$emit("select", this.selectedValue); // émettre l'événement 'select'
      // this.showOptions = false;

    },

    toggleOptions() {
      if (!this.isDisabled) {
        this.showOptions = !this.showOptions;
        this.rotateArrow = !this.rotateArrow;
      }
    },
  },
  computed: {
    isDisabled() {
      return this.disabled ? true : false;
    },
  },
};
</script>


<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  user-select: none;
  /* z-index: 99; */
}

.select-container {
  border: 1px solid #000;
  position: relative;
  border-radius: 6px;
}

.select-trigger {
  position: relative;
  padding: 8px 32px 8px 12px;
  border-radius: 6px;
  border: 1px solid #e3e7e8;
  width: 100%;
  height: 40px;
  background: white;
  cursor: pointer;
}

/* .select-trigger:focus,
.select-trigger:hover {
  border-color: #14202C;
} */

.arrow {
  position: absolute;
  top: 40%;
  right: 15px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-top: 1px solid #14202c;
  border-right: 1px solid #14202c;
  transform: rotate(45deg);
  transition: 0.2s;
}

.options {
  max-height: 200px;
  top: 100%;
  left: 0;
  right: 0;
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: 2.1px;
  position: absolute;
  border: 1px solid #e3e7e8;
  border: 1px solid #000;
  padding: 5px 0;
  background: white;
  /* z-index: 1; */
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 99;
}

.option {
  padding: 8px 12px;
  margin-bottom: 2px;
  cursor: pointer;
  z-index: 999999;
}

.option.selected {
  background-color: #2196f3 !important;
}

.option:hover {
  background-color: #f4f4f4;
}

.option.selected {
  background-color: #f4f4f4;
}

.options.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-10px);
}

.options.visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.custom-select.disabled .select-trigger {
  background-color: #f4f4f4;
  color: #b9b9b9;
  cursor: not-allowed;
}

.custom-select.disabled .arrow {
  border-color: #b9b9b9;
}

.custom-select.disabled .option:hover {
  background-color: transparent;
  cursor: not-allowed;
  color: #b9b9b9;
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

.arrow-rotate {
  transform: rotate(135deg);
}
</style>