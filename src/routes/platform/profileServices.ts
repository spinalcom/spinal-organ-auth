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
import { USER_PROFILE_TYPE, AUTH_SERVICE_RELATION_TYPE_PTR_LST, APP_PROFILE_TYPE, AUTH_SERVICE_USER_PROFILE_RELATION_NAME, AUTH_SERVICE_APP_PROFILE_RELATION_NAME } from "../../constant";
import { SpinalGraphService, SpinalGraph, SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";

import { IUserProfileCreationParams, IUserProfileUpdateParams, IUserProfile } from "./userProfile.model";

import { IAppProfileCreationParams, IAppProfileUpdateParams, IAppProfile } from "./appProfile.model";
import SpinalMiddleware from "../../spinalMiddleware";
import { PlatformService } from "./platformServices";
import { IAppPlatformProfile, IUserPlatformProfile } from "../tokens/token.model";

export class ProfileServices {
	static instance: ProfileServices;

	private constructor() { }

	static getInstance(): ProfileServices {
		if (this.instance === undefined) {
			this.instance = new ProfileServices();
		}
		return this.instance;
	}

	public async createUserProfileService(userProfileCreationParms: IUserProfileCreationParams): Promise<IUserProfile> {
		const platformContext = await PlatformService.getInstance().getContext();
		const [platform] = await PlatformService.getInstance().getPlatformsNodes(userProfileCreationParms.platformId);

		const userNode = new SpinalNode(userProfileCreationParms.name, USER_PROFILE_TYPE);
		userNode.info.add_attr({
			platformId: userProfileCreationParms.platformId,
			userProfileId: userProfileCreationParms.userProfileId,
		});

		const res = await platform.addChildInContext(userNode, AUTH_SERVICE_USER_PROFILE_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, platformContext);

		return {
			id: res.getId().get(),
			userProfileId: res.info.userProfileId.get(),
			name: res.getName().get(),
			type: res.getType().get(),
			platformId: res.info.platformId.get(),
		};
	}

	public async createAppProfileService(appProfileCreationParms: IAppProfileCreationParams): Promise<IAppProfile> {
		const platformContext = await PlatformService.getInstance().getContext();
		const [platform] = await PlatformService.getInstance().getPlatformsNodes(appProfileCreationParms.platformId);

		const appNode = new SpinalNode(appProfileCreationParms.name, APP_PROFILE_TYPE);
		appNode.info.add_attr({
			appProfileId: appProfileCreationParms.appProfileId,
			platformId: appProfileCreationParms.platformId,
		});

		const res = await platform.addChildInContext(appNode, AUTH_SERVICE_APP_PROFILE_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, platformContext);

		return {
			id: res.getId().get(),
			appProfileId: res.info.appProfileId.get(),
			name: res.getName().get(),
			type: res.getType().get(),
			platformId: res.info.platformId.get(),
		};
	}

	public async getUserProfileService(platformId: string): Promise<(IUserProfile & { platform?: any })[]> {
		const [platform] = await PlatformService.getInstance().getPlatformsNodes(platformId);

		const userProfileList = await platform.getChildren(AUTH_SERVICE_USER_PROFILE_RELATION_NAME);

		return userProfileList.map((userProfile) => ({
			id: userProfile.getId().get(),
			type: userProfile.getType().get(),
			name: userProfile.getName().get(),
			userProfileId: userProfile.info.userProfileId.get(),
			platformId: userProfile.info.platformId.get(),
			platform: platform?.info?.get()

		}));
	}

	public async getAppProfileService(platformId: string): Promise<(IAppProfile & { platform?: any })[]> {
		const [platform] = await PlatformService.getInstance().getPlatformsNodes(platformId);

		const appProfileList = await platform.getChildren(AUTH_SERVICE_APP_PROFILE_RELATION_NAME);

		return appProfileList.map((appProfile) => ({
			id: appProfile.getId().get(),
			type: appProfile.getType().get(),
			name: appProfile.getName().get(),
			appProfileId: appProfile.info.appProfileId.get(),
			platformId: appProfile.info.platformId.get(),
			platform: platform?.info?.get()
		}));
	}



	public async findUserProfile(platformId: string, userProfileId: string): Promise<IUserPlatformProfile> {
		const profiles = await this.getUserProfileService(platformId);
		const found = profiles.find((profile) => profile.userProfileId === userProfileId);
		if (!found) return null;

		return {
			platformId: found?.platform.id,
			platformName: found?.platform.name,
			idPlatformOfAdmin: found?.platform.idPlatformOfAdmin,
			userProfile: {
				userProfileAdminId: found.id,
				userProfileBosConfigId: found.userProfileId,
				userProfileName: found.name
			}
		}
	}

	public async findAppProfile(platformId: string, appProfileId: string): Promise<IAppPlatformProfile> {
		const profiles = await this.getAppProfileService(platformId);
		const found = profiles.find((profile) => profile.appProfileId === appProfileId);
		if (!found) return null;

		return {
			platformId: found.platform.id,
			platformName: found.platform.name,
			idPlatformOfAdmin: found.platform.info.idPlatformOfAdmin,
			appProfile: {
				appProfileAdminId: found.id,
				appProfileBosConfigId: found.appProfileId,
				appProfileName: found.name,
			},
		}
	}

	public async findProfile(platformId: string, profileId: string): Promise<IUserPlatformProfile | IAppPlatformProfile> {
		const userProfile = await this.findUserProfile(platformId, profileId);
		if (userProfile) return userProfile;

		return this.findAppProfile(platformId, profileId);
	}

}
