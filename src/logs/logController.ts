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
import { LogsService } from "./logService";
import { SCOPES } from "../constant";
@Route("logs")
export class LogsController extends Controller {
	@Security("jwt", ["authAdmin:read"])
	@Get()
	public async getLogs(): Promise<any[]> {
		this.setStatus(201); // set return status 201
		return LogsService.getInstance().getLogs();
	}

	@Security("jwt", ["authAdmin:read"])
	@Get("/getPlatformsLogs")
	public async getPlatformsLogs(): Promise<any[]> {
		this.setStatus(201); // set return status 201
		return LogsService.getInstance().getPlatformsLogs();
	}
}
