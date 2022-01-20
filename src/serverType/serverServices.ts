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
  Model,
  Ptr,
  spinalCore,
  FileSystem,
} from "spinal-core-connectorjs_type";
import {
  SERVER_LIST,
  AUTH_SERVICE_SERVER_RELATION_NAME,
  SERVER_TYPE,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
} from "../constant";
import { SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from "spinal-env-viewer-graph-service";
import { OperationError } from "../utilities/operation-error";
import { HttpStatusCode } from "../utilities/http-status-code";
import {
  IUserProfile,
  IServerCreationParams,
  IServerUpdateParams,
  IServer
} from "./server.model";
const bcrypt = require("bcrypt");
import SpinalMiddleware from "../spinalMiddleware";
import { regenerateKey } from "../utilities/utilitiesFunctions"
export class ServerService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }


  public async createServer(serverCreationParms): Promise<IServer> {

    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === SERVER_LIST) {
        const serverObject: IServerCreationParams = {
          name: serverCreationParms.name,
          type: SERVER_TYPE,
          clientId: serverCreationParms.clientId,
          clientSecret: serverCreationParms.clientSecret,
          uri: serverCreationParms.uri,
          profileList: serverCreationParms.profileList
        }
        const ServerId = SpinalGraphService.createNode(serverObject, undefined);
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          ServerId,
          context.getId().get(),
          AUTH_SERVICE_SERVER_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        )

        return {
          id: res.getId().get(),
          name: res.getName().get(),
          type: res.getType().get(),
          clientId: res.info.clientId.get(),
          clientSecret: res.info.clientSecret.get(),
          uri: res.info.uri.get(),
          profileList: res.info.profileList.get()
        }
      }
    }
  }


  public async getServers(): Promise<IServer[]> {

    try {
      var serversObjectList = [];

      const contexts = await this.graph.getChildren('hasContext');
      for (const context of contexts) {
        if (context.getName().get() === SERVER_LIST) {
          const servers = await context.getChildren(
            AUTH_SERVICE_SERVER_RELATION_NAME
          );
          for (const server of servers) {
            var ServerObject: IServer = {
              id: server.getId().get(),
              type: server.getType().get(),
              name: server.getName().get(),
              clientId: server.info.clientId.get(),
              clientSecret: server.info.clientSecret.get(),
              uri: server.info.uri.get(),
              profileList: server.info.profileList.get(),
            };
            serversObjectList.push(ServerObject);
          }
        }
      }
      return serversObjectList
    } catch (error) {
      return error;
    }
  }


  public async getServer(serverId: string): Promise<IServer> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === SERVER_LIST) {
        const servers = await context.getChildren(
          AUTH_SERVICE_SERVER_RELATION_NAME
        );
        for (const server of servers) {
          if (server.getId().get() === serverId) {
            var ServerObject: IServer = {
              id: server.getId().get(),
              type: server.getType().get(),
              name: server.getName().get(),
              clientId: server.info.clientId.get(),
              clientSecret: server.info.clientSecret.get(),
              uri: server.info.uri.get(),
              profileList: server.info.profileList.get(),
            };
          }
        }
        if (ServerObject) {
          return ServerObject
        } else {
          throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
        }
      }
    }
  }

  public async updateServer(serverId: string, requestBody: IServerUpdateParams): Promise<IServer> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === SERVER_LIST) {
        const servers = await context.getChildren(
          AUTH_SERVICE_SERVER_RELATION_NAME
        );
        var serverObject: IServer;
        for (const server of servers) {
          if (server.getId().get() === serverId) {
            if (requestBody.name !== undefined) {
              server.info.name.set(requestBody.name)
            } else if (requestBody.clientId !== undefined) {
              server.info.clientId.set(requestBody.clientId)
            } else if (requestBody.clientSecret !== undefined) {
              server.info.clientSecret.set(requestBody.clientSecret)
            } else if (requestBody.uri !== undefined)
              server.info.uri.set(requestBody.uri)

            serverObject = {
              id: server.getId().get(),
              name: server.getName().get(),
              type: server.getType().get(),
              clientId: server.info.clientId.get(),
              clientSecret: server.info.clientSecret.get(),
              uri: server.info.uri.get(),
              profileList: server.info.profileList.get()
            }

          }
        }

      }
    }
    return serverObject;
  }


  public async deleteServer(serverId: string): Promise<void> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === SERVER_LIST) {
        const servers = await context.getChildren(
          AUTH_SERVICE_SERVER_RELATION_NAME
        );
        var serverObject: IServer;
        for (const server of servers) {
          if (server.getId().get() === serverId) {
            await server.removeFromGraph();
          }
        }
      }
    }
  }

  public async createAuthServer(): Promise<IServer> {

    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === SERVER_LIST) {
        const serverObject: IServerCreationParams = {
          name: "ServerAuth",
          type: SERVER_TYPE,
          clientId: regenerateKey("id", false),
          clientSecret: regenerateKey("secret", false),
          uri: "localhost...",
          profileList: []
        }
        const ServerId = SpinalGraphService.createNode(serverObject, undefined);
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          ServerId,
          context.getId().get(),
          AUTH_SERVICE_SERVER_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        )

        return {
          id: res.getId().get(),
          name: res.getName().get(),
          type: res.getType().get(),
          clientId: res.info.clientId.get(),
          clientSecret: res.info.clientSecret.get(),
          uri: res.info.uri.get(),
          profileList: res.info.profileList.get()
        }
      }
    }
  }






























}
