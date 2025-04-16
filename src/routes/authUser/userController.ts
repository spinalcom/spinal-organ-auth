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
import { IUser, IUserCreationParams, IUserUpdateParams, IUserLoginParams, IAuthAdminUpdateParams, IUserLogs, IUpdateUserPassword } from "./user.model";
import { UserService } from "./userService";
import { IUserToken } from "../tokens/token.model";
import { HttpStatusCode } from "../../utilities/http-status-code";

@Route("users")
export class UsersController extends Controller {
	@Security("jwt", ["authAdmin:write"])
	@SuccessResponse("201", "Created") // Custom success response
	@Post()
	public async createUser(@Body() requestBody: IUserCreationParams): Promise<IUser | { error: string }> {
		try {
			let user = await UserService.getInstance().createUser(requestBody);
			this.setStatus(HttpStatusCode.CREATED);
			return user;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read"])
	@Get()
	public async getUsers(): Promise<IUser[] | { error: string }> {
		try {
			const users = await UserService.getInstance().getUsers();
			this.setStatus(HttpStatusCode.OK);
			return users;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read", "ownData:read"])
	@Get("{userId}")
	public async getUser(@Path() userId: string): Promise<IUser | { error: string }> {
		try {
			const user = await UserService.getInstance().getUser(userId);
			this.setStatus(HttpStatusCode.OK);
			return user;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read", "ownData:read"])
	@Post("userInfo")
	public async getUserInfoByToken(@Body() body: { token: string }): Promise<IUser | { error: string }> {
		try {
			const user = await UserService.getInstance().getUserInfoByToken(body.token);
			this.setStatus(HttpStatusCode.OK);
			return user;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:delete"])
	@Delete("{userId}")
	public async deleteUser(@Path() userId: string): Promise<void | { error?: string; message?: string }> {
		try {
			await UserService.getInstance().deleteUser(userId);
			this.setStatus(HttpStatusCode.OK);
			return { message: "User deleted" };
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:write"])
	@Put("{userId}")
	public async updateUser(@Path() userId: string, @Body() requestBody: IUserUpdateParams): Promise<IUser | { error: string }> {
		try {
			const userUpdated = await UserService.getInstance().updateUser(userId, requestBody);
			this.setStatus(HttpStatusCode.OK);
			return userUpdated;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:write"])
	@Put("{userId}/updatePassword")
	public async updateUserPassword(@Path() userId: string, @Body() requestBody: IUpdateUserPassword): Promise<any | { error: string }> {
		try {
			const userUpdated = await UserService.getInstance().updateUserPassword(userId, requestBody);
			this.setStatus(HttpStatusCode.OK);
			return userUpdated;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:write"])
	@Put()
	public async updateAuthAdmin(@Body() requestBody: IAuthAdminUpdateParams): Promise<IUser | { error: string }> {
		try {
			const adminUpdated = await UserService.getInstance().updateAuthAdmin(requestBody);
			this.setStatus(HttpStatusCode.OK);
			return adminUpdated;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read"])
	@Post("/getAuthAdmin")
	public async getAuthAdmin(): Promise<IUser | { error: string }> {
		try {
			const authAdmin = await UserService.getInstance().getAuthAdmin();
			this.setStatus(HttpStatusCode.OK);
			return authAdmin;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:write"])
	@Post("/userProfilesList")
	public async userProfilesList(): Promise<any[] | { error: string }> {
		try {
			const profileList = await UserService.getInstance().userProfilesList();
			this.setStatus(HttpStatusCode.OK);
			return profileList;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("all")
	@Post("/login")
	public async login(@Body() requestBody: IUserLoginParams): Promise<IUserToken | { error: string }> {
		try {
			const userToken = await UserService.getInstance().login(requestBody);
			this.setStatus(HttpStatusCode.OK);
			return userToken;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("all")
	@Post("/loginAuthAdmin")
	public async loginAuthAdmin(@Body() requestBody: IUserLoginParams): Promise<IUserToken | { error: string }> {
		try {
			const userToken = await UserService.getInstance().loginAuthAdmin(requestBody);
			this.setStatus(HttpStatusCode.OK);
			return userToken;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("all")
	@Post("/getRoles")
	public async getRoles(): Promise<{ name: string }[] | { error: string }> {
		try {
			const roles = await UserService.getInstance().getRoles();
			this.setStatus(HttpStatusCode.OK);
			return roles;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}
	@Security("jwt", ["authAdmin:read"])
	@Get("{userId}/userLogs")
	public async getUserLogs(@Path() userId: string): Promise<IUserLogs[] | { error: string }> {
		try {
			const logs = await UserService.getInstance().getUserLogs(userId);
			this.setStatus(HttpStatusCode.OK);
			return logs;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}
}
