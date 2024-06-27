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

import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, SuccessResponse } from "tsoa";

import { IApplication, IApplicationCreationParams, IApplicationUpdateParams, IApplicationLoginParams, IApplicationLogs } from "./application.model";
import { ApplicationService } from "./applicationService";
import { IApplicationToken } from "../tokens/token.model";
import { HttpStatusCode } from "../utilities/http-status-code";

let applicationService = ApplicationService.getInstance();

@Route("applications")
export class ApplicationsController extends Controller {
	@Security("jwt", ["authAdmin"])
	@SuccessResponse("201", "Created") // Custom success response
	@Post()
	public async createApplication(@Body() requestBody: IApplicationCreationParams): Promise<IApplication | { error: string }> {
		try {
			let application = await applicationService.createApplication(requestBody);
			this.setStatus(HttpStatusCode.CREATED); // set return status 201rt
			return application;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin"])
	@Get()
	public async getApplications(): Promise<any[] | { error: string }> {
		try {
			const applications = await applicationService.getApplications();
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return applications;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["ownData"])
	@Get("{applicationId}")
	public async getApplication(@Path() applicationId: string): Promise<IApplication | { error: string }> {
		try {
			const application = await applicationService.getApplication(applicationId);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return application;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin"])
	@Delete("{applicationId}")
	public async deleteApplication(@Path() applicationId: string): Promise<void | { message?: string; error?: string }> {
		try {
			const app = applicationService.deleteApplication(applicationId);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return { message: "Application deleted" };
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin"])
	@Put("{applicationId}")
	public async updateApplication(@Path() applicationId: string, @Body() requestBody: IApplicationUpdateParams): Promise<IApplication | { error: string }> {
		try {
			const updated = applicationService.updateApplication(applicationId, requestBody);

			this.setStatus(HttpStatusCode.OK); // set return status 201
			return updated;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("all")
	@Post("/login")
	public async login(@Body() requestBody: IApplicationLoginParams): Promise<IApplicationToken | { error: string }> {
		try {
			const appToken = await applicationService.login(requestBody);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return appToken;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin"])
	@Get("{applicationId}/applicationLogs")
	public async getApplicationLogs(@Path() applicationId: string): Promise<IApplicationLogs[] | { error: string }> {
		try {
			const application = await applicationService.getApplicationLogs(applicationId);
			this.setStatus(HttpStatusCode.OK);
			return application;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}
}
