import { stat } from "fs";

const { instanceAxios } = require("../services/axiosConfig");

export default {
  namespaced: true,
  state: {
    authorized: false
  },
  mutations: {
    SET_STATE(state, payload) {
      state.authorized = payload;
    }
  },
  actions: {
    async authorize({ commit }, data) {
      try {
        const response = await instanceAxios.post("/oauth/authorize", data, {
          headers: { "content-type": "application/x-www-form-urlencoded" }
        });
        commit("SET_STATE", true);

        return response.data;
      } catch (error) {
        commit("SET_STATE", false);
        throw error;
      }
    },
    async getServers({ commit }, platformId) {
      try {
        const response = await instanceAxios.get(`/platforms/${platformId}/loginServers`);

        return response.data;
      } catch (error) {
        return [];
      }
    }
  }
};
