/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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
// const axios = require('axios');
import axios from "axios";
export const instanceAxios = axios.create({
  // baseURL: 'http://localhost:9060/',
  baseURL: '/',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});

import router from "../router";

instanceAxios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  
  if (error.response.status === 401) {
    localStorage.removeItem('token');
    router.push("/Login");
  } if (error.response && error.response.data) {

    return Promise.reject(error.response.data);
  }
  return Promise.reject(error.message);
});