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
} from 'spinal-core-connectorjs_type';

import {
  APPLICATION_LIST,
  AUTH_SERVICE_APPLICATION_RELATION_NAME,
  APPLICATION_TYPE,
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

import { OperationError } from '../utilities/operation-error';
import { HttpStatusCode } from '../utilities/http-status-code';
import {
  IApplication,
  IApplicationCreationParams,
  IApplicationUpdateParams,
  IApplicationLoginParams,
  IApplicationLogs
} from './application.model';
import { IApplicationToken } from '../tokens/token.model';
import SpinalMiddleware from '../spinalMiddleware';
import { LogsService } from '../logs/logService';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import jwt_decode from 'jwt-decode';

export class ApplicationService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  public logService: LogsService;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
    this.logService = new LogsService();

  }


  public async getProfile(platformId: string, profileIdBosConfig: string) {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === 'platformList') {
        const platforms = await context.getChildren('HasPlatform')
        for (const platform of platforms) {
          if (platform.getId().get() === platformId) {
            const appProfiles = await platform.getChildren('HasAppProfile');
            for (const profile of appProfiles) {
              if (profile.info.appProfileId.get() === profileIdBosConfig) {
                return profile;
              }
            }
          }
        }
      }
    }
  }


  public async createApplication(
    applicationCreationParams: IApplicationCreationParams
  ): Promise<IApplication> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === APPLICATION_LIST) {
        const applicationObject = {
          type: APPLICATION_TYPE,
          name: applicationCreationParams.name,
          appType: applicationCreationParams.appType,
          clientId: applicationCreationParams.clientId,
          clientSecret: applicationCreationParams.clientSecret,
        };
        const ApplicationId = SpinalGraphService.createNode(
          applicationObject,
          undefined
        );
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          ApplicationId,
          context.getId().get(),
          AUTH_SERVICE_APPLICATION_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );

        for (const platform of applicationCreationParams.platformList) {
          const pro = await this.getProfile(platform.platformId, platform.appProfile.appProfileId);
          // @ts-ignore
          SpinalGraphService._addNode(pro)
          await SpinalGraphService.addChild(res.getId().get(), pro.getId().get(), 'HasAppProfile', AUTH_SERVICE_RELATION_TYPE_PTR_LST)
        }

        if (res !== undefined) {
          await this.logService.createLog(res, 'ApplicationLogs', 'Create', 'Create Valid', "Create Valid");
          return {
            id: res.getId().get(),
            type: res.getType().get(),
            name: res.getName().get(),
            appType: res.info.appType.get(),
            clientId: res.info.clientId.get(),
            clientSecret: res.info.clientSecret.get(),
            // platformList: res.info.platformList.get(),
          };
        } else {
          await this.logService.createLog(res, 'ApplicationLogs', 'Create', 'Create Not Valid', "Create Not Valid");
          throw new OperationError('NOT_CREATED', HttpStatusCode.BAD_REQUEST);
        }
      }
    }
  }

  public async login(
    applicationLoginParams: IApplicationLoginParams
  ): Promise<IApplicationToken> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === APPLICATION_LIST) {
        const applications = await context.getChildren(
          AUTH_SERVICE_APPLICATION_RELATION_NAME
        );
        for (const app of applications) {
          if (
            applicationLoginParams.clientId === app.info.clientId.get()
          ) {
            if (applicationLoginParams.clientSecret === app.info.clientSecret.get()
            ) {
              let token = jwt.sign(
                { applicationId: app.getId().get() },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              );
              let decodedToken = jwt_decode(token);
              const tokenContext = SpinalGraphService.getContext(TOKEN_LIST);
              const categoryTokenApplicationList = await tokenContext.getChildren(
                'HasCategoryToken'
              );
              for (const categoryTokenApplication of categoryTokenApplicationList) {
                // @ts-ignore
                SpinalGraphService._addNode(categoryTokenApplication);
                if (
                  categoryTokenApplication.getType().get() ===
                  'AuthServiceApplicationCategory'
                ) {
                  var platformList = [];
                  const appProfiles = await app.getChildren('HasAppProfile');
                  for (const appProfile of appProfiles) {
                    const platformParents = await appProfile.getParents('HasAppProfile')
                    for (const platformParent of platformParents) {
                      if (platformParent !== undefined) {
                        if (platformParent.getType().get() === "AuthServicePlatform") {
                          platformList.push({
                            platformId: platformParent.getId().get(),
                            platformName: platformParent.getName().get(),
                            idPlatformOfAdmin: platformParent.info.idPlatformOfAdmin?.get(),
                            appProfile: {
                              appProfileAdminId: appProfile.getId().get(),
                              appProfileBosConfigId: appProfile.info.appProfileId.get(),
                              appProfileName: appProfile.getName().get()
                            }
                          })
                        }
                      }
                    }
                  }

                  const TokenId = SpinalGraphService.createNode(
                    {
                      name: 'token_' + app.getName().get(),
                      type: TOKEN_TYPE,
                      token: token,
                      // @ts-ignore
                      createdToken: decodedToken.iat,
                      // @ts-ignore
                      expieredToken: decodedToken.exp,
                      applicationId: app.getId().get(),
                      platformList: platformList,
                    },
                    undefined
                  );
                  const res = await SpinalGraphService.addChildInContext(
                    categoryTokenApplication.getId().get(),
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
                    applicationId: app.getId().get(),
                    platformList: platformList,
                  };
                  await this.logService.createLog(app, 'ApplicationLogs', 'Connection', 'Login Valid', "Login Valid");
                  return tokenObj;
                }
              }
            } else {
              await this.logService.createLog(app, 'ApplicationLogs', 'Connection', 'Login Not Valid', "Login Not Valid Unknown Client Secret ");
              throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
            }
          }
        }
      }
    }
    await this.logService.createLog(undefined, 'ApplicationLogs', 'Connection', 'Login Not Valid', "Login Not Valid Unknown Client Id && Client Secret ");
    throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
  }

  public async getApplications(): Promise<any[]> {
    try {
      var applicationObjectList = [];
      const contexts = await this.graph.getChildren('hasContext');

      for (const context of contexts) {
        if (context.getName().get() === APPLICATION_LIST) {
          const applications = await context.getChildren(
            AUTH_SERVICE_APPLICATION_RELATION_NAME
          );
          for (const app of applications) {

            var platformList = [];
            const appProfiles = await app.getChildren('HasAppProfile');
            for (const appProfile of appProfiles) {
              const platformParents = await appProfile.getParents('HasAppProfile')
              for (const platformParent of platformParents) {
                if (platformParent !== undefined) {
                  if (platformParent.getType().get() === "AuthServicePlatform") {
                    platformList.push({
                      platformId: platformParent.getId().get(),
                      platformName: platformParent.getName().get(),
                      idPlatformOfAdmin: platformParent.info.idPlatformOfAdmin?.get(),
                      appProfile: {
                        appProfileAdminId: appProfile.getId().get(),
                        appProfileBosConfigId: appProfile.info.appProfileId.get(),
                        appProfileName: appProfile.getName().get()
                      }
                    })
                  }
                }
              }
            }

            var appObject = {
              id: app.getId().get(),
              type: app.getType().get(),
              name: app.getName().get(),
              appType: app.info.appType.get(),
              clientId: app.info.clientId.get(),
              clientSecret: app.info.clientSecret.get(),
              platformList: platformList,
            };
            applicationObjectList.push(appObject);
          }
        }
      }

      return applicationObjectList;
    } catch (error) {
      return error;
    }
  }

  public async getApplication(id: string): Promise<IApplication> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === APPLICATION_LIST) {
        const applications = await context.getChildren(
          AUTH_SERVICE_APPLICATION_RELATION_NAME
        );
        for (const app of applications) {
          if (app.getId().get() === id) {
            var platformList = [];
            const appProfiles = await app.getChildren('HasAppProfile');
            for (const appProfile of appProfiles) {
              const platformParents = await appProfile.getParents('HasAppProfile')
              for (const platformParent of platformParents) {
                if (platformParent !== undefined) {
                  if (platformParent.getType().get() === "AuthServicePlatform") {
                    platformList.push({
                      platformId: platformParent.getId().get(),
                      platformName: platformParent.getName().get(),
                      idPlatformOfAdmin: platformParent.info.idPlatformOfAdmin?.get(),
                      appProfile: {
                        appProfileAdminId: appProfile.getId().get(),
                        appProfileBosConfigId: appProfile.info.appProfileId.get(),
                        appProfileName: appProfile.getName().get()
                      }
                    })
                  }
                }
              }
            }

            var appObject: IApplication = {
              id: app.getId().get(),
              type: app.getType().get(),
              name: app.getName().get(),
              appType: app.info.appType.get(),
              clientId: app.info.clientId.get(),
              clientSecret: app.info.clientSecret.get(),
              platformList: platformList,
            };
          }
        }
      }
    }
    if (appObject) {
      return appObject;
    } else {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }

  public async updateApplication(
    applicationId: string,
    requestBody: IApplicationUpdateParams
  ): Promise<IApplication> {
    const context = await SpinalGraphService.getContext(APPLICATION_LIST);
    const applications = await context.getChildren(
      AUTH_SERVICE_APPLICATION_RELATION_NAME
    );
    var appObject: IApplication;
    for (const app of applications) {
      if (app.getId().get() === applicationId) {
        if (requestBody.name !== undefined) {
          app.info.name.set(requestBody.name);
        }
        if (app.info.clientId !== undefined) {
          app.info.clientId.set(requestBody.clientId);
        }
        if (app.info.clientSecret !== undefined) {
          app.info.clientSecret.set(requestBody.clientSecret);
        }
        if (app.info.appType !== undefined) {
          app.info.appType.set(requestBody.appType);
        }

        const oldAppProfileList = await app.getChildren('HasAppProfile');
        const newAppPlatformList = requestBody.platformList;
        await updateAppProfileList(oldAppProfileList, newAppPlatformList, app, this.graph);

        var platformList = [];
        const appProfiles = await app.getChildren('HasAppProfile');
        for (const appProfile of appProfiles) {
          const platformParents = await appProfile.getParents('HasAppProfile')
          for (const platformParent of platformParents) {
            if (platformParent !== undefined) {
              if (platformParent.getType().get() === "AuthServicePlatform") {
                platformList.push({
                  platformId: platformParent.getId().get(),
                  platformName: platformParent.getName().get(),
                  idPlatformOfAdmin: platformParent.info.idPlatformOfAdmin?.get(),
                  appProfile: {
                    appProfileAdminId: appProfile.getId().get(),
                    appProfileBosConfigId: appProfile.info.appProfileId.get(),
                    appProfileName: appProfile.getName().get()
                  }
                })
              }
            }
          }
        }
        appObject = {
          id: app.getId().get(),
          type: app.getType().get(),
          name: app.getName().get(),
          appType: app.info.appType.get(),
          clientId: app.info.clientId.get(),
          clientSecret: app.info.clientSecret.get(),
          platformList: platformList,
        };
        if (appObject === undefined) {
          await this.logService.createLog(app, 'ApplicationLogs', 'Edit', 'Edit Not Valid', 'Edit Not Valid');
          throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
        } else {
          await this.logService.createLog(app, 'ApplicationLogs', 'Edit', 'Edit Valid', 'Edit Valid');
          return appObject;
        }
      }
    }

  }

  public async deleteApplication(applicationId: string): Promise<void> {
    const contexts = await this.graph.getChildren('hasContext');
    var valid = false;
    for (const context of contexts) {
      if (context.getName().get() === APPLICATION_LIST) {
        const applications = await context.getChildren(
          AUTH_SERVICE_APPLICATION_RELATION_NAME
        );
        var appFound: SpinalNode<any>;
        for (const app of applications) {
          if (app.getId().get() === applicationId) {
            appFound = app;
          }
        }
        if (appFound !== undefined) {
          await this.logService.createLog(appFound, 'ApplicationLogs', 'Delete', 'Delete Valid', 'Delete Valid');
          await appFound.removeFromGraph();
        } else {
          await this.logService.createLog(appFound, 'ApplicationLogs', 'Delete', 'Delete Not Valid', 'Delete Not Valid, User Not Found');
          throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
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
              serverId: token.info.serverId.get(),
              id: token.info.id.get(),
            };
          }
        }
      }
    }
  }

  public async getApplicationLogs(id: string): Promise<IApplicationLogs[]> {
    var logArrayList: IApplicationLogs[] = [];
    var found: boolean = false;
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === APPLICATION_LIST) {
        const platforms = await context.getChildren(
          AUTH_SERVICE_APPLICATION_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            found = true;
            const logs = await platform.getChildren('HasLog');
            for (const log of logs) {
              var PlatformObjectLog: IApplicationLogs = {
                id: log.getId().get(),
                type: log.getType().get(),
                name: log.getName().get(),
                date: log.info.date.get(),
                message: log.info.message.get(),
                actor: {
                  actorId: log.info.actor.actorId.get(),
                  actorName: log.info.actor.actorName.get()
                }
              }
              logArrayList.push(PlatformObjectLog)
            }

          }
        }
      }
    }

    if (found === true) {
      return logArrayList;
    } else {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }
}


async function updateAppProfileList(oldAppProfileList: SpinalNode<any>[], newAppPlatformList: any[], app: SpinalNode<any>, graph: SpinalGraph<any>) {
  var arrayDelete = [];
  var arrayCreate = [];
  for (const olditem of oldAppProfileList) {
    const resSome = newAppPlatformList.some(it => {
      return it.appProfile.appProfileAdminId === olditem.getId().get();
    });
    if (resSome === false) {
      arrayDelete.push(olditem);
    }
  }
  for (const newItem of newAppPlatformList) {
    const resSome = oldAppProfileList.some(it => {
      return it.getId().get() === newItem.appProfile.appProfileAdminId;
    });
    if (resSome === false) {
      arrayCreate.push(newItem);
    }
  }
  for (const arrdlt of arrayDelete) {
    await app.removeChild(arrdlt, 'HasAppProfile', AUTH_SERVICE_RELATION_TYPE_PTR_LST)
  }
  for (const arrcrt of arrayCreate) {
    const realNode = await getrealNodeProfile(arrcrt.appProfile.appProfileAdminId, arrcrt.platformId, graph)
    await app.addChild(realNode, 'HasAppProfile', AUTH_SERVICE_RELATION_TYPE_PTR_LST);
  }
}

async function getrealNodeProfile(profileId: string, platformId: string, graph: SpinalGraph<any>) {
  const contexts: SpinalNode<any>[] = await graph.getChildren('hasContext');
  for (const context of contexts) {
    const platforms = await context.getChildren('HasPlatform');
    for (const platform of platforms) {
      if (platform.getId().get() === platformId) {
        const profiles = await platform.getChildren('HasAppProfile');
        for (const profile of profiles) {
          if (profile.getId().get() === profileId) {
            return profile;
          }
        }
      }
    }
  }

}