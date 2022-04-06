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
  PLATFORM_LIST,
  AUTH_SERVICE_PLATFORM_RELATION_NAME,
  PLATFORM_TYPE,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
  AUTH_SERVICE_ORGAN_RELATION_NAME,
  REGISTER_KEY_TYPE,
  INFO_ADMIN_TYPE,
  AUTH_SERVICE_INFO_ADMIN_RELATION_NAME,
  INFO_ADMIN,
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
  IPlatform,
  IPlateformCreationParams,
  IPlatformUpdateParams,
  statusPlatform,
  IRegisterParams,
  IRegisterKeyObject,
} from './platform.model';
import SpinalMiddleware from '../spinalMiddleware';
import { IOrgan } from '../organ/organ.model';
import { IUserProfile } from './userProfile.model';
import { IAppProfile } from './appProfile.model';
import { ProfileServices } from './profileServices';
import { OrganService } from '../organ/organService';
import jwt = require('jsonwebtoken');

/**
 *
 *
 * @export
 * @class PlatformService
 */
export class PlatformService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }

  public async createPlateform(
    platformCreationParms: IPlateformCreationParams
  ): Promise<IPlatform> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platformObject: IPlateformCreationParams = {
          type: PLATFORM_TYPE,
          name: platformCreationParms.name,
          url: platformCreationParms.url,
          statusPlatform: platformCreationParms.statusPlatform,
          TokenBosAdmin: this.generateTokenBosAdmin(platformCreationParms.name),
          TokenAdminBos: platformCreationParms.TokenAdminBos,
          bosId: platformCreationParms.bosId,
        };
        const PlatformId = SpinalGraphService.createNode(
          platformObject,
          undefined
        );
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          PlatformId,
          context.getId().get(),
          AUTH_SERVICE_PLATFORM_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
        // @ts-ignore
        SpinalGraphService._addNode(res);

        return {
          id: res.getId().get(),
          type: res.getType().get(),
          name: res.getName().get(),
          statusPlatform: res.info.statusPlatform.get(),
          url: res.info.url.get(),
          TokenBosAdmin: res.info.TokenBosAdmin.get(),
          TokenAdminBos: res.info.TokenAdminBos.get(),
          bosId: res.info.bosId.get(),
        };
      }
    }
  }

  public async getPlateform(id): Promise<IPlatform> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          AUTH_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            var PlatformObject: IPlatform = {
              id: platform.getId().get(),
              type: platform.getType().get(),
              name: platform.getName().get(),
              statusPlatform: platform.info.statusPlatform.get(),
              url: platform.info.url.get(),
              TokenBosAdmin: platform.info.TokenBosAdmin.get(),
              TokenAdminBos: platform.info.TokenAdminBos.get(),
              bosId: platform.info.bosId.get(),
            };
          }
        }
      }
    }
    if (PlatformObject) {
      return PlatformObject;
    } else {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }
  public async getPlateforms(): Promise<IPlatform[]> {
    try {
      var platformObjectList = [];
      const contexts = await this.graph.getChildren('hasContext');
      for (const context of contexts) {
        if (context.getName().get() === PLATFORM_LIST) {
          const platforms = await context.getChildren(
            AUTH_SERVICE_PLATFORM_RELATION_NAME
          );
          for (const platform of platforms) {
            var PlatformObject: IPlatform = {
              id: platform.getId().get(),
              type: platform.getType().get(),
              name: platform.getName().get(),
              statusPlatform: platform.info.statusPlatform.get(),
              url: platform.info.url.get(),
              TokenBosAdmin: platform.info.TokenBosAdmin.get(),
              TokenAdminBos: platform.info.TokenAdminBos.get(),
              bosId: platform.info.bosId.get(),
            };
            platformObjectList.push(PlatformObject);
          }
        }
      }
      return platformObjectList;
    } catch (error) {
      return error;
    }
  }
  public async updatePlateform(
    id: string,
    requestBody: IPlatformUpdateParams
  ): Promise<IPlatform> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          AUTH_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            platform.info.name.set(requestBody.name);
            platform.info.statusPlatform.set(requestBody.statusPlatform);
            platform.info.url.set(requestBody.url);

            return {
              id: platform.getId().get(),
              type: platform.getType().get(),
              name: platform.getName().get(),
              statusPlatform: platform.info.statusPlatform.get(),
              url: platform.info.url.get(),
              TokenBosAdmin: platform.info.TokenBosAdmin.get(),
              TokenAdminBos: platform.info.TokenAdminBos.get(),
              bosId: platform.info.bosId.get(),
            };
          }
        }
      }
    }
  }

  public async deletePlatform(id: string): Promise<void> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          AUTH_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            await platform.removeFromGraph();
          }
        }
      }
    }
  }

  public async getOrgansFromPlatform(platformId: string): Promise<IOrgan[]> {
    try {
      var organsObjectList = [];
      const contexts = await this.graph.getChildren('hasContext');
      for (const context of contexts) {
        if (context.getName().get() === PLATFORM_LIST) {
          const platforms = await context.getChildren(
            AUTH_SERVICE_PLATFORM_RELATION_NAME
          );
          for (const platform of platforms) {
            if (platform.getId().get() === platformId) {
              var organs = await platform.getChildren('HasOrgan');
              for (const organ of organs) {
                var OrganObject: IOrgan = {
                  id: organ.getId().get(),
                  type: organ.getType().get(),
                  name: organ.getName().get(),
                  statusOrgan: organ.info.statusOrgan.get(),
                  organType: organ.info.organType.get(),
                  platformId: organ.info.platformId.get(),
                };
                organsObjectList.push(OrganObject);
              }
            }
          }
        }
      }
      return organsObjectList;
    } catch (error) {
      return error;
    }
  }

  public async createAuthPlateform(): Promise<IPlatform> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const platformObject: IPlateformCreationParams = {
          name: 'authenticationPlatform',
          type: PLATFORM_TYPE,
          statusPlatform: statusPlatform.online,
          url: process.env.SPINALHUB_URL,
          TokenBosAdmin: '',
          TokenAdminBos: '',
          bosId: '',
        };
        const PlatformId = SpinalGraphService.createNode(
          platformObject,
          undefined
        );
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          PlatformId,
          context.getId().get(),
          AUTH_SERVICE_PLATFORM_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
        return {
          id: res.getId().get(),
          type: res.getType().get(),
          name: res.getName().get(),
          statusPlatform: res.info.statusPlatform.get(),
          url: res.info.url.get(),
          TokenBosAdmin: res.info.TokenBosAdmin.get(),
          TokenAdminBos: res.info.TokenAdminBos.get(),
          bosId: res.info.bosId.get(),
        };
      }
    }
  }

  public async createRegisterKeyNode(): Promise<IRegisterKeyObject> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === 'infoAdmin') {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const registerKeyObject = {
          name: 'registerKey',
          type: REGISTER_KEY_TYPE,
          value: this.generateRegisterKey(),
        };
        const regesterKeyId = SpinalGraphService.createNode(
          registerKeyObject,
          undefined
        );
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          regesterKeyId,
          context.getId().get(),
          AUTH_SERVICE_INFO_ADMIN_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
        return {
          id: res.getId().get(),
          type: res.getType().get(),
          name: res.getName().get(),
          value: res.info.value.get(),
        };
      }
    }
  }
  public generateRegisterKey() {
    const generator = require('generate-password');
    var registerKey = generator.generate({
      length: 20,
      numbers: true,
    });
    return registerKey;
  }

  public async updateRegisterKeyNode(): Promise<IRegisterKeyObject> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === INFO_ADMIN) {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const childrens = await context.getChildren(
          AUTH_SERVICE_INFO_ADMIN_RELATION_NAME
        );
        for (const child of childrens) {
          if (child.getName().get() === 'registerKey') {
            child.info.value.set(this.generateRegisterKey());
            return {
              id: child.getId().get(),
              type: child.getType().get(),
              name: child.getName().get(),
              value: child.info.value.get(),
            };
          }
        }
      }
    }
  }

  public generateTokenBosAdmin(platformName: string) {
    let token = jwt.sign(
      { platformName: platformName },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '24h',
      }
    );
    // let decodedToken = jwt_decode(token);
    return token;
  }

  public async registerNewPlatform(
    object: IRegisterParams
  ): Promise<IPlatform | string> {
    const contexts = await this.graph.getChildren('hasContext');
    var registerKey: string;
    for (const context of contexts) {
      if (context.getName().get() === INFO_ADMIN) {
        const childrens = await context.getChildren(
          AUTH_SERVICE_INFO_ADMIN_RELATION_NAME
        );
        registerKey = childrens[0].info.value.get();
      }
    }
    if (object.registerKey === registerKey) {
      const res = await this.createPlateform(object.platformCreationParms);
      return res;
    } else {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }

  public async updateNewPlatform(updateParams) {
    // if (updateParams.TokenBosAdmin === process.env.TOKEN_BOS_ADMIN) {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platformList = await context.getChildren('HasPlatform');
        for (const platform of platformList) {
          // @ts-ignore
          SpinalGraphService._addNode(platform);
          if (platform.getId().get() === updateParams.platformId) {
            if (
              platform.info.TokenBosAdmin.get() === updateParams.TokenBosAdmin
            ) {
              //add organ list from json data
              for (const organ of updateParams.jsonData.organList) {
                const organService = new OrganService();
                organService.createOrgan({
                  name: organ.label,
                  organType: organ.type,
                  statusOrgan: 'online',
                  platformId: platform.getId().get(),
                });
              }
              const profileServices = new ProfileServices();
              //add user profile list from json data
              for (const userProfile of updateParams.jsonData.userProfileList) {
                profileServices.createUserProfileService({
                  userProfileId: userProfile.userProfileId,
                  name: userProfile.label,
                  platformId: platform.getId().get(),
                });
              }
              //add user profile list from json data
              for (const appProfile of updateParams.jsonData.appProfileList) {
                profileServices.createAppProfileService({
                  appProfileId: appProfile.appProfileId,
                  name: appProfile.label,
                  platformId: platform.getId().get(),
                });
              }
            } else
              throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
          }
        }
      }
    }
  }

  public async getUserProfileList(id: string): Promise<any[]> {
    const contexts = await this.graph.getChildren('hasContext');
    const _profileList = [];
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platformList = await context.getChildren('HasPlatform');
        for (const platform of platformList) {
          // @ts-ignore
          SpinalGraphService._addNode(platform);
          if (platform.getId().get() === id) {
            const profileList = await platform.getChildren('HasUserProfile');
            for (const profile of profileList) {
              let infoProfile = {
                id: profile.getId().get(),
                type: profile.getType().get(),
                name: profile.getName().get(),
                userProfileId: profile.info.userProfileId.get(),
                platformId: profile.info.platformId.get(),
              };
              _profileList.push(infoProfile);
            }
          }
        }
      }
    }
    return _profileList;
  }
}
