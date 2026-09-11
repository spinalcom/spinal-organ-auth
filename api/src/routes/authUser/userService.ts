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

import { USER_LIST, AUTH_SERVICE_USER_RELATION_NAME, USER_TYPE, AUTH_SERVICE_RELATION_TYPE_PTR_LST, AUTH_SERVICE_USER_PROFILE_RELATION_NAME, PLATFORM_TYPE, AUTH_SERVICE_LOG_RELATION_NAME, EVENTS_NAMES, EVENTS_REQUEST_NAMES, USER_LOG_CATEGORY_NAME, ADMIN_LOG_CATEGORY_NAME, AUTH_ADMIN_NAME, SCOPES } from "../../constant";
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { OperationError } from "../../utilities/operation-error";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { IUser, IUserCreationParams, IUserUpdateParams, IAuthAdminUpdateParams, IUserLoginParams, IUserType, IUserLogs, IUpdateUserPassword } from "./user.model";
import { IUserToken } from "../tokens/token.model";
import SpinalMiddleware from "../../spinalMiddleware";
import { LogsService } from "../logs/logService";
const bcrypt = require("bcrypt");
import { PlatformService } from "../platform/platformServices";
import { TokensService } from "../tokens/tokenService";
import { updateProfileRelations } from "../platform/profileRelations";

type UserPlatformDetails = {
	platformId: string;
	platformName: string;
	idPlatformOfAdmin: any;
	userProfile: {
		userProfileAdminId: string;
		userProfileBosConfigId: any;
		userProfileName: string;
	};
};

/**
 * @export
 * @class UserService
 */
export class UserService {
	public context!: SpinalContext;
	private readonly MIN_PASSWORD_LENGTH = 8;

	static instance: UserService;

	private constructor() {}

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
		this._assertPasswordCoherence(userCreationParams.password, "password");

		const [user] = await this.getUserNodes(userCreationParams.userName);

		if (user || (userCreationParams.userType === AUTH_ADMIN_NAME && userCreationParams.userName === AUTH_ADMIN_NAME)) {
			await LogsService.getInstance().createLog(user, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.CREATE, EVENTS_REQUEST_NAMES.CREATE_NOT_VALID, "create a new user with this userName");
			throw new OperationError("USERNAME_IS_ALREADY_USED", HttpStatusCode.FORBIDDEN);
		}

		const userNode = await this.createUserNode(userCreationParams);

		for (const platform of userCreationParams.platformList || []) {
			if (!platform.platformId || !platform.userProfile?.userProfileId) continue;
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
		const userInfo = this._generateUserAttributes(userCreationParams, hash);
		userNode.info.add_attr(userInfo);

		return context.addChildInContext(userNode, AUTH_SERVICE_USER_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context);
	}

	public async getUserByCredentials(userName: string, password: string, isAuthAdmin: boolean = false): Promise<SpinalNode | null> {
		const user = await this._findUserByUserName(userName, isAuthAdmin);

		if (!user) return null;

		const valid = await bcrypt.compare(password, user.info.password.get());

		if (!valid) return null;

		return user;
	}

	public async login(userLoginParams: IUserLoginParams, platformId?: string): Promise<IUserToken> {
		const user = await this.getUserByCredentials(userLoginParams.userName, userLoginParams.password);

		if (!user) {
			await LogsService.getInstance().createLog(undefined as any, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.CONNECTION, EVENTS_REQUEST_NAMES.USER_NOT_VALID, EVENTS_REQUEST_NAMES.USER_NOT_VALID);
			throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		}

		const platformList = await this.getUserPlatformList(user, platformId);
		const tokenData = await this._generateTokenData(platformList, user, platformId || "");

		const tokenNode = await TokensService.getInstance().createToken(user, tokenData, platformList, "user");

		await LogsService.getInstance().createLog(user, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.CONNECTION, EVENTS_REQUEST_NAMES.LOGIN_VALID, EVENTS_REQUEST_NAMES.LOGIN_VALID);
		return this._getUserTokenResponse(tokenNode, user, platformList);
	}

	public async loginAuthAdmin(userLoginParams: IUserLoginParams): Promise<IUserToken> {
		const user = await this._findUserByUserName(userLoginParams.userName, true);

		if (!user) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

		const valid = await bcrypt.compare(userLoginParams.password, user.info.password.get());

		if (!valid) {
			await LogsService.getInstance().createLog(user, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES.CONNECTION, EVENTS_REQUEST_NAMES.CONNECTION_NOT_VALID, " Unknown AuthAdmin Password");
			throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		}

		const tokenData = { userId: user.getId().get(), ...(user.info?.get() || {}), isAuthAdmin: true };
		const tokenNode = await TokensService.getInstance().createToken(user, tokenData, [], "user");
		await LogsService.getInstance().createLog(user, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES.CONNECTION, EVENTS_REQUEST_NAMES.CONNECTION_VALID, " Connection Valid");

		return this._getUserTokenResponse(tokenNode, user);
	}

	public async getUserPlatformList(user: string | SpinalNode, platformId?: string) {
		if (typeof user === "string") {
			const users = await this.getUserNodes(user);
			user = users[0];
		}

		if (!user) return [];

		const platforms = await this._getUserPlatforms(user);
		const platformList = this._formatPlatForms(platforms);

		if (!platformId) return platformList;

		return platformList.filter((el) => el.platformId === platformId);
	}

	/////////////////////////////////////

	public async getUsers(): Promise<IUser[]> {
		try {
			const users = await this.getUserNodes();
			const promises = users.map(async (user) => {
				const platforms = await this._getUserPlatforms(user);
				return this._formatUser(user, platforms);
			});

			const usersObjectList = await Promise.all(promises);

			return usersObjectList;
		} catch (error) {
			return [];
		}
	}

	public async getUser(id: string): Promise<IUser> {
		const [user] = await this.getUserNodes(id);
		if (!user) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

		const platforms = await this._getUserPlatforms(user);
		return this._formatUser(user, platforms);
	}

	public async getUserInfoByToken(token: string) {
		try {
			const decoded = await TokensService.getInstance().verifyToken(token, "user");
			const userInfo = decoded.userInfo;
			if (userInfo) return userInfo;
		} catch (error) {}

		throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
	}

	public async updateUser(userId: string, requestBody: IUserUpdateParams): Promise<IUser> {
		const users = await this.getUserNodes();
		const user = users.find((user) => user.getId().get() === userId);

		if (!user) {
			await LogsService.getInstance().createLog(user as any, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID);
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

		this._assertUserUpdatePayload(requestBody);

		const keys: (keyof IUserUpdateParams)[] = ["userName", "userType", "email", "telephone", "info"];

		for (const key of keys) {
			const value = requestBody[key];
			if (value !== undefined && value !== null) {
				user.info[key].set(value);
				if (key === "userName") user.info.name.set(value);
			}
		}

		if (typeof requestBody.mustChangePassword === "boolean") {
			if (user.info.mustChangePassword) user.info.mustChangePassword.set(requestBody.mustChangePassword);
			else user.info.add_attr("mustChangePassword", requestBody.mustChangePassword);
		}

		const oldUserProfileList = await user.getChildren(AUTH_SERVICE_USER_PROFILE_RELATION_NAME);
		const newUserPlatformList = requestBody.platformList || [];

		const graph = await SpinalMiddleware.getInstance().getGraph();
		await updateProfileRelations(graph, user, oldUserProfileList, newUserPlatformList, AUTH_SERVICE_USER_PROFILE_RELATION_NAME, (platform) => platform.userProfile.userProfileAdminId || "");

		const platformList = await this._getUserPlatforms(user);

		await LogsService.getInstance().createLog(user, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_VALID, EVENTS_REQUEST_NAMES.EDIT_VALID);
		return this._formatUser(user, platformList);
	}

	/**
	 * updateUserPassword
	 */
	public async updateUserPassword(userName: string, requestBody: IUpdateUserPassword) {
		this._assertPasswordCoherence(requestBody.newPassword, "newPassword");

		const itsComeFromAuthAdmin = Boolean(requestBody.authAdminPassword);
		let userFound: SpinalNode | null | undefined;

		if (itsComeFromAuthAdmin) {
			const authUser = await this.getUserByCredentials(AUTH_ADMIN_NAME, requestBody.authAdminPassword || "", true);
			if (!authUser) throw new OperationError("ERROR_PASSWORD", HttpStatusCode.FORBIDDEN);
			const users = await this.getUserNodes(userName);
			userFound = users[0];
		} else {
			userFound = await this.getUserByCredentials(userName, requestBody.userLastPassword || "", false);
		}

		if (!userFound) throw new OperationError("ERROR_PASSWORD", HttpStatusCode.FORBIDDEN);

		const newPassword = await bcrypt.hash(requestBody.newPassword, 10);
		userFound.info.password.set(newPassword);

		if (userFound.info.mustChangePassword) userFound.info.mustChangePassword.set(itsComeFromAuthAdmin);
		else userFound.info.add_attr("mustChangePassword", itsComeFromAuthAdmin);

		return this._formatUser(userFound);
	}

	public async deleteUser(userId: string): Promise<void> {
		const [userFound] = await this.getUserNodes(userId);
		if (!userFound) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

		await LogsService.getInstance().createLog(userFound, USER_LOG_CATEGORY_NAME, EVENTS_NAMES.DELETE, EVENTS_REQUEST_NAMES.DELETE_VALID, EVENTS_REQUEST_NAMES.DELETE_VALID);
		await userFound.removeFromGraph();
	}

	async createAuthAdmin(): Promise<IUser> {
		try {
			const password = this.getAuthPassword();
			const hash = await bcrypt.hash(password, 10);

			const authAdminNode = new SpinalNode(AUTH_ADMIN_NAME, USER_TYPE);
			authAdminNode.info.add_attr({
				userName: AUTH_ADMIN_NAME,
				password: hash,
				email: "",
				telephone: "",
				info: "",
				mustChangePassword: false,
				userType: IUserType.authAdmin,
				scope: [SCOPES.authAdmin],
			});

			const context = await this.getUserListContext();
			await context.addChildInContext(authAdminNode, AUTH_SERVICE_USER_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context);

			await LogsService.getInstance().createLog(authAdminNode, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES.CREATE, EVENTS_REQUEST_NAMES.CREATE_VALID, EVENTS_REQUEST_NAMES.CREATE_VALID);
			return authAdminNode.info.get();
		} catch (error) {
			await LogsService.getInstance().createLog(undefined as any, ADMIN_LOG_CATEGORY_NAME, EVENTS_NAMES.CREATE, EVENTS_REQUEST_NAMES.CREATE_NOT_VALID, EVENTS_REQUEST_NAMES.CREATE_NOT_VALID);
			throw new OperationError("NOT_CREATED", HttpStatusCode.BAD_REQUEST);
		}
	}

	public async updateAuthAdmin(requestBody: IAuthAdminUpdateParams): Promise<IUser> {
		if (!requestBody.newPassword) throw new OperationError("NEW_PASSWORD_REQUIRED", HttpStatusCode.BAD_REQUEST);
		this._assertPasswordCoherence(requestBody.newPassword, "newPassword");

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

		const keys: (keyof IAuthAdminUpdateParams)[] = ["email", "telephone", "info"];

		for (const key of keys) {
			const element = requestBody[key];
			if (element) user.info[key].set(element);
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

	private async _getUserPlatforms(user: SpinalNode): Promise<{ platform: SpinalNode | undefined; profile: SpinalNode }[]> {
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

	private async _getPlatFormByProfile(profileNode: SpinalNode): Promise<SpinalNode | undefined> {
		const parents = await profileNode.getParents(AUTH_SERVICE_USER_PROFILE_RELATION_NAME);
		for (const parent of parents) {
			if (parent.getType().get() === PLATFORM_TYPE) {
				return parent;
			}
		}
	}

	private _formatUser(userNode: SpinalNode<any>, platformList?: any[]): IUser {
		return {
			id: userNode.getId()?.get(),
			type: userNode.getType()?.get(),
			name: userNode.getName()?.get(),
			userName: userNode.info?.userName?.get(),
			// password: userNode.info.password.get(),
			email: userNode.info?.email?.get(),
			telephone: userNode.info?.telephone?.get(),
			info: userNode.info?.info?.get(),
			mustChangePassword: Boolean(userNode.info?.mustChangePassword?.get?.()),
			userType: userNode.info?.userType?.get(),
			...((platformList && { platformList: this._formatPlatForms(platformList) }) as any),
		};
	}

	private _formatPlatForms(platformList: { platform: SpinalNode | undefined; profile: SpinalNode }[]) {
		return platformList.map(({ platform, profile }) => ({
			platformId: platform?.getId().get() || "",
			platformName: platform?.getName().get() || "",
			idPlatformOfAdmin: platform?.info.idPlatformOfAdmin?.get(),
			userProfile: {
				userProfileAdminId: profile?.getId().get() || "",
				userProfileBosConfigId: profile?.info?.userProfileId?.get(),
				userProfileName: profile?.getName().get() || "",
			},
		}));
	}

	private _generateUserAttributes(userCreationParams: IUserCreationParams, hash: any): { [nameAttr: string]: any } {
		return {
			userType: userCreationParams.userType,
			userName: userCreationParams.userName,
			email: userCreationParams.email,
			telephone: userCreationParams.telephone,
			info: userCreationParams.info,
			mustChangePassword: true,
			password: hash,
		};
	}

	private async _generateTokenData(platformList: UserPlatformDetails[], user: SpinalNode, platformId: string) {
		let platform;
		if (platformList.length === 1) platform = platformList[0];

		const tokenData = {
			userId: user.getId().get(),
			platformId,
			...(platform && {
				profile: {
					userProfileName: platform.userProfile.userProfileName,
					userProfileBosConfigId: platform.userProfile.userProfileBosConfigId,
				},

				userInfo: await this.getUser(user.getId().get()),
			}),
			...(!platform && { platformList }),
		};
		return tokenData;
	}

	private async _findUserByUserName(userName: string, isAuthAdmin?: boolean): Promise<SpinalNode | undefined> {
		if ((isAuthAdmin && userName !== AUTH_ADMIN_NAME) || (!isAuthAdmin && userName === AUTH_ADMIN_NAME)) return undefined;

		const users = await this.getUserNodes();
		const user = users.find((user) => user.info.userName.get() === userName);
		return user;
	}

	private _getUserTokenResponse(tokenNode: SpinalNode<any>, user: SpinalNode<any>, platformList?: UserPlatformDetails[]): IUserToken {
		return {
			name: tokenNode.getName().get(),
			type: tokenNode.getType().get(),
			token: tokenNode.info.token.get(),
			createdToken: tokenNode.info.createdToken.get(),
			expieredToken: tokenNode.info.expieredToken.get(),
			userId: user.getId().get(),
			userType: user.info.userType.get(),
			platformList: platformList || [],
		};
	}

	private getAuthPassword() {
		const password = process.env.AUTH_ADMIN_PASSWORD;
		return password;
	}

	private _assertPasswordCoherence(password: unknown, fieldName: string): void {
		if (typeof password !== "string") {
			throw new OperationError(`${fieldName.toUpperCase()}_INVALID_FORMAT`, HttpStatusCode.BAD_REQUEST);
		}

		if (password.length < this.MIN_PASSWORD_LENGTH) {
			throw new OperationError("PASSWORD_TOO_SHORT", HttpStatusCode.BAD_REQUEST);
		}
	}

	private _assertUserUpdatePayload(requestBody: IUserUpdateParams): void {
		if (requestBody.userName !== undefined) {
			if (typeof requestBody.userName !== "string" || requestBody.userName.trim().length === 0) {
				throw new OperationError("INVALID_USERNAME", HttpStatusCode.BAD_REQUEST);
			}
		}

		if (requestBody.email !== undefined) {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (typeof requestBody.email !== "string" || !emailPattern.test(requestBody.email.trim())) {
				throw new OperationError("INVALID_EMAIL", HttpStatusCode.BAD_REQUEST);
			}
		}

		if (requestBody.telephone !== undefined) {
			const phonePattern = /^[0-9+()\-\s]{6,20}$/;
			if (typeof requestBody.telephone !== "string" || !phonePattern.test(requestBody.telephone.trim())) {
				throw new OperationError("INVALID_TELEPHONE", HttpStatusCode.BAD_REQUEST);
			}
		}
	}
}
