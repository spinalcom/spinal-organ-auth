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
  USER_REQUEST_EVENT_LOG_TYPE,
  APPLICATION_REQUEST_EVENT_LOG_TYPE,
  PLATFORM_REQUEST_EVENT_LOG_TYPE,
  ADMIN_REQUEST_EVENT_LOG_TYPE,
  AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME,
  AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME,
  AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME,
  AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME,
  AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
  USER_LOG_TYPE,
  PLATFORM_LIST,
  AUTH_SERVICE_PLATFORM_RELATION_NAME
} from '../constant';
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
import { ILog } from './log.model'
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
    await this.createNode(context, category, USER_LOG_EVENT_TYPE, 'Connection', category, AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
    // edit/update node 
    await this.createNode(context, category, USER_LOG_EVENT_TYPE, 'Edit', category, AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
    // create node 
    await this.createNode(context, category, USER_LOG_EVENT_TYPE, 'Create', category, AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
    // delete node 
    await this.createNode(context, category, USER_LOG_EVENT_TYPE, 'Delete', category, AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
  }
  public async createEventApplicationLogs(context: SpinalContext<any>, category: SpinalNode<any>) {

    // connection node
    await this.createNode(context, category, APPLICATION_LOG_EVENT_TYPE, 'Connection', category, AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

    // edit/update node 
    await this.createNode(context, category, APPLICATION_LOG_EVENT_TYPE, 'Edit', category, AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

    // create node 
    await this.createNode(context, category, APPLICATION_LOG_EVENT_TYPE, 'Create', category, AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

    // delete node 
    await this.createNode(context, category, APPLICATION_LOG_EVENT_TYPE, 'Delete', category, AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

  }
  public async createEventPlatformLogs(context: SpinalContext<any>, category: SpinalNode<any>) {
    // register node
    await this.createNode(context, category, PLATFORM_LOG_EVENT_TYPE, 'Register', category, AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

    // edit/update node 
    await this.createNode(context, category, PLATFORM_LOG_EVENT_TYPE, 'PushData', category, AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

    // update Token node 
    await this.createNode(context, category, PLATFORM_LOG_EVENT_TYPE, 'UpdateToken', category, AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

    // delete node 
    await this.createNode(context, category, PLATFORM_LOG_EVENT_TYPE, 'Delete', category, AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

  }
  public async createNode(context: SpinalContext<any>, category: SpinalNode<any>, nodeType: string, nodeName: string, parent: SpinalNode<any>, relationName: string, relationType: string) {
    const nodeObject = {
      type: nodeType,
      name: nodeName,
    };
    const nodeId = SpinalGraphService.createNode(
      nodeObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      parent.getId().get(),
      nodeId,
      context.getId().get(),
      relationName,
      relationType
    );
  }
  public async createEventAdminLogs(context: SpinalContext<any>, category: SpinalNode<any>) {
    // connection Admin
    await this.createNode(context, category, ADMIN_LOG_EVENT_TYPE, 'Connection', category, AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
    //  create Admin
    await this.createNode(context, category, ADMIN_LOG_EVENT_TYPE, 'Create', category, AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
    //  edit Admin
    await this.createNode(context, category, ADMIN_LOG_EVENT_TYPE, 'Edit', category, AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

  }
  public async createEventRequestsUserLogs(context: SpinalContext<any>, category: SpinalNode<any>) {
    const eventsLogs = await category.getChildren(AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME);
    for (const eventLog of eventsLogs) {
      if (eventLog.getName().get() === 'Connection') {
        await this.createNode(context, category, USER_REQUEST_EVENT_LOG_TYPE, 'Login Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, USER_REQUEST_EVENT_LOG_TYPE, 'User Valid Unknown Password', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, USER_REQUEST_EVENT_LOG_TYPE, 'User Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
      } else if (eventLog.getName().get() === 'Create') {
        await this.createNode(context, category, USER_REQUEST_EVENT_LOG_TYPE, 'Create Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, USER_REQUEST_EVENT_LOG_TYPE, 'Create Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
      }
      else if (eventLog.getName().get() === 'Edit') {
        await this.createNode(context, category, USER_REQUEST_EVENT_LOG_TYPE, 'Edit Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, USER_REQUEST_EVENT_LOG_TYPE, 'Edit Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

      } else if (eventLog.getName().get() === 'Delete') {
        await this.createNode(context, category, USER_REQUEST_EVENT_LOG_TYPE, 'Delete Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, USER_REQUEST_EVENT_LOG_TYPE, 'Delete Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

      }
    }

  }
  public async createEventRequestsApplicationLogs(context: SpinalContext<any>, category: SpinalNode<any>) {
    const eventsLogs = await category.getChildren(AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME);
    for (const eventLog of eventsLogs) {
      if (eventLog.getName().get() === 'Connection') {
        await this.createNode(context, category, APPLICATION_REQUEST_EVENT_LOG_TYPE, 'Login Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, APPLICATION_REQUEST_EVENT_LOG_TYPE, 'Login Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
      } else if (eventLog.getName().get() === 'Create') {
        await this.createNode(context, category, APPLICATION_REQUEST_EVENT_LOG_TYPE, 'Create Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, APPLICATION_REQUEST_EVENT_LOG_TYPE, 'Create Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
      }
      else if (eventLog.getName().get() === 'Edit') {
        await this.createNode(context, category, APPLICATION_REQUEST_EVENT_LOG_TYPE, 'Edit Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, APPLICATION_REQUEST_EVENT_LOG_TYPE, 'Edit Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

      } else if (eventLog.getName().get() === 'Delete') {
        await this.createNode(context, category, APPLICATION_REQUEST_EVENT_LOG_TYPE, 'Delete Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, APPLICATION_REQUEST_EVENT_LOG_TYPE, 'Delete Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

      }
    }


  }
  public async createEventRequestsPlatformLogs(context: SpinalContext<any>, category: SpinalNode<any>) {
    const eventsLogs = await category.getChildren(AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME);
    for (const eventLog of eventsLogs) {
      if (eventLog.getName().get() === 'Register') {
        await this.createNode(context, category, PLATFORM_REQUEST_EVENT_LOG_TYPE, 'Register Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, PLATFORM_REQUEST_EVENT_LOG_TYPE, 'Register Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
      }
      else if (eventLog.getName().get() === 'PushData') {
        await this.createNode(context, category, PLATFORM_REQUEST_EVENT_LOG_TYPE, 'Push Data', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, PLATFORM_REQUEST_EVENT_LOG_TYPE, 'Push Data Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

      }
      else if (eventLog.getName().get() === 'Delete') {
        await this.createNode(context, category, PLATFORM_REQUEST_EVENT_LOG_TYPE, 'Delete Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, PLATFORM_REQUEST_EVENT_LOG_TYPE, 'Delete Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
      } else if (eventLog.getName().get() === 'UpdateToken') {
        await this.createNode(context, category, PLATFORM_REQUEST_EVENT_LOG_TYPE, 'Update Token Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, PLATFORM_REQUEST_EVENT_LOG_TYPE, 'Update Token Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

      }
    }

  }
  public async createEventRequestsAdminLogs(context: SpinalContext<any>, category: SpinalNode<any>) {
    const eventsLogs = await category.getChildren(AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME);
    for (const eventLog of eventsLogs) {
      if (eventLog.getName().get() === 'Create') {
        await this.createNode(context, category, ADMIN_REQUEST_EVENT_LOG_TYPE, 'Create Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, ADMIN_REQUEST_EVENT_LOG_TYPE, 'Create Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
      }
      else if (eventLog.getName().get() === 'Connection') {
        await this.createNode(context, category, ADMIN_REQUEST_EVENT_LOG_TYPE, 'Connection Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, ADMIN_REQUEST_EVENT_LOG_TYPE, 'Connection Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
      }
      else if (eventLog.getName().get() === 'Edit') {
        await this.createNode(context, category, ADMIN_REQUEST_EVENT_LOG_TYPE, 'Edit Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        await this.createNode(context, category, ADMIN_REQUEST_EVENT_LOG_TYPE, 'Edit Not Valid', eventLog, AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)

      }
    }

  }
  public async createEventTypeGraph(context: SpinalContext<any>) {
    const categoriesLogs = await context.getChildren(AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME)
    for (const category of categoriesLogs) {
      if (category.getName().get() === 'UserLogs') {
        await this.createEventRequestsUserLogs(context, category);
      }
      else if (category.getName().get() === 'ApplicationLogs') {
        await this.createEventRequestsApplicationLogs(context, category)
      } else if (category.getName().get() === 'PlatformLogs') {
        await this.createEventRequestsPlatformLogs(context, category)
      } else if (category.getName().get() === 'AdminLogs') {
        await this.createEventRequestsAdminLogs(context, category)
      }
    }
  }


  public async createLog(_actor: SpinalNode<any>, _category: string, _eventLog: string, _eventrequest: string, message: string): Promise<void> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === LOG_LIST) {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const categories = await context.getChildren('HasCategoryLog');
        for (const category of categories) {
          if (category.getName().get() === _category) {
            // @ts-ignore
            SpinalGraphService._addNode(category);
            const eventsLog = await category.getChildren('HasEventLog');
            for (const eventLog of eventsLog) {
              if (eventLog.getName().get() === _eventLog) {
                // @ts-ignore
                SpinalGraphService._addNode(eventLog);
                const eventRequestsLog = await eventLog.getChildren('HasRequestEventLog');
                for (const eventRequetsLog of eventRequestsLog) {
                  if (eventRequetsLog.getName().get() === _eventrequest) {
                    // @ts-ignore
                    SpinalGraphService._addNode(eventRequetsLog);
                    const userLogObject = {
                      type: USER_LOG_TYPE,
                      name: 'Log',
                      actor: {
                        actorId: _actor?.getId().get(),
                        actorName: _actor?.getName().get()
                      },
                      message: message,
                      date: Date.now(),
                    };
                    // create Spinal Node
                    const userLogId = SpinalGraphService.createNode(
                      userLogObject,
                      undefined
                    );
                    await SpinalGraphService.addChildInContext(eventRequetsLog.getId().get(), userLogId, context.getId().get(),
                      AUTH_SERVICE_LOG_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
                    // @ts-ignore
                    SpinalGraphService._addNode(_actor);
                    await SpinalGraphService.addChildInContext(_actor.getId().get(), userLogId, context.getId().get(), AUTH_SERVICE_LOG_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST)
                  }
                }
              }
            }
          }

        }


      }
    }
  }



  public async getLogs(): Promise<any[]> {
    var logList: ILog[] = [];
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === LOG_LIST) {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const categories = await context.getChildren('HasCategoryLog');
        for (const category of categories) {
          // @ts-ignore
          SpinalGraphService._addNode(category);
          const eventsLog = await category.getChildren('HasEventLog');
          for (const eventLog of eventsLog) {
            // @ts-ignore
            SpinalGraphService._addNode(eventLog);
            const requestsEventLog = await eventLog.getChildren('HasRequestEventLog');
            for (const requestEventLog of requestsEventLog) {
              // @ts-ignore
              SpinalGraphService._addNode(requestEventLog);
              const logs = await requestEventLog.getChildren('HasLog');
              for (const log of logs) {
                var objetLog: ILog = {
                  id: log.getId().get(),
                  type: log.getType().get(),
                  name: log.getName().get(),
                  date: log.info.date?.get(),
                  message: log.info.message?.get(),
                  actor: {
                    actorId: log.info.actor?.actorId.get(), actorName: log.info.actor?.actorName.get(),
                  },
                  parentsInfo: await getParents(log)
                }
                logList.push(objetLog)
              }
            }
          }
        }
      }
    }
    return logList

  }

  public async getPlatformsLogs(): Promise<any[]> {
    var logList: ILog[] = [];
    try {
      var platformObjectList = [];
      const contexts = await this.graph.getChildren('hasContext');
      for (const context of contexts) {
        if (context.getName().get() === PLATFORM_LIST) {
          const platforms = await context.getChildren(
            AUTH_SERVICE_PLATFORM_RELATION_NAME
          );
          for (const platform of platforms) {
            const logs = await platform.getChildren('HasLog');
            for (const log of logs) {
              var objetLog: ILog = {
                id: log.getId().get(),
                type: log.getType().get(),
                name: log.getName().get(),
                date: log.info.date?.get(),
                message: log.info.message?.get(),
                actor: {
                  actorId: log.info.actor?.actorId.get(), actorName: log.info.actor?.actorName.get(),
                },
                parentsInfo: await getParents(log)
              }
              logList.push(objetLog);
            }

          }
        }
      }
      return platformObjectList;
    } catch (error) {
      return error;
    }

  }

}
async function getParents(realNode: SpinalNode<any>) {
  var parentsInfo = {
    parent: { id: "", type: "", name: "" },
    Gparent: { id: "", type: "", name: "" }
  }

  const parentsLog = await realNode.getParents('HasLog');
  for (const parentLog of parentsLog) {

    if (parentLog.getType().get() === 'AuthServiceUserRequestEventLog' || parentLog.getType().get() === 'AuthServiceAdminRequestEventLog' || parentLog.getType().get() === 'AuthServiceApplicationRequestEventLog' || parentLog.getType().get() === 'AuthServicePlatformRequestEventLog') {
      parentsInfo.parent = {
        id: parentLog.getId().get(),
        type: parentLog.getType().get(),
        name: parentLog.getName().get(),
      }
      const GparentsLog = await parentLog.getParents('HasRequestEventLog');
      parentsInfo.Gparent = {
        id: GparentsLog[0].getId().get(),
        type: GparentsLog[0].getType().get(),
        name: GparentsLog[0].getName().get(),
      }
    }
  }

  return parentsInfo
}



