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

import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, SuccessResponse } from "tsoa";
import { IOrgan } from "../organ/organ.model";
import { IPlatform, IPlateformCreationParams, IPlatformUpdateParams, IRegisterKeyObject, IPlatformLogs } from "./platform.model";
import { IUserProfile } from "./userProfile.model";
import { IAppProfile } from "./appProfile.model";
import { PlatformService } from "./platformServices";
import { ProfileServices } from "./profileServices";
import { error } from "console";
import { HttpStatusCode } from "../utilities/http-status-code";
import { SCOPES } from "../constant";

@Route("platforms")
export class PlatformsController extends Controller {
	@Security("jwt", ["authAdmin:write"])
	@SuccessResponse("201", "Created") // Custom success response
	@Post()
	public async createPlateform(@Body() requestBody): Promise<any> {
		try {
			let platform = await PlatformService.getInstance().createPlateform(requestBody);
			this.setStatus(HttpStatusCode.CREATED); // set return status 201rt
			return platform;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read"])
	@Get()
	public async getPlatforms(): Promise<IPlatform[] | { error: string }> {
		try {
			const platforms = await PlatformService.getInstance().getPlateforms();
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return platforms;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read"])
	@Get("{platformId}")
	public async getPlateform(@Path() platformId: string): Promise<IPlatform | { error: string }> {
		try {
			const platform = await PlatformService.getInstance().getPlateform(platformId);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return platform;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:delete"])
	@Delete("{platformId}")
	public async deletePlatform(@Path() platformId: string): Promise<void | { message?: string; error?: string }> {
		try {
			await PlatformService.getInstance().deletePlatform(platformId);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return { message: "Platform deleted" };
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:write"])
	@Put("{platformId}")
	public async updatePlateform(@Path() platformId: string, @Body() requestBody: IPlatformUpdateParams): Promise<IPlatform | { error: string }> {
		try {
			const updated = await PlatformService.getInstance().updatePlateform(platformId, requestBody);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return updated;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read"])
	@Get("{platformId}/getUserProfileList")
	public async getUserProfileList(@Path() platformId: string): Promise<IUserProfile[] | { error: string }> {
		try {
			const userProfile = await ProfileServices.getInstance().getUserProfileService(platformId);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return userProfile;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read"])
	@Get("{platformId}/getAppProfileList")
	public async getAppProfileService(@Path() platformId: string): Promise<IAppProfile[] | { error: string }> {
		try {
			const appProfile = await ProfileServices.getInstance().getAppProfileService(platformId);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return appProfile;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read"])
	@Get("{platformId}/platformLogs")
	public async getPlatformLogs(@Path() platformId: string): Promise<IPlatformLogs[] | { error: string }> {
		try {
			const plateformLogs = await PlatformService.getInstance().getPlateformLogs(platformId);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return plateformLogs;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:write"])
	@Post("/registerKey")
	public async updateRegisterKeyNode(): Promise<IRegisterKeyObject | { error: string }> {
		try {
			const updated = await PlatformService.getInstance().updateRegisterKeyNode();
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return updated;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}
}
