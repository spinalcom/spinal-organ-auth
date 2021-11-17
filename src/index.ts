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
const { SpinalServiceUser } = require('spinal-service-user');
import Server from './server'

import config from './config'
import SpinalMiddleware from './spinalMiddleware';

async function main() {
  const spinalMiddleware = SpinalMiddleware.getInstance()
  await spinalMiddleware.init();
  console.log("connexion to hub inisialiser ...");
  const authGraphService = new AuthGraphService(spinalMiddleware.getGraph());
  await authGraphService.init();
  //verification user
  let usersService = new UsersService()
  let users = await usersService.getUsers();
  if (users.length === 0) {
    await authGraphService.createAuthAdmin()
    console.log("admin created ..");
  }

}
main();
Server();

