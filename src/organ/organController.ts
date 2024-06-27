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
import { IOrganCreationParams, IOrganUpdateParams, IOrgan, statusOrgan } from "./organ.model";
import { OrganService } from "./organService";
import { HttpStatusCode } from "../utilities/http-status-code";

@Route("organs")
export class OrgansController extends Controller {
	@Security("jwt", ["authAdmin"])
	@SuccessResponse("201", "Created") // Custom success response
	@Post("{platformId}")
	public async createOrgan(@Body() requestBody: IOrganCreationParams): Promise<IOrgan | { error: string }> {
		try {
			let organ = OrganService.getInstance().createOrgan(requestBody);
			this.setStatus(HttpStatusCode.CREATED); // set return status 201rt
			return organ;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin"])
	@Get("{platformId}")
	public async getOrgans(@Path() platformId: string): Promise<IOrgan[] | { error: string }> {
		try {
			const organs = await OrganService.getInstance().getOrgans(platformId);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return organs;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin"])
	@Put("{organId}")
	public async updatePlateform(@Path() organId: string, @Body() requestBody: IOrganUpdateParams): Promise<IOrgan | { error: string }> {
		try {
			const updated = await OrganService.getInstance().updateOrgan(organId, requestBody);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return updated;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}
}
