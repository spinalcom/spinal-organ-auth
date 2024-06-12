/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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

import { SpinalGraphService, SpinalGraph, SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";

import { INotification, INotificationCreationParams } from "./notification.model";
import SpinalMiddleware from "../spinalMiddleware";
import { NOTIFICATION_LIST, AUTH_SERVICE_RELATION_TYPE_PTR_LST, AUTH_SERVICE_NOTIFICATION_RELATION_NAME, NOTIFICATION_TYPE } from "../constant";
import { OperationError } from "../utilities/operation-error";
import { HttpStatusCode } from "../utilities/http-status-code";

export class NotificationService {
	public context: SpinalContext<any>;
	static instance: NotificationService;
	private constructor() {}

	static getInstance() {
		if (!this.instance) this.instance = new NotificationService();
		return this.instance;
	}

	public async getNotificationListContext(): Promise<SpinalContext> {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		return graph.getContext(NOTIFICATION_LIST);
	}

	public async createNotificationListContext() {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		const context = new SpinalContext();
		return graph.addContext(context);
	}

	public async createNotification(notificationCreationParams: INotificationCreationParams): Promise<INotification> {
		try {
			const context = await this.getNotificationListContext();
			const notificationNode = new SpinalNode(notificationCreationParams.name, NOTIFICATION_TYPE);
			notificationNode.info.add_attr({
				date: Date.now(),
				actor: {
					actorId: notificationCreationParams.actor.actorId,
					actorName: notificationCreationParams.actor.actorName,
				},
			});

			const node = await context.addChildInContext(notificationNode, AUTH_SERVICE_NOTIFICATION_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
			return node.info.get();
		} catch (error) {
			throw new OperationError("NOT_CREATED", HttpStatusCode.BAD_REQUEST);
		}
	}
}
