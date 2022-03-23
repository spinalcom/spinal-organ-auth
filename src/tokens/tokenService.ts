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
  TOKEN_TYPE,
  AUTH_SERVICE_TOKEN_RELATION_NAME,
  TOKEN_LIST,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
  USER_TOKEN_CATEGORY_TYPE,
  APPLICATION_TOKEN_CATEGORY_TYPE,
  AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME,
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
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export class TokensService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }

  public async createTokenTree(): Promise<void> {
    let promises = [];
    const context = await this.graph.getContext(TOKEN_LIST);
    const userTokenGroupObject = {
      type: USER_TOKEN_CATEGORY_TYPE,
      name: 'User Token',
    };
    const applicationTokenGroupObject = {
      type: APPLICATION_TOKEN_CATEGORY_TYPE,
      name: 'Application Token',
    };
    const userTokenCategoryId = SpinalGraphService.createNode(
      userTokenGroupObject,
      undefined
    );
    const applicationTokenCategoryId = SpinalGraphService.createNode(
      applicationTokenGroupObject,
      undefined
    );
    await SpinalGraphService.addChildInContext(
      context.getId().get(),
      userTokenCategoryId,
      context.getId().get(),
      AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );
    await SpinalGraphService.addChildInContext(
      context.getId().get(),
      applicationTokenCategoryId,
      context.getId().get(),
      AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME,
      AUTH_SERVICE_RELATION_TYPE_PTR_LST
    );
  }

  public async verify(): Promise<void> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === TOKEN_LIST) {
        let tokens = await context.getChildren(
          AUTH_SERVICE_TOKEN_RELATION_NAME
        );
        for (const token of tokens) {
          if (token.info.expieredToken.get() > new Date().getTime()) {
            console.log('date exp plus grand');
            await token.removeFromGraph();
          } else {
            console.log('date exp plus petit');
            console.log(new Date(token.info.expieredToken.get()));
          }
        }
      }
    }
  }

  public async getTokens() {
    const context = await this.graph.getContext(TOKEN_LIST);
    const categoriesToken = await context.getChildren('HasCategoryToken');
    var tokenList = [];
    for (const category of categoriesToken) {
      const categoryTokens = await category.getChildren('HasToken');
      for (const token of categoryTokens) {
        let info = {
          id: token.getId().get(),
          type: token.getType().get(),
          name: token.getName().get(),
          token: token.info.token.get(),
          createdToken: token.info.createdToken.get(),
          expieredToken: token.info.expieredToken.get(),
          userId: token.info.userId.get(),
          userType: token.info.userType.get(),
        };
        tokenList.push(info);
      }
    }
    return tokenList;
  }
  public async getUserTokens() {
    const context = await this.graph.getContext(TOKEN_LIST);
    const categoriesToken = await context.getChildren('HasCategoryToken');
    var tokenList = [];
    for (const category of categoriesToken) {
      if (category.getName().get() === 'User Token') {
        const categoryTokens = await category.getChildren('HasToken');
        for (const token of categoryTokens) {
          let info = {
            id: token.getId().get(),
            type: token.getType().get(),
            name: token.getName().get(),
            token: token.info.token.get(),
            createdToken: token.info.createdToken.get(),
            expieredToken: token.info.expieredToken.get(),
            userId: token.info.userId.get(),
            userType: token.info.userType.get(),
          };
          tokenList.push(info);
        }
      }
    }
    return tokenList;
  }
  public async getApplicationTokens() {
    const context = await this.graph.getContext(TOKEN_LIST);
    const categoriesToken = await context.getChildren('HasCategoryToken');
    var tokenList = [];
    for (const category of categoriesToken) {
      if (category.getName().get() === 'Application Token') {
        const categoryTokens = await category.getChildren('HasToken');
        for (const token of categoryTokens) {
          let info = {
            id: token.getId().get(),
            type: token.getType().get(),
            name: token.getName().get(),
            token: token.info.token.get(),
            createdToken: token.info.createdToken.get(),
            expieredToken: token.info.expieredToken.get(),
            userId: token.info.userId.get(),
            userType: token.info.userType.get(),
          };
          tokenList.push(info);
        }
      }
    }
    return tokenList;
  }
}
