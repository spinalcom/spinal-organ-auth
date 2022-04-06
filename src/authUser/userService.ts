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
  USER_LIST,
  AUTH_SERVICE_USER_RELATION_NAME,
  USER_TYPE,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
  TOKEN_TYPE,
  TOKEN_LIST,
  AUTH_SERVICE_TOKEN_RELATION_NAME,
} from '../constant';
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { expressAuthentication } from './authentication';
import { OperationError } from '../utilities/operation-error';
import { HttpStatusCode } from '../utilities/http-status-code';
import {
  IUser,
  IUserCreationParams,
  IUserUpdateParams,
  IUserLoginParams,
  IUserType,
} from './user.model';
import { IUserToken } from '../tokens/token.model';
import config from '../config';
import SpinalMiddleware from '../spinalMiddleware';
import data from './profileUserListData';
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');
import jwt_decode from 'jwt-decode';
/**
 * @export
 * @class UserService
 */
export class UserService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }

  public async createUser(
    userCreationParams: IUserCreationParams
  ): Promise<IUser> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        var userCreated = bcrypt
          .hash(userCreationParams.password, 10)
          .then(async (hash) => {
            const userObject = {
              type: USER_TYPE,
              name: userCreationParams.userName,
              userType: userCreationParams.userType,
              userName: userCreationParams.userName,
              email: userCreationParams.email,
              telephone: userCreationParams.telephone,
              info: userCreationParams.info,
              password: hash,
              platformList: userCreationParams.platformList,
            };
            if (
              userObject.userType !== 'authAdmin' &&
              userObject.userName !== 'authAdmin'
            ) {
              const UserId = SpinalGraphService.createNode(
                userObject,
                undefined
              );

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
                name: res.getName().get(),
                userName: res.info.userName.get(),
                password: res.info.password.get(),
                email: res.info.email.get(),
                telephone: res.info.telephone.get(),
                info: res.info.info.get(),
                userType: res.info.userType.get(),
                platformList: res.info.platformList.get(),
              };
            } else {
              return undefined;
            }
          });
        if (userCreated === undefined) {
          throw new OperationError(
            'UNAUTHORIZED ROLE',
            HttpStatusCode.UNAUTHORIZED
          );
        } else return userCreated;
      }
    }
  }
  public async login(userLoginParams: IUserLoginParams): Promise<IUserToken> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const users = await context.getChildren(
          AUTH_SERVICE_USER_RELATION_NAME
        );
        for (const user of users) {
          if (userLoginParams.userName === user.info.userName.get()) {
            return bcrypt
              .compare(userLoginParams.password, user.info.password.get())
              .then(async (valid) => {
                if (!valid) {
                  throw new OperationError(
                    'NOT_FOUND',
                    HttpStatusCode.NOT_FOUND
                  );
                } else {
                  let token = jwt.sign(
                    { userId: user.getId().get() },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                  );
                  let decodedToken = jwt_decode(token);
                  const tokenContext = SpinalGraphService.getContext(
                    TOKEN_LIST
                  );
                  const categoryTokenUserList = await tokenContext.getChildren(
                    'HasCategoryToken'
                  );
                  for (const categoryTokenUser of categoryTokenUserList) {
                    // @ts-ignore
                    SpinalGraphService._addNode(categoryTokenUser);
                    if (
                      categoryTokenUser.getType().get() ===
                      'AuthServiceUserCategory'
                    ) {
                      const TokenId = SpinalGraphService.createNode(
                        {
                          name: 'token_' + user.getName().get(),
                          type: TOKEN_TYPE,
                          token: token,
                          // @ts-ignore
                          createdToken: decodedToken.iat,
                          // @ts-ignore
                          expieredToken: decodedToken.exp,
                          userId: user.getId().get(),
                          userType: user.info.userType.get(),
                          platformList: user.info.platformList.get(),
                        },
                        undefined
                      );
                      const res = await SpinalGraphService.addChildInContext(
                        categoryTokenUser.getId().get(),
                        TokenId,
                        tokenContext.getId().get(),
                        AUTH_SERVICE_TOKEN_RELATION_NAME,
                        AUTH_SERVICE_RELATION_TYPE_PTR_LST
                      );
                      let tokenObj: IUserToken = {
                        name: res.getName().get(),
                        type: res.getType().get(),
                        token: token,
                        // @ts-ignore
                        createdToken: decodedToken.iat,
                        // @ts-ignore
                        expieredToken: decodedToken.exp,
                        userId: user.getId().get(),
                        userType: user.info.userType.get(),
                      };
                      return tokenObj;
                    }
                  }
                }
              });
          }
        }
        throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
      }
    }
  }

  public async getUsers(): Promise<IUser[]> {
    try {
      var usersObjectList = [];
      const context = SpinalGraphService.getContext(USER_LIST);
      const users = await context.getChildren('HasUser');
      for (const user of users) {
        console.log(user.getName().get());

        var userObject: IUser = {
          id: user.getId().get(),
          type: user.getType().get(),
          name: user.getName().get(),
          userName: user.info.userName.get(),
          password: user.info.password.get(),
          email: user.info.email.get(),
          telephone: user.info.telephone.get(),
          info: user.info.info.get(),
          userType: user.info.userType.get(),
          platformList: user.info.platformList.get(),
        };
        usersObjectList.push(userObject);
      }
      if (usersObjectList.length === 0) {
        throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
      } else {
        return usersObjectList;
      }
    } catch (error) {
      return error;
    }
  }

  public async userProfilesList(): Promise<any[]> {
    try {
      return data;
    } catch (error) {
      return error;
    }
  }

  public async getUser(id: string): Promise<IUser> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const users = await context.getChildren(
          AUTH_SERVICE_USER_RELATION_NAME
        );
        for (const user of users) {
          if (user.getId().get() === id) {
            var userObject: IUser = {
              id: user.getId().get(),
              type: user.getType().get(),
              name: user.getName().get(),
              userName: user.info.userName.get(),
              password: user.info.password.get(),
              email: user.info.email.get(),
              telephone: user.info.telephone.get(),
              info: user.info.info.get(),
              userType: user.info.userType.get(),
              platformList: user.info.platformList.get(),
            };
          }
        }
      }
    }
    if (userObject) {
      return userObject;
    } else {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }

  public async updateUser(
    userId: string,
    requestBody: IUserUpdateParams
  ): Promise<IUser> {
    const context = await SpinalGraphService.getContext(USER_LIST);
    const users = await context.getChildren(AUTH_SERVICE_USER_RELATION_NAME);
    var userObject: IUser;
    for (const user of users) {
      if (user.getId().get() === userId) {
        if (requestBody.userName !== undefined) {
          user.info.userName.set(requestBody.userName);
          user.info.name.set(requestBody.userName);
        }
        if (user.info.password !== undefined) {
          user.info.password.set(requestBody.password);
        }
        if (
          requestBody.userType !== undefined &&
          user.info.userType !== 'authAdmin'
        ) {
          user.info.userType.set(requestBody.userType);
        }

        userObject = {
          id: user.getId().get(),
          type: user.getType().get(),
          name: user.getName().get(),
          userName: user.info.userName.get(),
          password: user.info.password.get(),
          email: user.info.email.get(),
          telephone: user.info.telephone.get(),
          info: user.info.info.get(),
          userType: user.info.userType.get(),
          platformList: user.info.platformList.get(),
        };
      } else {
        throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
      }
    }
    return userObject;
  }

  public async deleteUser(userId: string): Promise<void> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const users = await context.getChildren(
          AUTH_SERVICE_USER_RELATION_NAME
        );
        for (const user of users) {
          if (user.getId().get() === userId) {
            await user.removeFromGraph();
          } else {
            throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
          }
        }
      }
    }
  }

  async createAuthAdmin(): Promise<IUser> {
    let userCreationParams: IUserCreationParams = {
      userName: 'authAdmin',
      password: process.env.AUTH_ADMIN_PASSWORD,
      email: 'spinalcom@spinalcom.com',
      telephone: '0123321234',
      info: '',
      userType: IUserType.authAdmin,
      platformList: [],
    };
    const contexts = await this.graph.getChildren('hasContext');
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
              email: userCreationParams.email,
              telephone: userCreationParams.telephone,
              info: '',
              userType: userCreationParams.userType,
              platformList: userCreationParams.platformList,
            };
            if (
              userObject.userType === 'authAdmin' &&
              userObject.userName === 'authAdmin'
            ) {
              const UserId = SpinalGraphService.createNode(
                userObject,
                undefined
              );
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
                name: res.getName().get(),
                userName: res.info.userName.get(),
                password: res.info.password.get(),
                email: res.info.email.get(),
                telephone: res.info.telephone.get(),
                info: res.info.info.get(),
                userType: res.info.userType.get(),
                userProfileList: res.info.userProfileList.get(),
                platformList: res.info.platformList.get(),
              };
            } else {
              return undefined;
            }
          });
        if (userCreated === undefined) {
          throw new OperationError(
            'UNAUTHORIZED ROLE',
            HttpStatusCode.UNAUTHORIZED
          );
        } else return userCreated;
      }
    }
  }

  public async getUserProfileByToken(verifyToken: string) {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === TOKEN_LIST) {
        let tokens = await context.getChildren(
          AUTH_SERVICE_TOKEN_RELATION_NAME
        );
        for (const token of tokens) {
          if (token.info.token.get() === verifyToken) {
            return {
              userProfileId: token.info.userProfileId.get(),
            };
          }
        }
      }
    }
  }
  public async getInfoToken(tokenParam: string) {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === TOKEN_LIST) {
        let tokens = await context.getChildren(
          AUTH_SERVICE_TOKEN_RELATION_NAME
        );
        for (const token of tokens) {
          if (token.info.token.get() === tokenParam) {
            return {
              name: token.info.name.get(),
              userProfileId: token.info.userProfileId.get(),
              token: token.info.token.get(),
              createdToken: token.info.createdToken.get(),
              expieredToken: token.info.expieredToken.get(),
              userId: token.info.userId.get(),
              userType: token.info.userType.get(),
              serverId: token.info.serverId.get(),
              id: token.info.id.get(),
            };
          }
        }
      }
    }
  }

  public async getRoles(): Promise<{ name: string }[]> {
    return [
      {
        name: 'Super User',
      },
      { name: 'Simple User' },
    ];
  }
}
