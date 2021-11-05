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
  BUILDING_LIST,
  APP_LIST,
  USER_LIST,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
  AUTH_SERVICE_BUILDING_RELATION_NAME,
} from "../constant";

export class AuthGraphService {
  public graph: SpinalGraph<any>;
  constructor(graph) {
    this.graph = graph;
  }
  async init(): Promise<SpinalGraph<any>> {
    let promises = [];
    var UserList;
    var AppApiList;
    var buildingList;
    if ((await this.graph.getContext(USER_LIST)) === undefined) {
      UserList = new SpinalContext(USER_LIST);
      promises.push(this.graph.addContext(UserList));
    }
    if ((await this.graph.getContext(APP_LIST)) === undefined) {
      AppApiList = new SpinalContext(APP_LIST);
      promises.push(this.graph.addContext(AppApiList));
    }
    if ((await this.graph.getContext(BUILDING_LIST)) === undefined) {
      buildingList = new SpinalContext(BUILDING_LIST);
      promises.push(this.graph.addContext(buildingList));
    }

    return Promise.all(promises).then(() => {
      return this.graph;
    });
  }
  async newBuilding(nameBuilding: string): Promise<SpinalNode<any>> {
    console.log("hello");

    const context = await SpinalGraphService.getContext(BUILDING_LIST);
    const building = new SpinalNode(nameBuilding);
    const res = context.addChildInContext(
      building,
      AUTH_SERVICE_BUILDING_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST,
      context
    );
    return res;
  }
}
// module.exports.AuthGraphService = AuthGraphService;
