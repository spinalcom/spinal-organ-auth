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

import { initAllContexts } from "./services/authGraphService";
import { TokensService } from "./routes/tokens/tokenService";
import Server from "./server";
import SpinalMiddleware from "./spinalMiddleware";
import { createOrGetRegisterKey, initAllServices } from "./utilities/initialisation";

import * as cron from "node-cron";

async function main() {
	const graph = await SpinalMiddleware.getInstance().getGraph();
	console.log("connection to hub initialize ...");
	const contexts = await initAllContexts(graph);
	return initAllServices(contexts).then(async () => {
		await createOrGetRegisterKey(contexts);
		cron.schedule("30 */1 * * *", async () => {
			console.log("purge invalid token");
			await TokensService.getInstance().purgeInvalidToken();
		});
	});
}

(async () => {
	await main();
	Server();
})();