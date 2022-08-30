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
  <div class="md-layout">
    <div class="md-layout-item md-size-95 mt-4 md-small-size-100">
      <div class="md-layout-item md-size-100">
        <md-card>
          <div>
            <div :ref="chart.uuid"></div>
          </div>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
              <md-icon>backup_table</md-icon>
            </div>
            <h4 class="title">Backup Log Table</h4>
          </md-card-header>
          <md-card-content>
            <md-table v-model="logList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Name">{{ item.id }}</md-table-cell>
                <md-table-cell md-label="Event Type">{{
                  item.parentsInfo.Gparent.name
                }}</md-table-cell>
                <md-table-cell md-label="Date">{{
                  getDate(item.date)
                }}</md-table-cell>
                <md-table-cell md-label="ActorName">{{
                  item.actor.actorName
                }}</md-table-cell>
                <md-table-cell md-label="ActorId">{{
                  item.actor.actorId
                }}</md-table-cell>
                <md-table-cell md-label="Result">{{
                  item.message
                }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
const instanceAxios = require("../../../services/axiosConfig");
var Plotly = require("plotly.js");
export default {
  components: {},
  name: "Logs",
  data: () => ({
    token: "",
    value: null,
    logList: [],
    logPostion: {},
    chart: {
      uuid: "123",
      traces: [
        {
          x: ["1", "2", "3"],
          y: [],
          name: "Users",
          type: "bar"
        },
        {
          x: ["1", "2", "3"],
          y: [],
          name: "Applications",
          type: "bar"
        },
        {
          x: ["1", "2", "3"],
          y: [],
          name: "Platforms",
          type: "bar"
        }
      ],
      layout: { barmode: "stack" }
    },
    platformsLogs: []
  }),

  computed: {},
  methods: {
    async getLogs() {
      const rep = await instanceAxios.instanceAxios.get("/logs", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.token
        }
      });
      this.logList = rep.data;
    },
    async getPlatformsLogs() {
      const rep = await instanceAxios.instanceAxios.get(
        "/logs/getPlatformsLogs",
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.token
          }
        }
      );
      this.platformsLogs = rep.data;
    },
    getDate(dateNumber) {
      var date = new Date(dateNumber);
      return date;
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.getLogs();
    Plotly.newPlot(
      this.$refs[this.chart.uuid],
      this.chart.traces,
      this.chart.layout
    );
  },
  watch: {
    /**
     * Searches through the table data by a given query.
     * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
     * @param value of the query
     */
  }
};
</script>

<style>
</style>