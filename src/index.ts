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

import { AuthGraphService } from './services/authGraphService';
import { TokensService } from './tokens/tokenService';
import Server from './server';
import SpinalMiddleware from './spinalMiddleware';
import { createOrGetRegisterKey, initLogsService, initPlatformService, initTokenService, initUserService } from './utilities/initialisation';

async function main() {
  const spinalMiddleware = SpinalMiddleware.getInstance();
  await spinalMiddleware.init();
  console.log('connection to hub initialize ...');
  const graph = spinalMiddleware.getGraph();

  const authGraphService = new AuthGraphService(graph);
  await authGraphService.init();
  const contexts = await graph.getChildren('hasContext');

  return Promise.all([
    initTokenService(contexts), initLogsService(contexts), initUserService(contexts), initPlatformService(),
  ]).then(async () => {
    await createOrGetRegisterKey(contexts);
    const cron = require('node-cron');
    cron.schedule('0-9 1 1 * * *', async function () {
      await new TokensService().verify();
    });
  });



  // start organ with token cron
  
}
main();
Server();
