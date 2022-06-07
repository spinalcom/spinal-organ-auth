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


import {
  LOG_TYPE,
  AUTH_SERVICE_LOG_RELATION_NAME,
  AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME,
  LOG_LIST,
  USER_LOG_CATEGORY_TYPE,
  APPLICATION_LOG_CATEGORY_TYPE,
  PLATFORM_LOG_CATEGORY_TYPE,
  ADMIN_LOG_CATEGORY_TYPE,
  USER_LOG_EVENT_TYPE,
  APPLICATION_LOG_EVENT_TYPE,
  PLATFORM_LOG_EVENT_TYPE,
  ADMIN_LOG_EVENT_TYPE,
  AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME,
  AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME,
  AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME,
  AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
} from '../constant';
import { SPINAL_RELATION_PTR_LST_TYPE } from 'spinal-env-viewer-graph-service';
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { OperationError } from '../utilities/operation-error';
import { HttpStatusCode } from '../utilities/http-status-code';
import config from '../config';
import SpinalMiddleware from '../spinalMiddleware';
import { Lst } from 'spinal-core-connectorjs_type';

export class LogsService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }

  public async createLogTree(): Promise<void> {
    let promises = [];
    // create category objects
    const context = await this.graph.getContext(LOG_LIST);
    const userLogCategoryObject = {
      type: USER_LOG_CATEGORY_TYPE,
      name: 'UserLogs',
    };
    const applicationLogCategoryObject = {
      type: APPLICATION_LOG_CATEGORY_TYPE,
      name: 'ApplicationLogs',
    };

    const platformCategoryObject = {
      type: PLATFORM_LOG_CATEGORY_TYPE,
      name: 'PlatformLogs',
    };

    const adminCategoryObject = {
      type: ADMIN_LOG_CATEGORY_TYPE,
      name: 'AdminLogs',
    };


    // create Spinal Node
    const userLogCategoryId = SpinalGraphService.createNode(
      userLogCategoryObject,
      undefined
    );
    const applicationLogCategoryId = SpinalGraphService.createNode(
      applicationLogCategoryObject,
      undefined
    );
    const platformLogCategoryId = SpinalGraphService.createNode(
      platformCategoryObject,
      undefined
    );
    const adminLogCategoryId = SpinalGraphService.createNode(
      adminCategoryObject,
      undefined
    );

    // add Nodes to Contexts
    await SpinalGraphService.addChildInContext(
      context.getId().get(),
      userLogCategoryId,
      context.getId().get(),
      AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );
    await SpinalGraphService.addChildInContext(
      context.getId().get(),
      applicationLogCategoryId,
      context.getId().get(),
      AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );

    await SpinalGraphService.addChildInContext(
      context.getId().get(),
      platformLogCategoryId,
      context.getId().get(),
      AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );
    await SpinalGraphService.addChildInContext(
      context.getId().get(),
      adminLogCategoryId,
      context.getId().get(),
      AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );
  }

  public async createSubGraph(context: SpinalContext<any>) {
    const categoriesLogs = await context.getChildren(AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME)
    console.log(categoriesLogs);

    for (const category of categoriesLogs) {
      if (category.getName().get() === 'UserLogs') {
        await this.createEventUserLogs(context, category)
      }
      else if (category.getName().get() === 'ApplicationLogs') {
        await this.createEventApplicationLogs(context, category)
      } else if (category.getName().get() === 'PlatformLogs') {
        await this.createEventPlatformLogs(context, category)
      } else if (category.getName().get() === 'AdminLogs') {
        await this.createEventAdminLogs(context, category)
      }
    }
  }

  public async createEventUserLogs(context: SpinalContext<any>, category: SpinalNode<any>) {
    // connection node
    const userEventConnectionObject = {
      type: USER_LOG_EVENT_TYPE,
      name: 'Connection',
    };

    const userEventConnectionId = SpinalGraphService.createNode(
      userEventConnectionObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      userEventConnectionId,
      context.getId().get(),
      AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );


    // edit/update node 
    const userEventEditObject = {
      type: USER_LOG_EVENT_TYPE,
      name: 'Edit',
    };
    const userEventEditId = SpinalGraphService.createNode(
      userEventEditObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      userEventEditId,
      context.getId().get(),
      AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );

    // create node 
    const userEventCreateObject = {
      type: USER_LOG_EVENT_TYPE,
      name: 'Create',
    };
    const userEventCreateId = SpinalGraphService.createNode(
      userEventCreateObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      userEventCreateId,
      context.getId().get(),
      AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );

    // delete node 
    const userEventDeleteObject = {
      type: USER_LOG_EVENT_TYPE,
      name: 'Delete',
    };
    const userEventDeleteId = SpinalGraphService.createNode(
      userEventDeleteObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      userEventDeleteId,
      context.getId().get(),
      AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );
  }

  public async createEventApplicationLogs(context: SpinalContext<any>, category: SpinalNode<any>) {

    // connection node
    const applicationEventConnectionObject = {
      type: APPLICATION_LOG_EVENT_TYPE,
      name: 'Connection',
    };

    const applicationEventConnectionId = SpinalGraphService.createNode(
      applicationEventConnectionObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      applicationEventConnectionId,
      context.getId().get(),
      AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );

    // edit/update node 
    const applicationEventEditObject = {
      type: APPLICATION_LOG_EVENT_TYPE,
      name: 'Edit',
    };
    const applicationEventEditId = SpinalGraphService.createNode(
      applicationEventEditObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      applicationEventEditId,
      context.getId().get(),
      AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );

    // create node 
    const applicationEventCreateObject = {
      type: APPLICATION_LOG_EVENT_TYPE,
      name: 'Create',
    };
    const applicationEventCreateId = SpinalGraphService.createNode(
      applicationEventCreateObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      applicationEventCreateId,
      context.getId().get(),
      AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );

    // delete node 
    const applicationEventDeleteObject = {
      type: APPLICATION_LOG_EVENT_TYPE,
      name: 'Delete',
    };
    const applicationEventDeleteId = SpinalGraphService.createNode(
      applicationEventDeleteObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      applicationEventDeleteId,
      context.getId().get(),
      AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );
  }

  public async createEventPlatformLogs(context: SpinalContext<any>, category: SpinalNode<any>) {
    // connection node
    const platformEventRegisterObject = {
      type: PLATFORM_LOG_EVENT_TYPE,
      name: 'Register',
    };

    const platformEventRegisterId = SpinalGraphService.createNode(
      platformEventRegisterObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      platformEventRegisterId,
      context.getId().get(),
      AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );

    // edit/update node 
    const platformEventPushDataObject = {
      type: PLATFORM_LOG_EVENT_TYPE,
      name: 'PushData',
    };
    const platformEventPushDataId = SpinalGraphService.createNode(
      platformEventPushDataObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      platformEventPushDataId,
      context.getId().get(),
      AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );

    // create node 
    const platformEventUpdateTokenObject = {
      type: PLATFORM_LOG_EVENT_TYPE,
      name: 'UpdateToken',
    };
    const platformEventUpdateTokenId = SpinalGraphService.createNode(
      platformEventUpdateTokenObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      platformEventUpdateTokenId,
      context.getId().get(),
      AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );

    // delete node 
    const platformEventDeleteObject = {
      type: PLATFORM_LOG_EVENT_TYPE,
      name: 'Delete',
    };
    const platformEventDeleteId = SpinalGraphService.createNode(
      platformEventDeleteObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      platformEventDeleteId,
      context.getId().get(),
      AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );
  }
  public async createEventAdminLogs(context: SpinalContext<any>, category: SpinalNode<any>) {
    // connection node
    const adminEventConnectionObject = {
      type: ADMIN_LOG_EVENT_TYPE,
      name: 'Connection',
    };

    const adminEventConnectionId = SpinalGraphService.createNode(
      adminEventConnectionObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      adminEventConnectionId,
      context.getId().get(),
      AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );


    const adminEventCreateObject = {
      type: ADMIN_LOG_EVENT_TYPE,
      name: 'create',
    };

    const adminEventCreateId = SpinalGraphService.createNode(
      adminEventCreateObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      adminEventCreateId,
      context.getId().get(),
      AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );


    const adminEventEditObject = {
      type: ADMIN_LOG_EVENT_TYPE,
      name: 'edit',
    };

    const adminEventEditId = SpinalGraphService.createNode(
      adminEventEditObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      category.getId().get(),
      adminEventEditId,
      context.getId().get(),
      AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );



  }

  public async createLog(eventFrom: string, eventEnum: number, targetId: string, targetName: string) {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === LOG_LIST) {

      }
    }
  }
}
