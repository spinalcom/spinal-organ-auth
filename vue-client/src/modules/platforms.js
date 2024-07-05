/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import axios from "axios";
import { platform } from "os";
const instanceAxios = require("../services/axiosConfig");
export default {
  namespaced: true,
  state: {
    data: [],
    platformlist: [],
    registerKey: null,
    platform: [],
    platformlog: [],
    appListLinkPlatform: [],
    userListLinkPlatform: []
  },
  getters: {
    platformList: state => state.platformlist,
    registerKey: state => state.registerKey,
    platform: state => state.platform,
    platformlog: state => state.platformlog,
    appListLinkPlatform: state => state.appListLinkPlatform,
    userListLinkPlatform: state => state.userListLinkPlatform
  },
  actions: {
    async savePlatform({ commit }, platform) {
      const rep = await instanceAxios.instanceAxios.post(
        "/platforms",
        platform,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          }
        }
      );
      commit("addPlatform", rep.data);
    },

    async getUsers({ dispatch }, platformId) {
      const rep = await instanceAxios.instanceAxios.get("/users", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token")
        }
      });
      // console.log(platformId);
      dispatch("getUsersFromPltaform", { platformId, data: rep.data });
    },

    getUsersFromPltaform({ commit }, { platformId, data }) {
      var users = [];
      for (const user of data) {
        if (user.platformList) {
          for (const platform of user.platformList) {
            if (platform.platformId === platformId) {
              users.push(user);
            }
          }
        }
      }
      commit("setuserListLinkPlatform", users);
    },

    async getApplications({ dispatch }, platformId) {
      const rep = await instanceAxios.instanceAxios.get("/applications", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token")
        }
      });
      dispatch("getAPPSFromPltaform", { platformId, data: rep.data });
    },

    getAPPSFromPltaform({ commit }, { platformId, data }) {
      var apps = [];
      for (const app of data) {
        if (app.platformList) {
          for (const platform of app.platformList) {
            // console.log(platform.platformId);
            if (platform.platformId === platformId) {
              apps.push(app);
              // console.log(app);
            }
          }
        }
      }
      commit("setAppListLinkPlatform", apps);
    },

    async getPlatformlist({ commit, dispatch }) {
      const rep = await instanceAxios.instanceAxios.get("/platforms", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token")
        }
      });
      this.platformList = rep.data;
      const test = await Promise.all(
        rep.data.map(async function(item) {
          item.organs = await dispatch("getOrgans", item.id);
          item.userProfiles = await dispatch("getUserProfiles", item.id);
          item.appProfiles = await dispatch("getAppProfiles", item.id);
          return item;
        })
      );
      // console.log(test);
      commit("setplatformList", test);
    },

    async getPlatformLogs({ commit }, platformId) {
      const rep = await instanceAxios.instanceAxios.get(
        `/platforms/${platformId}/platformLogs`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          }
        }
      );
      commit("setPlatformLog", rep.data);
    },

    async getPlatformInfo({ commit }, platformId) {
      const rep = await instanceAxios.instanceAxios.get(
        `/platforms/${platformId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          }
        }
      );
      return rep.data;
    },

    async getPlatform({ commit, dispatch }, platformId) {
      var item = await dispatch("getPlatformInfo", platformId);
      item.organs = await dispatch("getOrgans", platformId);
      item.userProfiles = await dispatch("getUserProfiles", platformId);
      item.appProfiles = await dispatch("getAppProfiles", platformId);
      commit("setPlatform", item);
    },

    async getOrgans(context, platformId) {
      const rep = await instanceAxios.instanceAxios.get(
        `/organs/${platformId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          }
        }
      );
      return rep.data;
    },

    async getUserProfiles(context, platformId) {
      const rep = await instanceAxios.instanceAxios.get(
        `/platforms/${platformId}/getUserProfileList`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          }
        }
      );
      return rep.data;
    },

    async getAppProfiles(context, platformId) {
      const rep = await instanceAxios.instanceAxios.get(
        `/platforms/${platformId}/getAppProfileList`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          }
        }
      );
      return rep.data;
    },

    async generateRegisterKey({ commit }) {
      const rep = await instanceAxios.instanceAxios.post(
        "/registerKey",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          }
        }
      );
      commit("setregisterkey", rep.data);
    },

    async getRegisterKey({ commit }) {
      const rep = await instanceAxios.instanceAxios.get("/registerKey", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token")
        }
      });
      commit("setregisterkey", rep.data);
    },

    async editPlatformItem(context, platform) {
      // console.log(platform[0],platform[1]);
      const rep = await instanceAxios.instanceAxios.put(
        `/platforms/${platform[1]}`,
        {
          name: platform[0]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          }
        }
      );
    }
  },
  mutations: {
    addPlatform: (state, platform) =>
      (state.platformlist = [...state.platformlist, platform]),

    setplatformList: (state, platformlist) =>
      (state.platformlist = platformlist),
    setregisterkey: (state, registerKey) => (state.registerKey = registerKey),
    setPlatform: (state, platform) => (state.platform = platform),
    setPlatformLog: (state, platformlog) => (state.platformlog = platformlog),
    setAppListLinkPlatform: (state, appListLinkPlatform) =>
      (state.appListLinkPlatform = appListLinkPlatform),
    setuserListLinkPlatform: (state, userListLinkPlatform) =>
      (state.userListLinkPlatform = userListLinkPlatform)
  }
};
