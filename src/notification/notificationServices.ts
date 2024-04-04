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

import {
  SpinalGraphService,
  SpinalGraph,
} from 'spinal-env-viewer-graph-service';

import {
  INotification,
  INotificationCreationParams
} from './notification.model';
import SpinalMiddleware from '../spinalMiddleware';
import {
  NOTIFICATION_LIST,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
  AUTH_SERVICE_NOTIFICATION_RELATION_NAME,
  NOTIFICATION_TYPE
} from '../constant';
import { OperationError } from '../utilities/operation-error';
import { HttpStatusCode } from '../utilities/http-status-code';

export class NotificationService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    //this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }


  public async createNotification(notificationCreationParams: INotificationCreationParams): Promise<INotification> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === NOTIFICATION_LIST) {
        const notificationObject = {
          type: NOTIFICATION_TYPE,
          name: notificationCreationParams.name,
          date: Date.now(),
          actor: {
            actorId: notificationCreationParams.actor.actorId,
            actorName: notificationCreationParams.actor.actorName
          }
        }
        const notificationId = SpinalGraphService.createNode(
          notificationObject,
          undefined
        );
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          notificationId,
          context.getId().get(),
          AUTH_SERVICE_NOTIFICATION_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
        if (res === undefined) {
          throw new OperationError('NOT_CREATED', HttpStatusCode.BAD_REQUEST);
        } else {

        }

      }
    }
    return
  }







}