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

import { Controller, Get, Route, Security, Tags } from "tsoa";
import { LogsService } from "./logService";
import { SCOPES } from "../../constant";
import { HttpStatusCode } from "../../utilities/http-status-code";

@Tags("Logs")
@Route("logs")
export class LogsController extends Controller {
	@Security("jwt", [SCOPES.authAdmin, SCOPES.logsRead])
	@Get()
	public async getLogs(): Promise<any[] | { error: string }> {
		try {
			this.setStatus(HttpStatusCode.OK);
			return await LogsService.getInstance().getLogs();
		} catch (error: any) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", [SCOPES.authAdmin, SCOPES.logsPlatformsRead])
	@Get("/getPlatformsLogs")
	public async getPlatformsLogs(): Promise<any[] | { error: string }> {
		try {
			this.setStatus(HttpStatusCode.OK);
			return await LogsService.getInstance().getPlatformsLogs();
		} catch (error: any) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}
}
