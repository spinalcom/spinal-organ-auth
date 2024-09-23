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

import { LOG_TYPE, AUTH_SERVICE_LOG_RELATION_NAME, AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME, LOG_LIST, USER_LOG_CATEGORY_TYPE, APPLICATION_LOG_CATEGORY_TYPE, PLATFORM_LOG_CATEGORY_TYPE, ADMIN_LOG_CATEGORY_TYPE, USER_LOG_EVENT_TYPE, APPLICATION_LOG_EVENT_TYPE, PLATFORM_LOG_EVENT_TYPE, ADMIN_LOG_EVENT_TYPE, USER_REQUEST_EVENT_LOG_TYPE, APPLICATION_REQUEST_EVENT_LOG_TYPE, PLATFORM_REQUEST_EVENT_LOG_TYPE, ADMIN_REQUEST_EVENT_LOG_TYPE, AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME, AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME, AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME, AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, USER_LOG_TYPE, PLATFORM_LIST, AUTH_SERVICE_PLATFORM_RELATION_NAME, USER_LOG_CATEGORY_NAME, APPLICATION_LOG_CATEGORY_NAME, PLATFORM_LOG_CATEGORY_NAME, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES, EVENTS_REQUEST_NAMES } from "../../constant";
import { SpinalGraphService, SpinalGraph, SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import SpinalMiddleware from "../../spinalMiddleware";
import { ILog } from "./log.model";
import { PlatformService } from "../platform/platformServices";
import { logNodeTree } from "../../utilities/log";
import { log } from "console";

export class LogsService {
	static instance: LogsService;
	public context: SpinalContext;

	private constructor() { }

	public static getInstance(): LogsService {
		if (!this.instance) this.instance = new LogsService();
		return this.instance;
	}

	public async getLogsContext(): Promise<SpinalContext> {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		return graph.getContext(LOG_LIST);
	}

	public async createLogsContext() {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		const context = new SpinalContext(LOG_LIST);
		return graph.addContext(context);
	}

	public async createUserLogsCategory() {
		const context = await this.getLogsContext();
		const node = new SpinalNode(USER_LOG_CATEGORY_NAME, USER_LOG_CATEGORY_TYPE);
		const nodeNames = [EVENTS_NAMES.CONNECTION, EVENTS_NAMES.EDIT, EVENTS_NAMES.CREATE, EVENTS_NAMES.DELETE];
		await this.createEventLogNodes(node, context, nodeNames, USER_LOG_EVENT_TYPE, AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME);
		return node;
	}

	public async createApplicationLogsCategory() {
		const context = await this.getLogsContext();
		const node = new SpinalNode(APPLICATION_LOG_CATEGORY_NAME, APPLICATION_LOG_CATEGORY_TYPE);
		const nodeNames = [EVENTS_NAMES.CONNECTION, EVENTS_NAMES.EDIT, EVENTS_NAMES.CREATE, EVENTS_NAMES.DELETE];
		await this.createEventLogNodes(node, context, nodeNames, APPLICATION_LOG_EVENT_TYPE, AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME);
		return node;
	}

	public async createPlatformLogsCategory() {
		const context = await this.getLogsContext();
		const node = new SpinalNode(PLATFORM_LOG_CATEGORY_NAME, PLATFORM_LOG_CATEGORY_TYPE);
		const nodeNames = [EVENTS_NAMES.REGISTER, EVENTS_NAMES.PUSH_DATA, EVENTS_NAMES.UPDATE_TOKEN, EVENTS_NAMES.DELETE, EVENTS_NAMES.EDIT];
		await this.createEventLogNodes(node, context, nodeNames, PLATFORM_LOG_EVENT_TYPE, AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME);
		return node;
	}

	public async createAdminLogsCategory() {
		const context = await this.getLogsContext();
		const node = new SpinalNode(ADMIN_LOG_CATEGORY_NAME, ADMIN_LOG_CATEGORY_TYPE);
		const nodeNames = [EVENTS_NAMES.CONNECTION, EVENTS_NAMES.CREATE, EVENTS_NAMES.EDIT];
		await this.createEventLogNodes(node, context, nodeNames, ADMIN_LOG_EVENT_TYPE, AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME);
		return node;
	}

	public async createLogTree(): Promise<SpinalNode[]> {
		const promises = [this.createUserLogsCategory(), this.createApplicationLogsCategory(), this.createPlatformLogsCategory(), this.createAdminLogsCategory()];
		return Promise.all(promises).then(async (nodes) => {
			const context = await this.getLogsContext();
			const res = [];
			for (const node of nodes) {
				const n = await context.addChildInContext(node, AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
				res.push(n);
			}

			// return res;
			return nodes;
		});
	}

	public async createEventLogNodes(parent: SpinalNode, contextNode: SpinalNode, nodeNames: string[], nodeType: string, relationFromParentName: string) {
		const promises = nodeNames.map(async (name) => {
			const node = new SpinalNode(name, nodeType);
			return this.createEventTypeGraph(parent, node, contextNode);
		});

		Promise.all(promises).then(async (nodes) => {
			const promises = nodes.map((node) => parent.addChildInContext(node, relationFromParentName, AUTH_SERVICE_RELATION_TYPE_PTR_LST, contextNode));
			return Promise.all(promises);
		});
	}

	public async createEventTypeGraph(category: SpinalNode, eventLogNode: SpinalNode, context?: SpinalContext) {
		const eventLogType = eventLogNode.getType().get();

		switch (eventLogType) {
			case USER_LOG_EVENT_TYPE:
				await this.createEventRequestsUserLogs(eventLogNode, context);
				break;
			case APPLICATION_LOG_EVENT_TYPE:
				await this.createEventRequestsApplicationLogs(eventLogNode, context);
				break;
			case PLATFORM_LOG_EVENT_TYPE:
				await this.createEventRequestsPlatformLogs(eventLogNode, context);

				break;
			case ADMIN_LOG_EVENT_TYPE:
				await this.createEventRequestsAdminLogs(eventLogNode, context);
				break;
		}

		return eventLogNode;
	}

	public createEventRequestNodes(names: string[], type: string) {
		return names.map((name) => new SpinalNode(name, type));
	}

	public async createNode(context: SpinalContext<any>, category: SpinalNode<any>, nodeType: string, nodeName: string, parent: SpinalNode<any>, relationName: string, relationType: string) {
		const nodeObject = {
			type: nodeType,
			name: nodeName,
		};
		const nodeId = SpinalGraphService.createNode(nodeObject, undefined);
		await SpinalGraphService.addChildInContext(parent.getId().get(), nodeId, context.getId().get(), relationName, relationType);
	}

	public async createEventRequestsUserLogs(eventLog: SpinalNode, context?: SpinalContext) {
		let names = [];
		context = context || (await this.getLogsContext());
		const eventName = eventLog.getName().get();

		switch (eventName) {
			case EVENTS_NAMES.CONNECTION:
				names = [EVENTS_REQUEST_NAMES.LOGIN_VALID, EVENTS_REQUEST_NAMES.USER_VALID_UNKNOWN_PASSWORD, EVENTS_REQUEST_NAMES.USER_NOT_VALID];
				break;
			case EVENTS_NAMES.CREATE:
				names = [EVENTS_REQUEST_NAMES.CREATE_VALID, EVENTS_REQUEST_NAMES.CREATE_NOT_VALID];
				break;
			case EVENTS_NAMES.EDIT:
				names = [EVENTS_REQUEST_NAMES.EDIT_VALID, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID];
				break;
			case EVENTS_NAMES.DELETE:
				names = [EVENTS_REQUEST_NAMES.DELETE_VALID, EVENTS_REQUEST_NAMES.DELETE_NOT_VALID];
				break;
		}

		const nodes = this.createEventRequestNodes(names, USER_REQUEST_EVENT_LOG_TYPE);
		const promises = nodes.map((node) => eventLog.addChildInContext(node, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context));

		return Promise.all(promises);
	}

	public async createEventRequestsApplicationLogs(eventLog: SpinalNode, context?: SpinalContext) {
		let names = [];
		context = context || (await this.getLogsContext());
		const eventName = eventLog.getName().get();

		switch (eventName) {
			case EVENTS_NAMES.CONNECTION:
				names = [EVENTS_REQUEST_NAMES.LOGIN_VALID, EVENTS_REQUEST_NAMES.LOGIN_NOT_VALID];
				break;
			case EVENTS_NAMES.CREATE:
				names = [EVENTS_REQUEST_NAMES.CREATE_VALID, EVENTS_REQUEST_NAMES.CREATE_NOT_VALID];
				break;
			case EVENTS_NAMES.EDIT:
				names = [EVENTS_REQUEST_NAMES.EDIT_VALID, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID];
				break;
			case EVENTS_NAMES.DELETE:
				names = [EVENTS_REQUEST_NAMES.DELETE_VALID, EVENTS_REQUEST_NAMES.DELETE_NOT_VALID];
				break;
		}

		const nodes = this.createEventRequestNodes(names, APPLICATION_REQUEST_EVENT_LOG_TYPE);
		const promises = nodes.map((node) => eventLog.addChildInContext(node, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context));

		return Promise.all(promises);
	}

	public async createEventRequestsPlatformLogs(eventLog: SpinalNode, context?: SpinalContext) {
		let names = [];
		context = context || (await this.getLogsContext());
		const eventName = eventLog.getName().get();

		switch (eventName) {
			case EVENTS_NAMES.REGISTER:
				names = [EVENTS_REQUEST_NAMES.REGISTER_VALID, EVENTS_REQUEST_NAMES.REGISTER_NOT_VALID];
				break;
			case EVENTS_NAMES.PUSH_DATA:
				names = [EVENTS_REQUEST_NAMES.PUSH_DATA, EVENTS_REQUEST_NAMES.PUSH_DATA_NOT_VALID];
				break;
			case EVENTS_NAMES.DELETE:
				names = [EVENTS_REQUEST_NAMES.DELETE_VALID, EVENTS_REQUEST_NAMES.DELETE_NOT_VALID];
				break;
			case EVENTS_NAMES.UPDATE_TOKEN:
				names = [EVENTS_REQUEST_NAMES.UPDATE_TOKEN_VALID, EVENTS_REQUEST_NAMES.UPDATE_TOKEN_NOT_VALID];
				break;
			case EVENTS_NAMES.EDIT:
				names = [EVENTS_REQUEST_NAMES.EDIT_VALID, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID];
				break;
		}

		const nodes = this.createEventRequestNodes(names, PLATFORM_REQUEST_EVENT_LOG_TYPE);
		const promises = nodes.map((node) => eventLog.addChildInContext(node, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context));

		return Promise.all(promises);
	}

	public async createEventRequestsAdminLogs(eventLog: SpinalNode, context?: SpinalContext) {
		let names = [];
		context = context || (await this.getLogsContext());
		const eventName = eventLog.getName().get();

		switch (eventName) {
			case EVENTS_NAMES.CONNECTION:
				names = [EVENTS_REQUEST_NAMES.CONNECTION_VALID, EVENTS_REQUEST_NAMES.CONNECTION_NOT_VALID];
				break;
			case EVENTS_NAMES.CREATE:
				names = [EVENTS_REQUEST_NAMES.CREATE_VALID, EVENTS_REQUEST_NAMES.CREATE_NOT_VALID];
				break;
			case EVENTS_NAMES.EDIT:
				names = [EVENTS_REQUEST_NAMES.EDIT_VALID, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID];
				break;
			case EVENTS_NAMES.DELETE:
				names = [EVENTS_REQUEST_NAMES.DELETE_VALID, EVENTS_REQUEST_NAMES.DELETE_NOT_VALID];
				break;
		}

		const nodes = this.createEventRequestNodes(names, ADMIN_REQUEST_EVENT_LOG_TYPE);
		const promises = nodes.map((node) => eventLog.addChildInContext(node, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context));

		return Promise.all(promises);
	}

	public async getLogCategory(categoryName: string): Promise<SpinalNode> {
		const context = await this.getLogsContext();
		const categories = await context.getChildren(AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME);

		return categories.find((category) => category.getName().get() === categoryName);
	}

	public async getEventLog(category: SpinalNode | string, eventLog: string): Promise<SpinalNode> {
		let categoryNode = category instanceof SpinalNode && category;
		if (!categoryNode) categoryNode = await this.getLogCategory(category as string);

		const relationNames = [AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME, AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME, AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME, AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME];

		const eventLogs = await categoryNode.getChildren(relationNames);

		return eventLogs.find((event) => event.getName().get() === eventLog);
	}

	public async getEventRequestLog(eventLog: SpinalNode | string, eventRequest: string, category: SpinalNode | string) {
		let eventLogNode = eventLog instanceof SpinalNode && eventLog;
		if (!eventLogNode) eventLogNode = await this.getEventLog(category, eventLog as string);

		const eventRequestLogs = await eventLogNode.getChildren([AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME]);

		return eventRequestLogs.find((event) => event.getName().get() === eventRequest);
	}

	public async createLog(_actor: SpinalNode<any>, _category: string, _eventLog: string, _eventrequest: string, message: string): Promise<void> {
		const context = await this.getLogsContext();
		const eventRequestLog = await this.getEventRequestLog(_eventLog, _eventrequest, _category);

		const logNode = new SpinalNode("Log", USER_LOG_TYPE);
		logNode.info.add_attr({
			actor: {
				actorId: _actor !== undefined ? _actor.getId().get() : "",
				actorName: _actor !== undefined ? _actor?.getName().get() : "",
			},
			message: message,
			date: Date.now(),
		});

		await eventRequestLog.addChildInContext(logNode, AUTH_SERVICE_LOG_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context);

		if (_actor !== undefined) await _actor.addChildInContext(logNode, AUTH_SERVICE_LOG_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context);

		await this.purgeLogs();
	}

	public async purgeLogs() {
		// const logs = await eventRequetsLog.getChildren(AUTH_SERVICE_LOG_RELATION_NAME);
		const logs = await this.getAllLogsNodes();
		logs.sort((a, b) => comparerParDate(a.info.get(), b.info.get()));

		const limitdelete = logs.length - this.getLogLimit();
		const promise = [];
		if (limitdelete > 0) {
			for (let index = 0; index < limitdelete; index++) {
				promise.push(logs[index].removeFromGraph());
			}
		}

		await Promise.all(promise);
	}

	public async getAllEventLogs() {
		const context = await this.getLogsContext();
		const categories = await context.getChildren(AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME);
		const promises = categories.map(async (category) => {
			const relationNames = [AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME, AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME, AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME, AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME];
			return category.getChildren(relationNames);
		});

		return Promise.all(promises).then((result) => {
			return result.flat();
		});
	}

	public async getAllEventRequestLogs() {
		const eventLogs = await this.getAllEventLogs();
		const promises = eventLogs.map(async (eventLog) => eventLog.getChildren(AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME));

		return Promise.all(promises).then((result) => result.flat());
	}

	public async getAllLogsNodes() {
		const requestsEventLog = await this.getAllEventRequestLogs();
		const promises = requestsEventLog.map(async (requestEventLog) => requestEventLog.getChildren(AUTH_SERVICE_LOG_RELATION_NAME));
		return Promise.all(promises).then((logs) => logs.flat());
	}

	public async getLogs(): Promise<any[]> {
		const logs = await this.getAllLogsNodes();
		const promises = logs.map(async (log) => ({
			id: log.getId().get(),
			type: log.getType().get(),
			name: log.getName().get(),
			date: log.info.date?.get(),
			message: log.info.message?.get(),
			actor: {
				actorId: log.info.actor?.actorId.get(),
				actorName: log.info.actor?.actorName.get(),
			},
			parentsInfo: await getParents(log),
		}));

		return Promise.all(promises);
	}

	public async getPlatformsLogs(): Promise<any[]> {
		const context = await PlatformService.getInstance().getContext();
		const platforms = await context.getChildren(AUTH_SERVICE_PLATFORM_RELATION_NAME);
		const promises = platforms.map(async (platform) => platform.getChildren(AUTH_SERVICE_LOG_RELATION_NAME));

		return Promise.all(promises).then(async (logs) => {
			const res = [];
			const logsFlat = logs.flat();
			for (const log of logsFlat) {
				res.push({
					id: log.getId().get(),
					type: log.getType().get(),
					name: log.getName().get(),
					date: log.info.date?.get(),
					message: log.info.message?.get(),
					actor: {
						actorId: log.info.actor?.actorId.get(),
						actorName: log.info.actor?.actorName.get(),
					},
					parentsInfo: await getParents(log),
				});
			}
			return res;
		});
	}

	private getLogLimit() {
		let limit = parseInt(process.env.LIMIT_LOG);

		if (isNaN(limit)) limit = 3000;

		return limit;
	}
}

async function getParents(realNode: SpinalNode<any>) {
	var parentsInfo = {
		parent: { id: "", type: "", name: "" },
		Gparent: { id: "", type: "", name: "" },
	};

	const parentsLog = await realNode.getParents(AUTH_SERVICE_LOG_RELATION_NAME);
	for (const parentLog of parentsLog) {
		if (parentLog.getType().get() === "AuthServiceUserRequestEventLog" || parentLog.getType().get() === "AuthServiceAdminRequestEventLog" || parentLog.getType().get() === "AuthServiceApplicationRequestEventLog" || parentLog.getType().get() === "AuthServicePlatformRequestEventLog") {
			parentsInfo.parent = {
				id: parentLog.getId().get(),
				type: parentLog.getType().get(),
				name: parentLog.getName().get(),
			};
			const GparentsLog = await parentLog.getParents("HasRequestEventLog");
			parentsInfo.Gparent = {
				id: GparentsLog[0].getId().get(),
				type: GparentsLog[0].getType().get(),
				name: GparentsLog[0].getName().get(),
			};
		}
	}

	return parentsInfo;
}

// Fonction de comparaison pour trier par date
function comparerParDate(log1: ILog, log2: ILog) {
	let dateLog1 = parseInt(log1.date);
	let dateLog2 = parseInt(log2.date);
	return dateLog1 - dateLog2;
}
