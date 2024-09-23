<template>
  <div class="custom-select">
    <label class="title-input">{{ title }}</label>
    <div class="select-container">
      <div class="select-trigger" @click="toggleOptions">
        {{ selectedValue ? selectedValue.name : '' }}
        <span class="arrow" :class="{ 'arrow-rotate': rotateArrow }"></span>
      </div>
      <div class="options" v-show="showOptions">
        <div v-for="(item, index) in tab" :key="index" class="option" @click="selectItem(item)">
          {{ item.name || item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "select-platform-connection",
  props: ['tab', 'title', 'value', 'disabled', 'default_value', 'edit'],
  data() {
    return {
      selectedValue: null,
      showOptions: false,
      rotateArrow: false // Ajout de la propriété rotateArrow
    }
  },
  mounted() {
    if (this.edit) {
      this.selectedValue = this.default_value;
      return;
    }

    // this.selectItem(this.default_value);
  },
  watch: {
    tab: function (newValue, oldValue) {
      // Réinitialiser la selectedValue lorsque tab change
      this.selectedValue = null;
    }
  },
  methods: {
    selectItem(item) {
      this.selectedValue = item;
      this.$emit("input", item.value)
      this.$emit("select", item.value) // émettre l'événement 'select'
      this.showOptions = false
    },

    toggleOptions() {
      if (!this.isDisabled) {
        this.showOptions = !this.showOptions
        this.rotateArrow = !this.rotateArrow;
      }
    }
  },

  computed: {
    isDisabled() {
      return this.disabled ? true : false
    }
  },
  watch: {
    default_value() {
      this.selectedValue = this.default_value;
    }
  }
};
</script>


<style>
.custom-select {
  position: relative;
  width: 100%;
  user-select: none;
}

.select-container {
  position: relative;
}

.select-trigger {
  position: relative;
  padding: 8px 32px 8px 12px;
  border-radius: 6px;
  border: 1px solid #E3E7E8;
  width: 100%;
  height: 40px;
  background: white;
  cursor: pointer;
}

.select-trigger:focus,
/* .select-trigger:hover {
  border-color: #14202C;
} */

.arrow {
  position: absolute;
  top: 40%;
  right: 15px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-top: 1px solid #14202C;
  border-right: 1px solid #14202C;
  transform: rotate(45deg);
  transition: 0.2s;
}

.options {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  letter-spacing: 2.1px;
  z-index: 99;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border-radius: 6px;
  border: 1px solid #E3E7E8;
  background: white;
  overflow: hidden;
  z-index: 1;
  max-height: 200px;
  transition: all 0.3s ease;
}

.option {
  padding: 8px 12px;
  cursor: pointer;
}

.option:hover {
  background-color: #F4F4F4;
}

.option.selected {
  background-color: #F4F4F4;
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
  background-color: #F4F4F4;
  color: #B9B9B9;
  cursor: not-allowed;
}

.custom-select.disabled .arrow {
  border-color: #B9B9B9;
}

.custom-select.disabled .option:hover {
  background-color: transparent;
  cursor: not-allowed;
  color: #B9B9B9;
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
  z-index: 1;
}

.arrow-rotate {
  transform: rotate(135deg);
}
</style>