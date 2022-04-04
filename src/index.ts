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
import Server from './server';
import { TokensService } from './tokens/tokenService';
import SpinalMiddleware from './spinalMiddleware';

async function main() {
  const spinalMiddleware = SpinalMiddleware.getInstance();
  await spinalMiddleware.init();
  console.log('connection to hub initialize ...');
  const authGraphService = new AuthGraphService(spinalMiddleware.getGraph());
  await authGraphService.init();
  const contexts = await spinalMiddleware.getGraph().getChildren('hasContext');

  //config token context tree
  for (const context of contexts) {
    if (context.getName().get() === 'tokenList') {
      // @ts-ignore
      SpinalGraphService._addNode(context);
      const childsContext = await context.getChildren('HasCategoryToken');
      if (childsContext.length === 0) {
        var tokensService = new TokensService();
        await tokensService.createTokenTree();
      }
    }
  }

  //verification user
  for (const context of contexts) {
    if (context.getName().get() === 'userList') {
      // @ts-ignore
      SpinalGraphService._addNode(context);
      const childsContext = await context.getChildren('HasUser');
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
      let nodes = await context.getChildren('HasRegisterKey');
      if (nodes.length === 0) {
        let res = await plateformsService.createRegisterKeyNode();
        if (res !== undefined) {
          console.log('register key created ...', res);
        }
      }
    }
  }

  // start organ with token config
  let TimerToken: number;
  TimerToken = (setTimeout(async function() {
    let tokensService = new TokensService();
    await tokensService.verify();
  }, 86400) as unknown) as number;
}
main();
Server();
