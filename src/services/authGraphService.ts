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
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from "spinal-env-viewer-graph-service";
import {
  PLATFORM_LIST,
  SERVER_LIST,
  USER_LIST,
  TOKEN_LIST,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
} from "../constant";

export class AuthGraphService {
  public graph: SpinalGraph<any>;
  constructor(graph) {
    this.graph = graph;
  }
  async init(): Promise<SpinalGraph<any>> {
    let promises = [];
    var UserList;
    var platformList;
    var serverList;
    var tokenList;

    if ((await this.graph.getContext(USER_LIST)) === undefined) {
      UserList = new SpinalContext(USER_LIST);
      promises.push(this.graph.addContext(UserList));
    }
    if ((await this.graph.getContext(PLATFORM_LIST)) === undefined) {
      platformList = new SpinalContext(PLATFORM_LIST);
      promises.push(this.graph.addContext(platformList));
    }
    if ((await this.graph.getContext(SERVER_LIST)) === undefined) {
      serverList = new SpinalContext(SERVER_LIST);
      promises.push(this.graph.addContext(serverList));
    }

    if ((await this.graph.getContext(TOKEN_LIST)) === undefined) {
      tokenList = new SpinalContext(TOKEN_LIST);
      promises.push(this.graph.addContext(tokenList));
    }

    return Promise.all(promises).then(() => {
      return this.graph;
    });
  }

}
