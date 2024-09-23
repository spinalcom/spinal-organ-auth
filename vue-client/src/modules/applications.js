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

import axios from 'axios';
const instanceAxios = require("../services/axiosConfig");
import router from "../router"
export default {
    namespaced: true,
    state: {
        data: [],
        applist: [],
        detailApp: [],
        appLogList: [],
        platformObjectList: [],
        selectedplatformObjectList: [],

    },
    getters: {
        appList: state => state.applist,
        detailApp: state => state.detailApp,
        appLogList: state => state.appLogList,
        platformObjectList: state => state.platformObjectList,
        selectedplatformObjectList: state => state.selectedplatformObjectList,
    },
    actions: {
        async getApplist({ commit }) {
            const rep = await instanceAxios.instanceAxios.get("/applications", {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("token"),
                }
            });
            commit("setappList", rep.data);
        },
        async getApp({ commit, dispatch }, appId) {
            const rep = await instanceAxios.instanceAxios.get(
                `/applications/${appId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": localStorage.getItem("token"),
                    }
                }
            );
            await dispatch('getplatforms', rep.data);
            commit("setDetailApp", rep.data);
        },
        async getApplicationLogs({ commit }, appId) {
            const rep = await instanceAxios.instanceAxios.get(
                `/applications/${appId}/applicationLogs`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": localStorage.getItem("token"),
                    }
                }
            );
            commit("setAppLogList", rep.data)
        },
        async getplatform(context, platformId) {
            const rep = await instanceAxios.instanceAxios.get(
                `/platforms/${platformId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": localStorage.getItem("token"),
                    }
                }
            );
            return rep.data;
        },
        async getplatforms({ commit, dispatch }, _app) {
            //resetplatform
            commit('RESET_PLATFORM_OBJECT');
            for (const platform of _app.platformList) {
                // const _platform = await this.getplatform(platform.platformId);//ne fonctionne pas
                const _platform = await dispatch('getplatform', platform.platformId);
                let infoPlatform = {
                    _platform: _platform,
                    appProfile: {
                        name: platform.appProfile.name,
                        appProfileId: platform.appProfile.appProfileId
                    }
                };
                commit('ADD_PLATFORM_OBJECT', infoPlatform);
            }
        },

        async getAppProfileList({ commit }, id) {
            const rep = await instanceAxios.instanceAxios.get(
                `/platforms/${id}/getAppProfileList`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": localStorage.getItem("token")
                    }
                }
            );
            return rep.data
        },

        async saveApp({ commit }, objectBody) {
            // console.log('la');
            const rep = await instanceAxios.instanceAxios.post(
                "/applications",
                objectBody,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": localStorage.getItem("token")
                    }
                }
            );
            if (rep) {
                router.push("/Application");
            }
        },

        async updateApp({ commit }, profile) {
            // console.log(profile);
            // console.log(profile[1], profile[0]);
            const rep = await instanceAxios.instanceAxios.put(
                `/applications/${profile[1]}`,
                profile[0],
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": localStorage.getItem("token")
                    }
                }
            );
            if (rep) {
                router.push("/Application");
            }
        },

        async deleteApp({ commit }, id) {
            let ask = true
            let r = true;
            if (ask)
                r = confirm(
                    "Are you sure you want to delete the Application, you can lost all config of this Application!"
                );
            if (r === true) {
                await instanceAxios.instanceAxios.delete(
                    `/applications/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "x-access-token": localStorage.getItem("token")
                        }
                    }
                );
                router.push("/Application");
            }
        },

        lafonctionapp({ commit }, tableau) {
            commit("SET_SELECTED_PLATFORM_OBJECT_LIST", tableau)
        }

    },
    mutations: {
        setappList: (state, applist) => (
            state.applist = applist
        ),
        setDetailApp: (state, detailApp) => (
            state.detailApp = detailApp
        ),
        setAppLogList: (state, appLogList) => (
            state.appLogList = appLogList
        ),
        ADD_PLATFORM_OBJECT(state, infoPlatform) {
            state.platformObjectList.push(infoPlatform);
        },
        SET_SELECTED_PLATFORM_OBJECT_LIST: (state, selectedplatformObjectList) => (
            state.selectedplatformObjectList = selectedplatformObjectList
        ),
        RESET_PLATFORM_OBJECT(state) {
            state.platformObjectList = [];
        }
    }
}
