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



export class AuthGraphService {
  public graph: SpinalGraph<any>
  constructor(graph) {
    this.graph = graph;
  }
  init(): Promise<SpinalGraph<any>> {

    let promises = [];
    // const graph = new SpinalGraph('AuthGraph');

    const UserSTProfileList = new SpinalContext('UserSTProfileList');
    const AppApiProfileList = new SpinalContext('AppApiProfileList');
    const buildingList = new SpinalContext('buildingList');

    promises.push(
      this.graph.addContext(buildingList),
      this.graph.addContext(AppApiProfileList),
      this.graph.addContext(AppApiProfileList),
      this.graph.addContext(UserSTProfileList),
    )
    return Promise.all(promises).then(() => {
      return this.graph;
    });
  }


}
// module.exports.AuthGraphService = AuthGraphService;
