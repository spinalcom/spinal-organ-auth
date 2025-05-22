import { name } from "file-loader";
import { get } from "http";

const { instanceAxios, getAxiosHeader } = require("../services/axiosConfig");


const SET_CODES = "SET_CODES";
const ADD_CODES = "ADD_CODE";
const REMOVE_CODE = "REMOVE_CODE";

export default {
    namespaced: true,
    state: {
        codes: []
    },

    mutations: {
        [SET_CODES]: (state, codes) => state.codes = codes,

        [ADD_CODES]: (state, codes) => {
            if (!Array.isArray(codes)) codes = [codes];
            state.codes = [...state.codes, ...codes];
        },

        [REMOVE_CODE]: (state, codes) => {
            if (!Array.isArray(codes)) codes = [codes];
            const codeIds = codes.map(el => el.code);

            state.codes = state.codes.filter((code) => !codeIds.includes(code.code));
        },
    },

    getters: {
        codes: (state) => {
            return state.codes;
        },
        codeById: (state) => (id) => {
            return state.codes.find((code) => {
                return code.id === id || code.name === id || code.code === id;
            });
        },
    },

    actions: {
        async getAllCode({ commit }) {
            const rep = await instanceAxios.get("/codes", { headers: getAxiosHeader() });
            commit(SET_CODES, rep.data);
        },

        async generateCode({ commit }, data) {
            const rep = await instanceAxios.post("/codes/create", data, { headers: getAxiosHeader() });
            commit(ADD_CODES, rep.data);
        },

        async getCode({ commit }, codeId) {
            const rep = await instanceAxios.get(`/codes/getcode/${codeId}`, { headers: getAxiosHeader() });
            commit(SET_CODES, rep.data);
        },

        async removeCode({ commit }, codeId) {
            const rep = await instanceAxios.delete(`/codes/delete/${codeId}`, { headers: getAxiosHeader() });
            commit(REMOVE_CODE, rep.data);
        },

        async removeCodes({ commit }, codes) {
            const rep = await instanceAxios.delete("/codes/delete", { codes }, { headers: getAxiosHeader() });
            commit(REMOVE_CODE, rep.data);
        },
    },
}