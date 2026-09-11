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
import { Body, Controller, Post, Route, Security, SuccessResponse, Tags } from "tsoa";
import { INotification, INotificationCreationParams } from "./notification.model";
import { NotificationService } from "./notificationServices";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { SCOPES } from "../../constant";

@Tags("Notification")
@Route("notification")
export class NotificationController extends Controller {
	@SuccessResponse("201", "Created") // Custom success response
	@Security("jwt", [SCOPES.authAdmin, SCOPES.notificationsCreate])
	@Post()
	public async createNotification(@Body() object: INotificationCreationParams): Promise<INotification | { error: string }> {
		try {
			const notification = await NotificationService.getInstance().createNotification(object);
			this.setStatus(HttpStatusCode.CREATED);
			return notification;
		} catch (error: any) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}
}
