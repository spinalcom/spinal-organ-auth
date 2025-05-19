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

/**
 *
 *
 * @export
 * @interface Token
 */

export interface IToken {
  id?: string;
  name: string;
  type?: string;
  token: string;
  createdToken?: number;
  expieredToken?: number;
}
export type IUserToken = IToken & {
  userId?: string;
  userType?: string;
  userProfile?: string;
  serverId?: string;
  platformList?: IUserPlatformProfile[];
}

export type IApplicationToken = IToken & {
  applicationId?: string;
  applicationProfileList?: string[];
  platformList?: IAppPlatformProfile[];
}

export type ICodeToken = IToken & {
  applicationId?: string;
  userId?: string;
  applicationProfileList?: string[];
  platformList?: (IAppPlatformProfile | IUserPlatformProfile)[];
}



export type IUserPlatformProfile = IPlatform & {
  userProfile: IUserProfile;
}


export type IAppPlatformProfile = IPlatform & {
  appProfile: IAppProfile;
}



export type ITokenActor = "user" | "application" | "code";

/////////////////////////////////////////////////////////////

type IPlatform = {
  platformId: string;
  platformName: string;
  idPlatformOfAdmin: string;
}

type IUserProfile = {
  userProfileAdminId: string;
  userProfileBosConfigId: string;
  userProfileName: string;
}

type IAppProfile = {
  appProfileAdminId: string;
  appProfileBosConfigId: string;
  appProfileName: string;
};