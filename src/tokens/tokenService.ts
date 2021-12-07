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
  TOKEN_TYPE,
  AUTH_SERVICE_TOKEN_RELATION_NAME,
  TOKEN_LIST,
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
import { IToken } from "./token.model"
import config from "../config"
import SpinalMiddleware from "../spinalMiddleware";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



export class TokensService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }



  public async verify(): Promise<void> {

    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === TOKEN_LIST) {
        let tokens = await context.getChildren(AUTH_SERVICE_TOKEN_RELATION_NAME)
        for (const token of tokens) {
          if (token.info.expieredToken.get() > new Date().getTime()) {
            console.log("date exp plus grand");
            await token.removeFromGraph();
          }
          else {
            console.log("date exp plus petit");
            console.log(new Date(token.info.expieredToken.get()));
          }
        }
      }
    }
  }

}