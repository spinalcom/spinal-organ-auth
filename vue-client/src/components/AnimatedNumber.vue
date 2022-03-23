<!--
Copyright 2022 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <span>{{ animatedNumber }}</span>
</template>
<script>
import TWEEN from "@tweenjs/tween.js";

export default {
  props: {
    value: {
      default: 0
    },
    duration: {
      type: Number,
      default: 800
    }
  },
  data() {
    return {
      animatedNumber: 0
    };
  },
  methods: {
    initAnimation(newValue, oldValue) {
      let vm = this;

      function animate() {
        if (TWEEN.update()) {
          requestAnimationFrame(animate);
        }
      }

      new TWEEN.Tween({ tweeningNumber: oldValue })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: newValue }, this.duration)
        .onUpdate(function(object) {
          vm.animatedNumber = object.tweeningNumber.toFixed(0);
        })
        .start();

      animate();
    }
  },
  mounted() {
    this.initAnimation(this.value, 0);
  },
  watch: {
    number(newValue, oldValue) {
      this.initAnimation(newValue, oldValue);
    },
    value(newValue, oldValue) {
      this.initAnimation(newValue, oldValue);
    }
  }
};
</script>
<style></style>
