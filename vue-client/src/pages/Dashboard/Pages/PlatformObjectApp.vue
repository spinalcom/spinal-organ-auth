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
  <div class="chips">
    <md-chip md-static class="chipBos">{{ value.name }}</md-chip>
    <md-chip md-static class="md-accent chipProfile">{{
      showProfileApp()
    }}</md-chip>
  </div>
</template>

<script>
const instanceAxios = require("../../../services/axiosConfig");
export default {
  name: "PlatformObjectApp",
  props: ["token", "platformId", "app"],
  data: () => ({
    value: ""
  }),
  async created() {
    const repPlatform = await instanceAxios.instanceAxios.get(
      `/platforms/${this.platformId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      }
    );
    this.value = repPlatform.data;
  },

  methods: {
    showProfileApp() {
      for (const platform of this.app.platformList) {
        if (this.platformId === platform.platformId) {
          return platform.appProfile.name;
        }
      }
    }
  }
};
</script>

<style>
.chips {
  display: flex;
  flex-direction: row;
}
.chipBos {
  width: auto;
  background-color: #53ac57 !important;
}
.chipProfile {
  width: auto;
  background-color: #ff9800 !important;
}

.md-chip {
  line-height: 21px;
  color: #ffffff !important;
  margin-top: 7 px;
}
</style>