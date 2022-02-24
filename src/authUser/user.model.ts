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
 * @export
 * @interface User
 */
export interface IUser {
  id: string | number;
  type: string;
  name: string; //nom du noeud du graph
  userName: string;
  password: string;
  email?: string;
  telephone?: string;
  info?: string; // champs libre optionnel
  userType: IUserType;
  userProfileList: string[];
  platformList: string[];
}

export enum IUserType {
  'authAdmin' = 'authAdmin',
  'superUser' = 'superUser',
  'simpleUser' = 'simpleUser',
}
/**
 * @export
 * @interface IUserCreationParams
 */
export interface IUserCreationParams {
  userName: string;
  password: string;
  email?: string;
  telephone?: string;
  info?: string; // champs libre optionnel
  userType: IUserType;
  userProfileList: string[];
  platformList: string[];
}

export interface IUserUpdateParams {
  userName?: string;
  password?: string;
  email?: string;
  telephone?: string;
  info?: string; // champs libre optionnel
  userType?: IUserType;
  userProfileList?: string[];
  platformList?: string[];
}

export interface IUserLoginParams {
  userName: string;
  password: string;
}
export interface IUserProfile {
  id: string;
  name: string;
  graphId?: string;
  appList?: {
    data: {
      name: string;
      id: string;
    };
    role: {
      id: string;
      name: string;
    }[];
  }[];
}
