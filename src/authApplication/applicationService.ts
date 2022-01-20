/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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
  APPLICATION_LIST,
  AUTH_SERVICE_APPLICATION_RELATION_NAME,
  APPLICATION_TYPE,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
  TOKEN_TYPE,
  TOKEN_LIST,
  AUTH_SERVICE_TOKEN_RELATION_NAME
} from "../constant";

import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from "spinal-env-viewer-graph-service";

import { OperationError } from "../utilities/operation-error";
import { HttpStatusCode } from "../utilities/http-status-code";
import {
  IApplication,
  IApplicationCreationParams,
  IApplicationUpdateParams,
  IApplicationLoginParams
} from "./application.model"
import { IApplicationToken, } from "../tokens/token.model"
import SpinalMiddleware from "../spinalMiddleware";
import data from "./profileApplicationListData"

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import jwt_decode from "jwt-decode";



export class ApplicationService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }



  public async createApplication(
    applicationCreationParams: IApplicationCreationParams
  ): Promise<IApplication> {

    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === APPLICATION_LIST) {
        var applicationCreated = bcrypt
          .hash(applicationCreationParams.clientSecret, 10)
          .then(async (hash) => {

            const applicationObject = {
              type: APPLICATION_TYPE,
              name: applicationCreationParams.name,
              clientId: applicationCreationParams.clientId,
              clientSecret: hash,
              rights: applicationCreationParams.rights
            }
            const ApplicationId = SpinalGraphService.createNode(applicationObject, undefined);
            const res = await SpinalGraphService.addChildInContext(
              context.getId().get(),
              ApplicationId,
              context.getId().get(),
              AUTH_SERVICE_APPLICATION_RELATION_NAME,
              AUTH_SERVICE_RELATION_TYPE_PTR_LST
            );

            return {
              id: res.getId().get(),
              type: res.getType().get(),
              name: res.getName().get(),
              clientId: res.info.clientId.get(),
              clientSecret: res.info.clientSecret.get()
            };
          })
        if (applicationCreated === undefined) {
          throw new OperationError(
            "UNKNOWN_ERROR",
            HttpStatusCode.UNAUTHORIZED
          );
        } else return applicationCreated;
      }
    }
  }




  public async login(applicationLoginParams: IApplicationLoginParams): Promise<IApplicationToken> {
    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === APPLICATION_LIST) {
        const applications = await context.getChildren(
          AUTH_SERVICE_APPLICATION_RELATION_NAME
        );
        for (const app of applications) {
          if (applicationLoginParams.clientId === app.info.clientId.get()) {
            return bcrypt
              .compare(applicationLoginParams.clientSecret, app.info.clientSecret.get())
              .then(async (valid) => {
                if (!valid) {
                  throw new OperationError(
                    "NOT_FOUND",
                    HttpStatusCode.NOT_FOUND
                  );
                } else {
                  let token = jwt.sign(
                    { applicationId: app.getId().get() },
                    "RANDOM_TOKEN_SECRET",
                    { expiresIn: "24h" }
                  )
                  let decodedToken = jwt_decode(token);
                  const tokenContext = SpinalGraphService.getContext(TOKEN_LIST);
                  const categoryTokenApplicationList = await tokenContext.getChildren('HasCategoryToken');
                  for (const categoryTokenApplication of categoryTokenApplicationList) {
                    if (categoryTokenApplication.getName().get() === "Application Token") {
                      const TokenId = SpinalGraphService.createNode({
                        name: "token_" + app.getName().get(),
                        type: TOKEN_TYPE,
                        token: token,
                        // @ts-ignore
                        createdToken: decodedToken.iat,
                        // @ts-ignore
                        expieredToken: decodedToken.exp,
                        applicationProfileId: app.info.applicationProfileId.get(),
                      }, undefined);
                      const res = await SpinalGraphService.addChildInContext(
                        tokenContext.getId().get(),
                        TokenId,
                        tokenContext.getId().get(),
                        AUTH_SERVICE_TOKEN_RELATION_NAME,
                        AUTH_SERVICE_RELATION_TYPE_PTR_LST
                      );
                      let tokenObj: IApplicationToken = {
                        name: res.getName().get(),
                        type: res.getType().get(),
                        token: token,
                        // @ts-ignore
                        createdToken: decodedToken.iat,
                        // @ts-ignore
                        expieredToken: decodedToken.exp,
                        applicationProfileId: app.info.applicationProfileId.get(),
                      };
                      return tokenObj
                    }
                  }
                }
              });
          }
        }
        throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
      }
    }
  }



  public async getApplications() {

  }

}
