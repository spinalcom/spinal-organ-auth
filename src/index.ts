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

import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { AuthGraphService } from './services/authGraphService';
import { UserService } from './authUser/userService';
import { PlatformService } from './platform/platformServices';
import { TokensService } from './tokens/tokenService';
import { LogsService } from './logs/logService'
import Server from './server';
import SpinalMiddleware from './spinalMiddleware';
import { LOG_LIST, AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME, AUTH_SERVICE_USER_RELATION_NAME, AUTH_SERVICE_INFO_ADMIN_RELATION_NAME, AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME } from './constant'

async function main() {
  const spinalMiddleware = SpinalMiddleware.getInstance();
  await spinalMiddleware.init();
  console.log('connection to hub initialize ...');

  const authGraphService = new AuthGraphService(spinalMiddleware.getGraph());
  await authGraphService.init();
  const contexts = await spinalMiddleware.getGraph().getChildren('hasContext');

  //config token context
  var tokensService = new TokensService();
  for (const context of contexts) {
    if (context.getName().get() === 'tokenList') {
      // @ts-ignore
      SpinalGraphService._addNode(context);
      const childsContext = await context.getChildren(AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME);
      if (childsContext.length === 0) {
        await tokensService.createTokenTree();
      }
    }
  }

  //config logs context
  var logsService = new LogsService();
  for (const context of contexts) {
    if (context.getName().get() === LOG_LIST) {
      // SpinalGraphService.removeFromGraph(context.getId().get())
      // @ts-ignore
      SpinalGraphService._addNode(context);
      // await context.removeFromGraph();
      const childsContext = await context.getChildren(AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME);
      if (childsContext.length === 0) {
        await logsService.createLogTree();
        await logsService.createSubGraph(context);
        await logsService.createEventTypeGraph(context);
      }
    }
  }

  //verification user
  for (const context of contexts) {
    if (context.getName().get() === 'userList') {
      // @ts-ignore
      SpinalGraphService._addNode(context);
      const childsContext = await context.getChildren(AUTH_SERVICE_USER_RELATION_NAME);
      if (childsContext.length === 0) {
        const userService = new UserService();
        let res = await userService.createAuthAdmin();
        if (res !== undefined) {
          console.log('Auth Admin created ...');
        }
      }
    }
  }

  // start organ with platform config
  var plateformsService = new PlatformService();
  var plateforms = await plateformsService.getPlateforms();
  if (plateforms.length === 0) {
    let res = await plateformsService.createAuthPlateform();
    if (res !== undefined) {
      console.log('Auth Plateform created ...');
    }
  }

  // start organ with register key config
  for (const context of contexts) {
    if (context.getName().get() === 'infoAdmin') {
      let nodes = await context.getChildren(AUTH_SERVICE_INFO_ADMIN_RELATION_NAME);
      if (nodes.length === 0) {
        let res = await plateformsService.createRegisterKeyNode();
        if (res !== undefined) {
          console.log('register key created ...', res);
        }
      }
    }
  }


  // start organ with token cron
  var cron = require('node-cron');
  cron.schedule('0-9 1 1 * * *', async function () {
    await tokensService.verify();
  });
}
main();
Server();
