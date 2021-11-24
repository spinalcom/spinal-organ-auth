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
  USER_LIST,
  AUTH_SERVICE_USER_RELATION_NAME,
  USER_TYPE,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
} from "../constant";
import { SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from "spinal-env-viewer-graph-service";
import { expressAuthentication } from "./authentication"
import { OperationError } from "../utilities/operation-error";
import { HttpStatusCode } from "../utilities/http-status-code";
import { IUser, IUserCreationParams, IUserUpdateParams, IUserLoginParams } from "./user.model";
//import { bcrypt } from "bcrypt";
//export type UserCreationParams = Pick<User, "userName">;
import SpinalMiddleware from "../spinalMiddleware";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @export
 * @class UsersService
 */
export class UsersService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }


  public async createUser(
    userCreationParams: IUserCreationParams
  ): Promise<IUser> {
    console.log("hello service");

    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        console.log("hello context");

        var userCreated = bcrypt
          .hash(userCreationParams.password, 10)
          .then(async (hash) => {
            const userObject = {
              type: USER_TYPE,
              name: userCreationParams.userName,
              userName: userCreationParams.userName,
              password: hash,
              userProfileId: userCreationParams.userProfileId,
              role: userCreationParams.role,
            };
            if (userObject.role !== "authAdmin" && userObject.userName !== "authAdmin") {
              const UserId = SpinalGraphService.createNode(userObject, undefined);

              const res = await SpinalGraphService.addChildInContext(
                context.getId().get(),
                UserId,
                context.getId().get(),
                AUTH_SERVICE_USER_RELATION_NAME,
                AUTH_SERVICE_RELATION_TYPE_PTR_LST
              );

              return {
                id: res.getId().get(),
                type: res.getType().get(),
                userName: res.info.userName.get(),
                role: res.info.role.get(),
              };
            } else {
              return undefined
            }

          });
        if (userCreated === undefined) {
          throw new OperationError(
            "UNAUTHORIZED ROLE",
            HttpStatusCode.UNAUTHORIZED
          );
        } else return userCreated;
      }
    }
  }
  public async login(userLoginParams: IUserLoginParams): Promise<string> {
    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const users = await context.getChildren(
          AUTH_SERVICE_USER_RELATION_NAME
        );
        for (const user of users) {
          if (userLoginParams.userName === user.info.userName.get()) {
            return bcrypt
              .compare(userLoginParams.password, user.info.password.get())
              .then((valid) => {
                if (!valid) {

                  throw new OperationError(
                    "NOT_FOUND",
                    HttpStatusCode.NOT_FOUND
                  );
                } else {
                  return {
                    userId: user.getId().get(),
                    token: jwt.sign(
                      { userId: user.getId().get() },
                      "RANDOM_TOKEN_SECRET",
                      { expiresIn: "24h" }
                    ),
                  };
                }
              });
          }
        }
        throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
      }
    }
  }

  public async getUsers(): Promise<IUser[]> {
    try {
      var usersObjectList = [];
      const contexts = await this.graph.getChildren("hasContext");
      for (const context of contexts) {
        if (context.getName().get() === USER_LIST) {
          const users = await context.getChildren(
            AUTH_SERVICE_USER_RELATION_NAME
          );
          for (const user of users) {
            var userObject: IUser = {
              id: user.getId().get(),
              type: user.getType().get(),
              userName: user.info.userName.get(),
              password: user.info.password.get(),
              role: user.info.role.get(),
            };
            usersObjectList.push(userObject);
          }
        }
      }

      return usersObjectList;
    } catch (error) {
      return error;
    }
  }

  public async getUser(id): Promise<IUser> {
    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        console.log("context", context.getName().get());

        const users = await context.getChildren(
          AUTH_SERVICE_USER_RELATION_NAME
        );
        for (const user of users) {
          if (user.getId().get() === id) {
            var userObject: IUser = {
              id: user.getId().get(),
              type: user.getType().get(),
              userName: user.getName().get(),
              password: user.info.password.get(),
              role: user.info.role.get(),
            };
            //return userObject;
          }
        }
      }
    }
    if (userObject) {
      return userObject;
    } else {
      throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
    }
  }



  public async updateUser(userId: string, requestBody: IUserUpdateParams): Promise<IUser> {
    const context = await SpinalGraphService.getContext(USER_LIST);
    const users = await context.getChildren(AUTH_SERVICE_USER_RELATION_NAME);
    var userObject: IUser;
    for (const user of users) {
      if (user.getId().get() === userId) {
        if (requestBody.userName !== undefined) {

          user.info.userName.set(requestBody.userName)
          user.info.name.set(requestBody.userName)

        } else if (user.info.password !== undefined) {
          user.info.password.set(requestBody.password)
        } else if (requestBody.role !== undefined && user.info.role !== "authAdmin") {
          user.info.role.set(requestBody.role)
        }

        userObject = {
          id: user.getId().get(),
          type: user.getType().get(),
          userName: user.getName().get(),
          password: user.info.password.get(),
          role: user.info.role.get(),
        };
      }
    }
    return userObject
  }

  public async deleteUser(userId: string): Promise<void> {
    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const users = await context.getChildren(
          AUTH_SERVICE_USER_RELATION_NAME
        );
        for (const user of users) {
          if (user.getId().get() === userId) {
            await user.removeFromGraph();
          }
        }
      }
    }
  }


  async createAuthAdmin(): Promise<IUser> {

    let userCreationParams: IUserCreationParams = {
      userName: "authAdmin",
      password: "spinalcom",
      userProfileId: "",
      role: "authAdmin",
    }
    const contexts = await this.graph.getChildren("hasContext");
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        var userCreated = bcrypt
          .hash(userCreationParams.password, 10)
          .then(async (hash) => {
            const userObject = {
              type: USER_TYPE,
              name: userCreationParams.userName,
              userName: userCreationParams.userName,
              password: hash,
              userProfileId: userCreationParams.userProfileId,
              role: userCreationParams.role,
            };
            if (userObject.role === "authAdmin" && userObject.userName === "authAdmin") {
              const UserId = SpinalGraphService.createNode(userObject, undefined);
              const res = await SpinalGraphService.addChildInContext(
                context.getId().get(),
                UserId,
                context.getId().get(),
                AUTH_SERVICE_USER_RELATION_NAME,
                AUTH_SERVICE_RELATION_TYPE_PTR_LST
              );

              return {
                id: res.getId().get(),
                type: res.getType().get(),
                userName: res.info.userName.get(),
                role: res.info.role.get(),
              };
            } else {
              return undefined
            }

          });
        if (userCreated === undefined) {
          throw new OperationError(
            "UNAUTHORIZED ROLE",
            HttpStatusCode.UNAUTHORIZED
          );
        } else return userCreated;
      }
    }
  }
}

