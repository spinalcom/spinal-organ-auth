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

// Type
export const AUTH_SERVICE_RELATION_TYPE_PTR_LST = 'PtrLst';
export const AUTH_SERVICE_RELATION_TYPE_LST_PTR = 'LstPtr';
export const USER_TYPE = 'AuthServiceUser';
export const USER_TOKEN_CATEGORY_TYPE = 'AuthServiceUserCategory';
export const APPLICATION_TYPE = 'AuthServiceApplication';
export const APPLICATION_TOKEN_CATEGORY_TYPE = 'AuthServiceApplicationCategory';

export const PLATFORM_TYPE = 'AuthServicePlatform';
export const ORGAN_TYPE = 'AuthServiceOrgan';
export const USER_PROFILE_TYPE = 'AuthServiceUserProfile';
export const APP_PROFILE_TYPE = 'AuthServiceAPPProfile';
export const TOKEN_TYPE = 'AuthServiceToken';
export const INFO_ADMIN_TYPE = 'AuthServiceInfoAdmin';
export const REGISTER_KEY_TYPE = 'AuthServiceRegisterKey';

// RelationName
export const AUTH_SERVICE_PLATFORM_RELATION_NAME = 'HasPlatform';
export const AUTH_SERVICE_ORGAN_RELATION_NAME = 'HasOrgan';
export const AUTH_SERVICE_USER_PROFILE_RELATION_NAME = 'HasUserProfile';
export const AUTH_SERVICE_APP_PROFILE_RELATION_NAME = 'HasAppProfile';
export const AUTH_SERVICE_USER_RELATION_NAME = 'HasUser';
export const AUTH_SERVICE_APPLICATION_RELATION_NAME = 'HasApplication';
export const AUTH_SERVICE_TOKEN_RELATION_NAME = 'HasToken';
export const AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME = 'HasCategoryToken';
export const AUTH_SERVICE_INFO_ADMIN_RELATION_NAME = 'HasRegisterKey';

//ContextName
export const PLATFORM_LIST = 'platformList';
export const USER_LIST = 'userList';
export const APPLICATION_LIST = 'applicationList';
export const TOKEN_LIST = 'tokenList';
export const INFO_ADMIN = 'infoAdmin';
