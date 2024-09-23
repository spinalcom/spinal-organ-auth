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

/**
 *
 *
 * @export
 * @interface IApplication
 */
export interface IApplication {
	id: string | number;
	type: string;
	name: string;
	appType: string;
	clientId: string;
	clientSecret: string;
	platformList?: {
		platformId: string;
		appProfile: {
			name: string;
			appProfileId: string;
		};
	}[];
}

/**
 *
 *
 * @export
 * @interface IApplicationCreationParams
 */
export interface IApplicationCreationParams {
	name: string;
	clientId: string;
	clientSecret: string;
	appType?: string;
	redirectUri?: string;
	grant_types?: string[];
	platformList?: {
		platformId: string;
		appProfile: {
			name: string;
			appProfileId: string;
		};
	}[];
}

/**
 *
 *
 * @export
 * @interface IApplicationUpdateParams
 */
export interface IApplicationUpdateParams {
	name?: string;
	clientId?: string;
	clientSecret?: string;
	appType?: string;
	platformList?: {
		platformId: string;
		platformName: string;
		appProfile: {
			appProfileAdminId: string;
			appProfileBosConfigId: string;
			appProfileName: string;
		};
	}[];
}

/**
 *
 *
 * @export
 * @interface IApplicationLoginParams
 */
export interface IApplicationLoginParams {
	clientId: string;
	clientSecret: string;
}
export interface IApplicationLogs {
	id: string;
	name: string;
	type: string;
	date: string;
	message: string;
	actor: {
		actorId: string;
		actorName: string;
	};
}
