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

import { spinalCore, FileSystem, Model } from "spinal-core-connectorjs_type";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-model-graph";
import { store } from "./utilities/utilitiesFunctions";

import config from "./config";
import ConfigFile from "spinal-lib-organ-monitoring";

class SpinalMiddleware {
	static instance: SpinalMiddleware = null;
	conn: spinal.FileSystem;
	// configFilePath: string = "/__users__/admin/ADMIN_config_SSO";
	configFilePath: string = "/__users__/admin/ADMIN_config";
	iteratorGraph = this.geneGraph();

	static getInstance() {
		if (SpinalMiddleware.instance === null) {
			SpinalMiddleware.instance = new SpinalMiddleware();
		}
		return SpinalMiddleware.instance;
	}
	private constructor() {
		// connection string to connect to spinalhub
		const connect_opt = `http://${config.spinalConnector.user}:${config.spinalConnector.password}@${config.spinalConnector.host}:${config.spinalConnector.port}/`;
		// initialize the connection
		this.conn = spinalCore.connect(connect_opt);
	}

	private async *geneGraph(): AsyncGenerator<SpinalGraph<any>, never> {
		const init = new Promise<SpinalGraph<any>>((resolve, reject) => {
			spinalCore.load(
				this.conn,
				this.configFilePath,
				(graph: any) => resolve(graph),

				() => {
					const graph = new SpinalGraph();
					store(
						this.conn,
						graph,
						this.configFilePath,
						() => resolve(graph),
						() => reject("IS NOT ABLE TO CONNECT TO HUB")
					);
				}
			);
		});

		const graph = await init;
		while (true) {
			yield graph;
		}
	}

	// onLoadError(resolve, reject): void {
	// 	const graph = new SpinalGraph();
	// 	store(
	// 		this.conn,
	// 		graph,
	// 		this.configFilePath,
	// 		() => {
	// 			this.onLoadSuccess(resolve, graph);
	// 		},
	// 		() => {
	// 			reject("IS NOT ABLE TO CONNECT TO HUB");
	// 		}
	// 	);
	// }

	// async onLoadSuccess(resolve: () => void, graph: SpinalGraph<any>) {
	// 	await SpinalGraphService.setGraph(graph);
	// 	this.graph = graph;
	// 	await ConfigFile.init(this.conn, config.spinalConnector.organName, "Spinal-organ-auth", config.spinalConnector.host, parseInt(config.spinalConnector.port as string));
	// 	resolve();
	// }

	async getGraph(): Promise<SpinalGraph> {
		const g = await this.iteratorGraph.next();
		return g.value;
	}
}
export default SpinalMiddleware;
