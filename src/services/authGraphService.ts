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
} from 'spinal-core-connectorjs_type';
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import {
  PLATFORM_LIST,
  USER_LIST,
  APPLICATION_LIST,
  TOKEN_LIST,
  USER_TYPE,
  USER_TOKEN_CATEGORY_TYPE,
  APPLICATION_TYPE,
  APPLICATION_TOKEN_CATEGORY_TYPE,
  AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
  INFO_ADMIN_TYPE,
  AUTH_SERVICE_INFO_ADMIN_RELATION_NAME,
  INFO_ADMIN,
} from '../constant';

export class AuthGraphService {
  public graph: SpinalGraph<any>;
  constructor(graph) {
    this.graph = graph;
  }
  async init(): Promise<SpinalGraph<any>> {
    let promises = [];
    var userList: SpinalContext<spinal.Model>;
    var applicationList: SpinalContext<spinal.Model>;
    var platformList: SpinalContext<spinal.Model>;
    var tokenList: SpinalContext<spinal.Model>;
    var infoAdmin: SpinalContext<spinal.Model>;

    if ((await this.graph.getContext(USER_LIST)) === undefined) {
      userList = new SpinalContext(USER_LIST);
      promises.push(this.graph.addContext(userList));
    }

    if ((await this.graph.getContext(APPLICATION_LIST)) === undefined) {
      applicationList = new SpinalContext(APPLICATION_LIST);
      promises.push(this.graph.addContext(applicationList));
    }

    if ((await this.graph.getContext(PLATFORM_LIST)) === undefined) {
      platformList = new SpinalContext(PLATFORM_LIST);
      promises.push(this.graph.addContext(platformList));
    }
    if ((await this.graph.getContext(TOKEN_LIST)) === undefined) {
      tokenList = new SpinalContext(TOKEN_LIST);
      promises.push(this.graph.addContext(tokenList));
    }

    if ((await this.graph.getContext(INFO_ADMIN)) === undefined) {
      infoAdmin = new SpinalContext(INFO_ADMIN);
      promises.push(this.graph.addContext(infoAdmin));
    }

    return Promise.all(promises).then(() => {
      return this.graph;
    });
  }
}
