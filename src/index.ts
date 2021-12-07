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

import { spinalCore, FileSystem } from 'spinal-core-connectorjs_type';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { SpinalContext, SpinalGraph, SpinalNode } from 'spinal-model-graph';
import { AuthGraphService } from './services/authGraphService'
import { UsersService } from './authUser/userService';
import { PlatformsService } from './platform/platformServices';
import { ServersService } from './serverType/serverServices';
const { SpinalServiceUser } = require('spinal-service-user');
import Server from './server'
import { TokensService } from "./tokens/tokenService"

import config from './config'
import SpinalMiddleware from './spinalMiddleware';

async function main() {
  const spinalMiddleware = SpinalMiddleware.getInstance()
  await spinalMiddleware.init();
  console.log("connection to hub initialize ...");
  const authGraphService = new AuthGraphService(spinalMiddleware.getGraph());
  await authGraphService.init();
  //verification user
  let usersService = new UsersService()
  let users = await usersService.getUsers();
  if (users.length === 0) {
    let res = await usersService.createAuthAdmin()
    if (res !== undefined) {
      console.log("Auth Admin created ...");
    }
  }
  let plateformsService = new PlatformsService()
  let plateforms = await plateformsService.getPlateforms();
  if (plateforms.length === 0) {
    let res = await plateformsService.createAuthPlateform();
    if (res !== undefined) {
      console.log("Auth Plateform created ...");
    }
  }

  let serversService = new ServersService();
  let servers = await serversService.getServers();
  if (servers.length === 0) {
    let res = await serversService.createAuthServer();
    if (res !== undefined) {
      console.log("Auth Server created ...");
    }
  }
  let TimerToken: number;
  TimerToken = setTimeout(async function () {
    let tokensService = new TokensService();
    await tokensService.verify()
  }, 86400) as unknown as number;




}
main();
Server();

