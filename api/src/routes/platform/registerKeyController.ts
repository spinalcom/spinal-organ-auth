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
import { IOrgan } from "../organ/organ.model";
import { IRegisterKeyObject } from "./platform.model";
import { PlatformService } from "./platformServices";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { SCOPES } from "../../constant";

@Route("registerKey")
export class RegisterKeyController extends Controller {
	@Security("jwt", ["authAdmin:write"])
	@Post()
	public async updateRegisterKeyNode(): Promise<IRegisterKeyObject | { error: string }> {
		try {
			const newRegisterKey = await PlatformService.getInstance().updateRegisterKeyNode();
			this.setStatus(HttpStatusCode.OK);
			return newRegisterKey;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read"])
	@Get()
	public async getRegisterKeyNode(): Promise<IRegisterKeyObject | { error: string }> {
		try {
			const registerKey = await PlatformService.getInstance().getRegisterKeyNode();
			this.setStatus(HttpStatusCode.OK);
			return registerKey;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}
}
