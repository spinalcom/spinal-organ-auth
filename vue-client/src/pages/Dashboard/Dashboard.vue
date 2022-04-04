<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
  <div class="md-layout">
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <stats-card header-color="blue">
        <template slot="header">
          <div class="card-icon">
            <md-icon>hub</md-icon>
          </div>
          <p class="category">Platforms</p>
          <h3 class="title">
            <animated-number :value="platformNumber"></animated-number>
          </h3>
        </template>
      </stats-card>
    </div>
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <stats-card header-color="warning">
        <template slot="header">
          <div class="card-icon">
            <md-icon>upcoming</md-icon>
          </div>
          <p class="category">Alarmes</p>
          <h3 class="title">
            <animated-number :value="34"></animated-number>
          </h3>
        </template>
      </stats-card>
    </div>
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <stats-card header-color="green">
        <template slot="header">
          <div class="card-icon">
            <md-icon>generating_tokens</md-icon>
          </div>
          <p class="category">Tokens</p>
          <h3 class="title">
            <animated-number :value="tokenNumber"></animated-number>
          </h3>
        </template>
      </stats-card>
    </div>

    <div class="md-layout-item md-size-100">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>backup_table</md-icon>
          </div>
          <h4 class="title">Backup Platform Table</h4>
        </md-card-header>
        <md-card-content>
          <md-table v-model="platformList">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="#">{{ item.id }}</md-table-cell>
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="State">{{
                item.statusPlatform
              }}</md-table-cell>
              <md-table-cell md-label="Summary">
                <sparkline :indicatorStyles="spIndicatorStyles1">
                  <sparklineLine
                    :data="spData1"
                    :limit="spData1.length"
                    :styles="spLineStyles1"
                  /> </sparkline
              ></md-table-cell>
              <md-table-cell md-label="Detail" :class="getAlignClasses(item)">
                <md-button
                  class="md-just-icon"
                  :class="getClass(item.icon1, item.id)"
                  ><md-icon>arrow_forward</md-icon></md-button
                >
              </md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import { StatsCard, AnimatedNumber } from "@/components";
import axios from "axios";
const instanceAxios = require("../../services/axiosConfig");

export default {
  components: {
    StatsCard,
    AnimatedNumber
  },
  data() {
    return {
      platformNumber: 0,
      tokenNumber: 0,
      platformList: [],
      tokenList: [],
      spData1: (() => {
        const len = 50;
        return Array.from(
          {
            length: len
          },
          () => Math.floor(Math.random() * len)
        );
      })(),
      spIndicatorStyles1: false,
      spLineStyles1: {
        stroke: "#54a5ff"
      }
    };
  },
  methods: {
    async getPlatforms() {
      const rep = await instanceAxios.instanceAxios.get("/platforms", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.platformList = rep.data;
      return this.platformList;
    },
    async getTokens() {
      const rep = await instanceAxios.instanceAxios.get("/tokens", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.tokenList = rep.data;
      return this.tokenList;
    },

    getClass: function(item, id) {
      let classes = "";
      switch (item) {
        case "person": {
          classes = "md-info";
          break;
        }
        case "edit": {
          classes = "md-success";
          break;
        }
        case "close": {
          classes = "md-danger";
          break;
        }
      }
      switch (id) {
        case 1:
        case 5: {
          break;
        }
        case 2:
        case 4: {
          classes = `${classes} md-round`;
          break;
        }
        case 3: {
          classes = `${classes} md-simple`;
          break;
        }
      }
      return classes;
    },
    getAlignClasses: ({ id }) => ({
      "text-right": id
    }),
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/Login");
    }
  },
  async mounted() {
    this.token = localStorage.getItem("token");
    this.platformNumber = (await this.getPlatforms()).length;
    this.tokenNumber = (await this.getTokens()).length;
  },
  watch: {
    platformList() {
      this.platformNumber = this.platformList.length;
    }
  }
};
</script>
<style lang="scss" scoped>
.text-right .md-table-cell-container {
  display: flex;
  justify-content: flex-end;
}
.md-table .md-table-head:last-child {
  text-align: right;
}

.table-stats {
  display: flex;
  align-items: center;
  text-align: right;
  flex-flow: row wrap;

  .td-price .td-total {
    display: inline-flex;
    font-weight: 500;
    font-size: 1.0625rem;
    margin-right: 50px;
  }

  &.table-striped .td-price {
    border-bottom: 0;
  }

  .td-price {
    font-size: 26px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  .td-price,
  > div {
    flex: 0 0 100%;
    padding: 12px 8px;
  }
}

.table-shopping .md-table-head:nth-child(5),
.table-shopping .md-table-head:nth-child(7),
.table-shopping .md-table-head:nth-child(6) {
  text-align: right;
}
</style>
