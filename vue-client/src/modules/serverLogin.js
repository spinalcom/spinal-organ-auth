const { instanceAxios } = require("../services/axiosConfig");

const SET_SERVERS = "SET_SERVERS";
const ADD_SERVERS = "ADD_SERVERS";
const UPDATE_SERVERS = "UPDATE_SERVERS";
const DELETE_SERVER = "DELETE_SERVER";

export default {
    namespaced: true,
    state: {
        servers: [],
    },
    getters: {
        servers: state => state.servers
    },
    actions: {
        async addServer({ commit }, server) {
            const res = await instanceAxios.post("/loginserver/create", server, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("token")
                }
            });

            commit(ADD_SERVERS, res.data);
        },

        async editServer({ commit }, playload) {
            const res = await instanceAxios.put("/loginserver/update/" + playload.serverId, playload.server, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("token")
                }
            });

            commit(UPDATE_SERVERS, { serverId: playload.serverId, server: res.data });
        },

        async deleteServer({ commit }, serverId) {
            const res = await instanceAxios.delete("/loginserver/delete/" + serverId, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("token")
                }
            });

            commit(DELETE_SERVER, serverId);
        },

        async getServerById({ commit, state }, serverId) {

            const found = state.servers.find(el => el.id === serverId);
            if (found) return found;


            const res = await instanceAxios.get("/loginserver/" + serverId, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("token")
                }
            });

            const server = res.data;
            commit(ADD_SERVERS, server);
            return res.data;
        },

        async getAllServers({ commit, state }) {

            const res = await instanceAxios.get("/loginserver/all_servers", {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("token")
                }
            });

            const server = res.data;
            commit(SET_SERVERS, server);

        },
    },
    mutations: {
        [SET_SERVERS](state, playload) {
            state.servers = playload;
        },

        [ADD_SERVERS](state, playload) {
            state.servers = [...state.servers, playload];
        },

        [UPDATE_SERVERS](state, { serverId, server }) {
            const index = state.servers.findIndex(el => el.id = serverId);

            if (index !== -1) {
                state.servers = [...(state.servers.slice(0, index)), server, ...(state.servers.slice(index + 1))];
            }
        },

        [DELETE_SERVER](state, serverId) {
            state.servers = state.servers.filter(el => el.id !== serverId);
        },
    }
}