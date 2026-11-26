/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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
const instanceAxios = require("../services/axiosConfig");

export async function loginUser(user, pass) {
  localStorage.removeItem("token"); // Remove tokens left by versions prior to HttpOnly cookies.
  const userparams = {
    userName: user,
    password: pass,
  };
  return instanceAxios.instanceAxios.post(
    "/users/loginAuthAdmin",
    userparams
  );
}

export async function isAuthenticate() {
  try {
    localStorage.removeItem("token"); // One-time migration cleanup for existing browsers.
    await instanceAxios.instanceAxios.get("/tokens/verifySession");
    return true;
  } catch (error) {
    return false;
  }
}
