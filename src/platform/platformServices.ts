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
  PLATFORM_LIST,
  AUTH_SERVICE_PLATFORM_RELATION_NAME,
  PLATFORM_TYPE,
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
import { IPlatform, IPlateformCreationParams, IPlatformUpdateParams } from "./platform.model";
import SpinalMiddleware from "../spinalMiddleware";
import { platform } from "process";




/**
 *
 *
 * @export
 * @class PlatformsService
 */
export class PlatformsService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }

  public async createPlateform(platformCreationParms: IPlateformCreationParams): Promise<IPlatform> {
    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platformObject: IPlateformCreationParams = {
          type: PLATFORM_TYPE,
          name: platformCreationParms.name,
        }
        const PlatformId = SpinalGraphService.createNode(platformObject, undefined);
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          PlatformId,
          context.getId().get(),
          AUTH_SERVICE_PLATFORM_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
        return {
          id: res.getId().get(),
          type: res.getType().get(),
          name: res.getName().get()
        };

      }
    }
  }
  public async getPlateform(id): Promise<IPlatform> {
    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          AUTH_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            var PlatformObject: IPlatform = {
              id: platform.getId().get(),
              type: platform.getType().get(),
              name: platform.getName().get()
            };
          }
        }
      }
    }
    if (PlatformObject) {
      return PlatformObject
    } else {
      throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
    }
  }
  public async getPlateforms(): Promise<IPlatform[]> {
    try {
      var platformObjectList = [];
      const contexts = await this.graph.getChildren("hasContext");
      for (const context of contexts) {
        if (context.getName().get() === PLATFORM_LIST) {
          const platforms = await context.getChildren(
            AUTH_SERVICE_PLATFORM_RELATION_NAME
          );
          for (const platform of platforms) {
            var PlatformObject: IPlatform = {
              id: platform.getId().get(),
              type: platform.getType().get(),
              name: platform.getName().get()
            };
            platformObjectList.push(PlatformObject);
          }
        }
      }
      return platformObjectList

    } catch (error) {
      return error
    }
  }
  public async updatePlateform(id: string, requestBody: IPlatformUpdateParams): Promise<IPlatform> {
    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          AUTH_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            if (requestBody.name !== undefined) {
              platform.info.name.set(requestBody.name)
              return {
                id: platform.getId().get(),
                type: platform.getType().get(),
                name: platform.getName().get()
              };
            } else {
              return {
                id: platform.getId().get(),
                type: platform.getType().get(),
                name: platform.getName().get()
              };
            }
          }
        }
      }
    }
  }

  public async deletePlatform(id: string): Promise<void> {
    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          AUTH_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            await platform.removeFromGraph();
          }
        }
      }
    }
  }



  public async createAuthPlateform(): Promise<IPlatform> {
    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platformObject: IPlateformCreationParams = {
          type: PLATFORM_TYPE,
          name: "authenticationPlatform",
        }
        const PlatformId = SpinalGraphService.createNode(platformObject, undefined);
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          PlatformId,
          context.getId().get(),
          AUTH_SERVICE_PLATFORM_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
        return {
          id: res.getId().get(),
          type: res.getType().get(),
          name: res.getName().get()
        };
      }
    }
  }

}

