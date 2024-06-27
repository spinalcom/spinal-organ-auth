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
import { INotification, INotificationCreationParams } from "./notification.model";
import { NotificationService } from "./notificationServices";
import { HttpStatusCode } from "../utilities/http-status-code";

@Route("notification")
export class NotificationController extends Controller {
	@Security("jwt", ["authAdmin"])
	@SuccessResponse("201", "Created") // Custom success response
	@Post()
	public async createNotification(@Body() object: INotificationCreationParams): Promise<INotification | { error: string }> {
		try {
			// let platform = new PlatformService().registerNewPlatform(object);
			this.setStatus(HttpStatusCode.OK); // set return status 201rt
			return;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}
}
