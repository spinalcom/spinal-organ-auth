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
import axios from "axios";
const TOKEN = "token";
async function getToken(user, pass) {
  let userparams = {
    userName: user,
    password: pass
  };
  console.error(process.env.SPINAL_HOST_API);
  const { data } = await axios.post(
    "/users/login",
    userparams
  );
  if (data) {
    // localstorage set
    localStorage.setItem(TOKEN, data.token);
  }

  return {
    limit: data.expieredToken,
    token: data.token
  };
}

async function* genToken(user, pass) {
  let token;
  if (user && pass) {
    token = await getToken(user, pass);
    isLogedin = true;
    yield token;
  } else token = localStorage.getItem(TOKEN);
  isLogedin = true;
  while (true) {
    if (token.limit > Date.now()) token = await refreshToken(token);
    yield token;
  }
}

export let isLogedin = false;
let _tokenGen = null;
export async function tokenGen(user = null, pass = null) {
  // console.log(_tokenGen);
  try {
    if (!_tokenGen) {
      _tokenGen = genToken(user, pass);
    }
    return await _tokenGen.next();
  } catch (error) {
    _tokenGen = null;
    throw error;
  }
}
