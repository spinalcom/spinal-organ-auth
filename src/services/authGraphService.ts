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
import { Model, Ptr, spinalCore, FileSystem } from 'spinal-core-connectorjs_type';
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import {
  BUILDING_LIST,
  APP_LIST,
  USER_LIST,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
  AUTH_SERVICE_BUILDING_RELATION_NAME
} from '../constant'


export class AuthGraphService {
  public graph: SpinalGraph<any>
  constructor(graph) {
    this.graph = graph;
  }
  init(): Promise<SpinalGraph<any>> {

    let promises = [];
    // const graph = new SpinalGraph('AuthGraph');

    const UserList = new SpinalContext(USER_LIST);
    const AppApiList = new SpinalContext(APP_LIST);
    const buildingList = new SpinalContext(BUILDING_LIST);

    promises.push(
      this.graph.addContext(buildingList),
      this.graph.addContext(AppApiList),
      this.graph.addContext(UserList),
    )

    //CRUD BUILDINGS

    
    return Promise.all(promises).then(() => {
      return this.graph;
    });
  }
async newBuilding(nameBuilding:string) : Promise<SpinalNode<any>>{
  console.log("hello");

    const context = await SpinalGraphService.getContext(BUILDING_LIST)
        const building = new SpinalNode(nameBuilding);
        const res = context.addChildInContext(building,AUTH_SERVICE_BUILDING_RELATION_NAME,AUTH_SERVICE_RELATION_TYPE_PTR_LST,context)
        return res;
       
    

}

}
// module.exports.AuthGraphService = AuthGraphService;
