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

import { Model, Ptr, spinalCore, FileSystem } from "spinal-core-connectorjs_type";
import { USER_LIST, AUTH_SERVICE_USER_RELATION_NAME, USER_TYPE, AUTH_SERVICE_RELATION_TYPE_PTR_LST, TOKEN_TYPE, TOKEN_LIST, AUTH_SERVICE_TOKEN_RELATION_NAME, AUTH_SERVICE_USER_PROFILE_RELATION_NAME, PLATFORM_TYPE, AUTH_SERVICE_LOG_RELATION_NAME, EVENTS_NAMES, EVENTS_REQUEST_NAMES, USER_LOG_CATEGORY_NAME, ADMIN_LOG_CATEGORY_NAME, AUTH_ADMIN_NAME, SCOPES } from "../../constant";
import { SpinalGraphService, SpinalGraph, SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { OperationError } from "../../utilities/operation-error";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { IUser, IUserCreationParams, IUserUpdateParams, IAuthAdminUpdateParams, IUserLoginParams, IUserType, IUserLogs, IUpdateUserPassword } from "./user.model";
import { IUserToken } from "../tokens/token.model";
import SpinalMiddleware from "../../spinalMiddleware";
import { LogsService } from "../logs/logService";
import data from "./profileUserListData";
import bcrypt = require("bcrypt");
import jwt = require("jsonwebtoken");
import jwt_decode from "jwt-decode";
import { PlatformService } from "../platform/platformServices";
import { TokensService } from "../tokens/tokenService";
import { format } from "path";
import { platform, userInfo } from "os";
const generator = require("generate-password");
const { setEnvValue } = require("../../../whriteToenvFile");

/**
 * @export
 * @class UserService
 */
export class UserService {
	public context: SpinalContext;

	static instance: UserService;

	private constructor() { }

	static getInstance(): UserService {
		if (!this.instance) {
			this.instance = new UserService();
		}

		return this.instance;
	}

	public async getProfile(platformId: string, profileIdBosConfig: string) {
		return PlatformService.getInstance().getUserProfile(platformId, profileIdBosConfig);
	}

	public async getUserListContext() {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		return graph.getContext(USER_LIST);
	}

	public async createUserListContext() {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		const context = new SpinalContext(USER_LIST);
		return graph.addContext(context);
	}

	public async createUser(userCreationParams: IUserCreationParams): Promise<IUser> {
		const [user] = await this.getUserNodes(userCreationParams.userName);

		if (user || (userCreationParams.userType === AUTH_ADMIN_NAME && userCreationParams.userName === AUTH_ADMIN_NAME)) {
			await LogsService.getInstance().createLog(user, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.CREATE, EVENTS_REQUEST_NAMES.CREATE_NOT_VALID, "create a new user with this userName");
			throw new OperationError("USERNAME_IS_ALREADY_USED", HttpStatusCode.FORBIDDEN);
		}

		const userNode = await this.createUserNode(userCreationParams);

		for (const platform of userCreationParams.platformList) {
			const pro = await this.getProfile(platform.platformId, platform.userProfile.userProfileId);
			await userNode.addChild(pro, AUTH_SERVICE_USER_PROFILE_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
		}

		await LogsService.getInstance().createLog(userNode, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.CREATE, EVENTS_REQUEST_NAMES.CREATE_VALID, EVENTS_REQUEST_NAMES.CREATE_VALID);
		return this._formatUser(userNode);
	}

	public async createUserNode(userCreationParams: IUserCreationParams) {
		const context = await this.getUserListContext();
		const userNode = new SpinalNode(userCreationParams.userName, USER_TYPE);

		const hash = await bcrypt.hash(userCreationParams.password, 10);
		userNode.info.add_attr({
			userType: userCreationParams.userType,
			userName: userCreationParams.userName,
			email: userCreationParams.email,
			telephone: userCreationParams.telephone,
			info: userCreationParams.info,
			password: hash,
		});

		return context.addChildInContext(userNode, AUTH_SERVICE_USER_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context);
	}

	public async login(userLoginParams: IUserLoginParams, platformId?: string): Promise<IUserToken> {

		const user = await this.getUserByCredentials(userLoginParams.userName, userLoginParams.password);

		if (!user) {
			await LogsService.getInstance().createLog(undefined, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.CONNECTION, EVENTS_REQUEST_NAMES.USER_NOT_VALID, EVENTS_REQUEST_NAMES.USER_NOT_VALID);
			throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		}

		const platforms = await this._getUserPlatforms(user);
		const platformList = this._formatPlatForms(platforms);

		const platform = platformList.find(el => el.platformId === platformId)
		const userId = user.getId().get();

		const tokenData = {
			userId,
			platformId,
			...(platform && {
				profile: {
					userProfileName: platform.userProfile.userProfileName,
					userProfileBosConfigId: platform.userProfile.userProfileBosConfigId
				},

				userInfo: await this.getUser(userId)

			}),
			...(!platform && {
				platformList
			})
		};

		const tokenNode = await TokensService.getInstance().createToken(user, tokenData, platformList, "user");

		await LogsService.getInstance().createLog(user, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.CONNECTION, EVENTS_REQUEST_NAMES.LOGIN_VALID, EVENTS_REQUEST_NAMES.LOGIN_VALID);
		return {
			name: tokenNode.getName().get(),
			token: tokenNode.info.token.get(),
			createdToken: tokenNode.info.createdToken.get(),
			expieredToken: tokenNode.info.expieredToken.get(),
			userId: user.getId().get(),
			platformList: platformList,
		};
	}

	public async getUserByCredentials(userName: string, password: string): Promise<SpinalNode> {
		const users = await this.getUserNodes();
		const user = users.find((user) => user.info.userName.get() === userName);

		if (!user) return null;

		const valid = await bcrypt.compare(password, user.info.password.get());

		if (!valid) return null;

		return user;
	}

	public async loginAuthAdmin(userLoginParams: IUserLoginParams): Promise<IUserToken> {
		const users = await this.getUserNodes();
		const user = users.find((user) => user.info.userName?.get() === AUTH_ADMIN_NAME && user.info.userName.get() === userLoginParams.userName);

		if (!user) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

		const valid = await bcrypt.compare(userLoginParams.password, user.info.password.get());

		if (!valid) {
			await LogsService.getInstance().createLog(user, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES.CONNECTION, EVENTS_REQUEST_NAMES.CONNECTION_NOT_VALID, " Unknown AuthAdmin Password");
			throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		}

		const tokenNode = await TokensService.getInstance().createToken(user, { userId: user.getId().get(), isAuthAdmin: true }, [], "user");
		await LogsService.getInstance().createLog(user, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES.CONNECTION, EVENTS_REQUEST_NAMES.CONNECTION_VALID, " Connection Valid");

		return {
			name: tokenNode.getName().get(),
			type: tokenNode.getType().get(),
			token: tokenNode.info.token?.get(),
			createdToken: tokenNode.info.createdToken.get(),
			expieredToken: tokenNode.info.expieredToken.get(),
			userId: user.getId().get(),
			userType: user.info.userType.get(),
		};
	}

	public async getUsers(): Promise<IUser[]> {
		try {
			const users = await this.getUserNodes();
			const promises = users.map(async (user) => {
				const platforms = await this._getUserPlatforms(user);
				return this._formatUser(user, platforms);
			});

			const usersObjectList = await Promise.all(promises);

			if (usersObjectList.length === 0) {
				throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
			}

			return usersObjectList;
		} catch (error) {
			return error;
		}
	}

	public async getUser(id: string): Promise<IUser> {
		const [user] = await this.getUserNodes(id);
		if (!user) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

		const platforms = await this._getUserPlatforms(user);
		return this._formatUser(user, platforms);
	}

	public async updateUser(userId: string, requestBody: IUserUpdateParams): Promise<IUser> {
		const users = await this.getUserNodes();
		const user = users.find((user) => user.getId().get() === userId);

		if (!user) {
			await LogsService.getInstance().createLog(user, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID);
			throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		}

		const { userName, id } = user.info.get();

		if (userName === AUTH_ADMIN_NAME) {
			await LogsService.getInstance().createLog(user, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID, "modify this user with a username that is not authorized");
			throw new OperationError("UNAUTHORIZED ROLE", HttpStatusCode.FORBIDDEN);
		}

		if (id !== userId && userName === requestBody.userName) {
			await LogsService.getInstance().createLog(user, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID, "modify this user with a username that already exists");
			throw new OperationError("USERNAME_IS_ALREADY_USED", HttpStatusCode.FORBIDDEN);
		}

		const keys = ["userName", "userType", "email", "telephone", "info"];

		for (const key in requestBody) {
			if (Object.prototype.hasOwnProperty.call(requestBody, key) && keys.includes(key)) {
				let value = requestBody[key];
				// if (key === "password") value = await bcrypt.hash(value, 10);

				if (value) user.info[key].set(value);
				if (key === "userName") user.info.name.set(value);
			}
		}

		const oldUserProfileList = await user.getChildren(AUTH_SERVICE_USER_PROFILE_RELATION_NAME);
		const newUserPlatformList = requestBody.platformList;

		await updateUserProfileList(oldUserProfileList, newUserPlatformList, user);

		var platformList = await this._getUserPlatforms(user);

		await LogsService.getInstance().createLog(user, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_VALID, EVENTS_REQUEST_NAMES.EDIT_VALID);
		return this._formatUser(user, platformList);
	}

	/**
	 * updateUserPassword
	 */
	public async updateUserPassword(userId: string, requestBody: IUpdateUserPassword) {
		const users = await this.getUserNodes(userId);
		const user = users.find((user) => user.getId().get() === userId);
		if (!user) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

		const valid = await bcrypt.compare(requestBody.oldPassword, user.info.password.get());
		if (!valid) throw new OperationError("ERROR_PASSWORD", HttpStatusCode.FORBIDDEN);

		const newPassword = await bcrypt.hash(requestBody.newPassword, 10);
		user.info.password.set(newPassword);

		return this._formatUser(user);
	}

	public async deleteUser(userId: string): Promise<void> {
		const [userFound] = await this.getUserNodes(userId);
		if (!userFound) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

		await LogsService.getInstance().createLog(userFound, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.DELETE, EVENTS_REQUEST_NAMES.DELETE_VALID, EVENTS_REQUEST_NAMES.DELETE_VALID);
		await userFound.removeFromGraph();
	}

	async createAuthAdmin(): Promise<IUser> {
		try {
			const password = process.env.AUTH_ADMIN_PASSWORD || generator.generate({ length: 10, numbers: true });
			setEnvValue("AUTH_ADMIN_PASSWORD", password);

			const hash = await bcrypt.hash(password, 10);

			const authAdminNode = new SpinalNode(AUTH_ADMIN_NAME, USER_TYPE);
			authAdminNode.info.add_attr({
				userName: AUTH_ADMIN_NAME,
				password: hash,
				email: "",
				telephone: "",
				info: "",
				userType: IUserType.authAdmin,
				scope: [SCOPES["authAdmin:delete"], SCOPES["authAdmin:read"], SCOPES["authAdmin:write"]],
			});

			const context = await this.getUserListContext();
			await context.addChildInContext(authAdminNode, AUTH_SERVICE_USER_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context);

			await LogsService.getInstance().createLog(authAdminNode, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES.CREATE, EVENTS_REQUEST_NAMES.CREATE_VALID, EVENTS_REQUEST_NAMES.CREATE_VALID);
			return authAdminNode.info.get();
		} catch (error) {
			await LogsService.getInstance().createLog(undefined, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES.CREATE, EVENTS_REQUEST_NAMES.CREATE_NOT_VALID, EVENTS_REQUEST_NAMES.CREATE_NOT_VALID);
			throw new OperationError("NOT_CREATED", HttpStatusCode.BAD_REQUEST);
		}
	}

	public async updateAuthAdmin(requestBody: IAuthAdminUpdateParams): Promise<IUser> {
		const [user] = await this.getUserNodes(requestBody.userName);
		if (!user) {
			await LogsService.getInstance().createLog(user, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID);
			throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		}

		const valid = await bcrypt.compare(requestBody.oldPassword, user.info.password.get());

		if (!valid) {
			await LogsService.getInstance().createLog(user, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID, "invalid old password");
			throw new OperationError("ERROR_PASSWORD", HttpStatusCode.FORBIDDEN);
		}

		const newPassword = await bcrypt.hash(requestBody.newPassword, 10);
		user.info.password.set(newPassword);

		const keys = ["email", "telephone", "info"];

		for (const key in requestBody) {
			if (Object.prototype.hasOwnProperty.call(requestBody, key) && keys.includes(key)) {
				const element = requestBody[key];
				user.info[key].set(element);
			}
		}

		await LogsService.getInstance().createLog(user, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_VALID, EVENTS_REQUEST_NAMES.EDIT_VALID);
		return this._formatUser(user);
	}

	public async getAuthAdmin(): Promise<IUser> {
		const [user] = await this.getUserNodes(AUTH_ADMIN_NAME);
		if (user) return user.info.get();

		throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
	}

	public async getInfoToken(tokenParam: string) {
		return TokensService.getInstance().getTokenInfo(tokenParam);
	}

	public async userProfilesList() {
		return [];
	}

	public async getRoles(): Promise<{ name: string }[]> {
		return [{ name: "Super User" }, { name: "Simple User" }];
	}

	public async getUserLogs(id: string): Promise<IUserLogs[]> {
		try {
			const [platform] = await this.getUserNodes(id);
			const logs = await platform.getChildren(AUTH_SERVICE_LOG_RELATION_NAME);
			return logs.map((log) => ({
				id: log.getId().get(),
				type: log.getType().get(),
				name: log.getName().get(),
				date: log.info.date.get(),
				message: log.info.message.get(),
				actor: {
					actorId: log.info.actor.actorId.get(),
					actorName: log.info.actor.actorName.get(),
				},
			}));
		} catch (error) {
			throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		}
	}

	public async getUserNodes(userId?: string): Promise<SpinalNode[]> {
		const context = await this.getUserListContext();
		const users = await context.getChildren(AUTH_SERVICE_USER_RELATION_NAME);
		if (!userId) return users;

		return users.filter((user) => user.info.username?.get() === userId || user.getId().get() === userId);
	}

	private async _getUserPlatforms(user: SpinalNode): Promise<{ platform: SpinalNode; profile: SpinalNode }[]> {
		const profiles = await this._getUserProfile(user);
		const promises = profiles.map(async (profile) => ({
			profile,
			platform: await this._getPlatFormByProfile(profile),
		}));

		return Promise.all(promises);
	}

	private _getUserProfile(application: SpinalNode): Promise<SpinalNode[]> {
		return application.getChildren(AUTH_SERVICE_USER_PROFILE_RELATION_NAME);
	}

	private async _getPlatFormByProfile(profileNode: SpinalNode): Promise<SpinalNode> {
		const parents = await profileNode.getParents(AUTH_SERVICE_USER_PROFILE_RELATION_NAME);
		for (const parent of parents) {
			if (parent.getType().get() === PLATFORM_TYPE) {
				return parent;
			}
		}
	}

	private _formatUser(userNode: SpinalNode<any>, platformList?: any[]): IUser {
		return {
			id: userNode.getId().get(),
			type: userNode.getType().get(),
			name: userNode.getName().get(),
			userName: userNode.info.userName.get(),
			// password: userNode.info.password.get(),
			email: userNode.info.email.get(),
			telephone: userNode.info.telephone.get(),
			info: userNode.info.info.get(),
			userType: userNode.info.userType.get(),
			...((platformList && { platformList: this._formatPlatForms(platformList) }) as any),
		};
	}

	private _formatPlatForms(platformList: { platform: SpinalNode; profile: SpinalNode }[]) {
		return platformList.map(({ platform, profile }) => ({
			platformId: platform.getId().get(),
			platformName: platform.getName().get(),
			idPlatformOfAdmin: platform.info.idPlatformOfAdmin?.get(),
			userProfile: {
				userProfileAdminId: profile.getId().get(),
				userProfileBosConfigId: profile.info.userProfileId.get(),
				userProfileName: profile.getName().get(),
			},
		}));
	}
}

async function updateUserProfileList(oldUserProfileList: SpinalNode<any>[], newUserPlatformList: any[], user: SpinalNode<any>) {
	var arrayDelete = [];
	var arrayCreate = [];
	const graph = await SpinalMiddleware.getInstance().getGraph();

	for (const olditem of oldUserProfileList) {
		const resSome = newUserPlatformList.some((it) => {
			return it.userProfile.userProfileAdminId === olditem.getId().get();
		});
		if (resSome === false) {
			arrayDelete.push(olditem);
		}
	}

	for (const newItem of newUserPlatformList) {
		const resSome = oldUserProfileList.some((it) => {
			return it.getId().get() === newItem.userProfile.userProfileAdminId;
		});
		if (resSome === false) {
			arrayCreate.push(newItem);
		}
	}

	for (const arrdlt of arrayDelete) {
		await user.removeChild(arrdlt, AUTH_SERVICE_USER_PROFILE_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
	}

	for (const arrcrt of arrayCreate) {
		const realNode = await getrealNodeProfile(arrcrt.userProfile.userProfileAdminId, arrcrt.platformId, graph);
		await user.addChild(realNode, AUTH_SERVICE_USER_PROFILE_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
	}
}

async function getrealNodeProfile(profileId: string, platformId: string, graph: SpinalGraph<any>) {
	const contexts: SpinalNode<any>[] = await graph.getChildren("hasContext");
	for (const context of contexts) {
		const platforms = await context.getChildren("HasPlatform");
		for (const platform of platforms) {
			if (platform.getId().get() === platformId) {
				const profiles = await platform.getChildren(AUTH_SERVICE_USER_PROFILE_RELATION_NAME);
				for (const profile of profiles) {
					if (profile.getId().get() === profileId) {
						return profile;
					}
				}
			}
		}
	}
}
