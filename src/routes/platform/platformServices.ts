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

import { PLATFORM_LIST, AUTH_SERVICE_PLATFORM_RELATION_NAME, PLATFORM_TYPE, AUTH_SERVICE_RELATION_TYPE_PTR_LST, AUTH_SERVICE_ORGAN_RELATION_NAME, REGISTER_KEY_TYPE, INFO_ADMIN_TYPE, AUTH_SERVICE_INFO_ADMIN_RELATION_NAME, INFO_ADMIN, AUTH_SERVICE_APP_PROFILE_RELATION_NAME, AUTH_SERVICE_USER_PROFILE_RELATION_NAME, AUTH_SERVICE_LOG_RELATION_NAME, EVENTS_NAMES, EVENTS_REQUEST_NAMES, PLATFORM_LOG_CATEGORY_NAME, CONNECTION_METHODS, PLATFORM_TO_LOGIN_SERVER } from "../../constant";
import { SPINAL_RELATION_PTR_LST_TYPE, SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { OperationError } from "../../utilities/operation-error";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { IPlatform, IPlateformCreationParams, IPlatformUpdateParams, statusPlatform, IRegisterParams, IRegisterKeyObject, IPlatformLogs, ISAMLAuthenticationInfo, IOAuthAuthenticationInfo, ILocalAuthenticationInfo } from "./platform.model";
import SpinalMiddleware from "../../spinalMiddleware";
import { ProfileServices } from "./profileServices";
import { OrganService } from "../organ/organService";
import jwt = require("jsonwebtoken");
import { LogsService } from "../logs/logService";
import { TokensService } from "../tokens/tokenService";
const { setEnvValue } = require("../../../whriteToenvFile");
import { isLocalAuthenticationInfo, isOAuthAuthenticationInfo, isSAMLAuthenticationInfo } from "./utils";
import loginService from "../loginServer/loginServerService";
import axios from "axios";

export class PlatformService {
	static instance: PlatformService;
	public platFormContext: SpinalContext;
	public registerKeyContext: SpinalContext;

	private constructor() { }

	public static getInstance(): PlatformService {
		if (!this.instance) this.instance = new PlatformService();
		return PlatformService.instance;
	}

	public async getContext(): Promise<SpinalContext> {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		return graph.getContext(PLATFORM_LIST);
	}

	public async createContext() {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		const context = new SpinalContext(PLATFORM_LIST);
		return graph.addContext(context);
	}

	public async getAppProfile(platformId: string, profileIdBosConfig: string) {
		const [platform] = await this.getPlatformsNodes(platformId);
		if (!platform) return;

		const appProfiles = await platform.getChildren(AUTH_SERVICE_APP_PROFILE_RELATION_NAME);
		return appProfiles.find((profile) => profile.info.appProfileId.get() === profileIdBosConfig);
	}

	public async getUserProfile(platformId: string, profileIdBosConfig: string, useName: boolean = false) {
		const [platform] = await this.getPlatformsNodes(platformId);
		if (!platform) return;

		const appProfiles = await platform.getChildren(AUTH_SERVICE_USER_PROFILE_RELATION_NAME);
		return appProfiles.find((profile) => {
			if (profile.info.userProfileId.get() === profileIdBosConfig) return true;
			if (useName && profile.getName().get() === profileIdBosConfig) return true;

			return false;
		});
	}

	public async createPlateform(platformCreationParms: IPlateformCreationParams): Promise<IPlatform> {
		try {

			const _platformCreationParms = this._formatPlatformCreationParams(platformCreationParms);

			// const isValid = this._verifyAuthInfo(platformCreationParms.authentication_method, platformCreationParms.authentication_info);

			// if (!isValid) throw new OperationError("connection info format is invalid", HttpStatusCode.BAD_REQUEST);

			const context = await this.getContext();

			const plateformNode = new SpinalNode(_platformCreationParms.name, PLATFORM_TYPE);

			for (const [key, value] of Object.entries(_platformCreationParms)) {
				if (plateformNode.info[key]) plateformNode.info[key].set(value);
				else plateformNode.info.add_attr(key, value);
			}

			const res = await context.addChildInContext(plateformNode, AUTH_SERVICE_PLATFORM_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context);
			await LogsService.getInstance().createLog(res, PLATFORM_LOG_CATEGORY_NAME, EVENTS_NAMES.REGISTER, EVENTS_REQUEST_NAMES.REGISTER_VALID, EVENTS_REQUEST_NAMES.REGISTER_VALID);

			await this.addLoginServerToPlatform(res, platformCreationParms.loginServerIds);

			return this._formatPlatform(res);
		} catch (error) {
			await LogsService.getInstance().createLog(undefined, PLATFORM_LOG_CATEGORY_NAME, EVENTS_NAMES.REGISTER, EVENTS_REQUEST_NAMES.REGISTER_NOT_VALID, EVENTS_REQUEST_NAMES.REGISTER_NOT_VALID);
			throw new OperationError("NOT_CREATED", HttpStatusCode.BAD_REQUEST);
		}
	}

	public async getPlateforms(): Promise<IPlatform[]> {
		const platforms = await this.getPlatformsNodes();

		return platforms.map((platform) => this._formatPlatform(platform));
	}

	public async getPlateform(id: string): Promise<IPlatform> {
		const platforms = await this.getPlatformsNodes();
		const found = platforms.find((platform) => platform.getId().get() === id);

		if (!found) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

		return this._formatPlatform(found);
	}

	public async getPlateformByClientId(clientId: string): Promise<SpinalNode> {
		const platforms = await this.getPlatformsNodes();
		const found = platforms.find((platform) => platform.info.clientId?.get() === clientId);

		if (!found) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

		return found;
	}

	public async getPlateformByApiUrl(apiUrl: string): Promise<SpinalNode> {
		const platforms = await this.getPlatformsNodes();
		const found = platforms.find((platform) => platform.info.redirectUrl?.get().includes(apiUrl));

		return found;
	}

	public async updatePlateform(id: string, requestBody: IPlatformUpdateParams): Promise<IPlatform> {
		const [platform] = await this.getPlatformsNodes(id);

		for (const [key, value] of Object.entries(requestBody)) {
			if (platform.info[key] && value) platform.info.mod_attr(key, value);
		}

		await this.editLoginServerLink(platform, requestBody.loginServerIds);

		await LogsService.getInstance().createLog(platform, PLATFORM_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_VALID, EVENTS_REQUEST_NAMES.EDIT_VALID);
		return this._formatPlatform(platform);
	}

	public async deletePlatform(id: string): Promise<void> {
		const [platform] = await this.getPlatformsNodes(id);

		if (platform) {
			await LogsService.getInstance().createLog(platform, PLATFORM_LOG_CATEGORY_NAME, EVENTS_NAMES.DELETE, EVENTS_REQUEST_NAMES.DELETE_VALID, EVENTS_REQUEST_NAMES.DELETE_VALID);
			return platform.removeFromGraph();
		}

		await LogsService.getInstance().createLog(undefined, PLATFORM_LOG_CATEGORY_NAME, EVENTS_NAMES.DELETE, EVENTS_REQUEST_NAMES.DELETE_NOT_VALID, EVENTS_REQUEST_NAMES.DELETE_NOT_VALID);
		throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
	}

	public async updatePlatformToken(platformCredential: { clientId: string, token: string }): Promise<string> {
		const client = await this.getPlatformByClientId(platformCredential.clientId);
		const lastToken = client?.info?.TokenBosAdmin?.get();

		if (lastToken !== platformCredential.token)
			throw new OperationError("UNAUTHORIZED", HttpStatusCode.UNAUTHORIZED);

		const token = this.generateTokenBosAdmin(client.getName().get());
		client.info.mod_attr("TokenBosAdmin", token);
		return token;
	}

	// public async createAuthPlateform(): Promise<IPlatform> {
	// 	try {
	// 		const context = await this.getContext();

	// 		const platformObject: IPlateformCreationParams = {
	// 			name: "authenticationPlatform",
	// 			type: PLATFORM_TYPE,
	// 			statusPlatform: statusPlatform.online,
	// 			url: process.env.SPINALHUB_URL,
	// 			TokenBosAdmin: this.generateTokenBosAdmin("authenticationPlatform"),
	// 			address: "",
	// 			TokenAdminBos: "",
	// 			idPlatformOfAdmin: "",
	// 		};

	// 		const plateformNode = new SpinalNode("authenticationPlatform", PLATFORM_TYPE);

	// 		for (const [key, value] of Object.entries(platformObject)) {
	// 			if (plateformNode.info[key]) plateformNode.info[key].set(value);
	// 			else plateformNode.info.add_attr(key, value);
	// 		}

	// 		const res = await context.addChildInContext(plateformNode, AUTH_SERVICE_PLATFORM_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context);

	// 		await LogsService.getInstance().createLog(res, PLATFORM_LOG_CATEGORY_NAME, EVENTS_NAMES.REGISTER, EVENTS_REQUEST_NAMES.REGISTER_VALID, "Register Valid AuthPlatform created");
	// 		return {
	// 			id: res.getId().get(),
	// 			type: res.getType().get(),
	// 			name: res.getName().get(),
	// 			statusPlatform: res.info.statusPlatform.get(),
	// 			url: res.info.url.get(),
	// 		};
	// 	} catch (error) {
	// 		await LogsService.getInstance().createLog(undefined, PLATFORM_LOG_CATEGORY_NAME, EVENTS_NAMES.REGISTER, EVENTS_REQUEST_NAMES.REGISTER_NOT_VALID, EVENTS_REQUEST_NAMES.REGISTER_NOT_VALID);
	// 		throw new OperationError("NOT_CREATED", HttpStatusCode.BAD_REQUEST);
	// 	}
	// }

	public async getRegisterKeyContext(): Promise<SpinalContext> {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		return graph.getContext(INFO_ADMIN);
	}

	public async createRegisterKeyContext(): Promise<SpinalContext> {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		const context = new SpinalContext(INFO_ADMIN);
		return graph.addContext(context);
	}

	public async createRegisterKeyNode(): Promise<IRegisterKeyObject> {
		const context = await this.getRegisterKeyContext();

		const regesterKeyNode = new SpinalNode("registerKey", REGISTER_KEY_TYPE);
		regesterKeyNode.info.add_attr("value", this.generateRegisterKey());

		const res = await context.addChildInContext(regesterKeyNode, AUTH_SERVICE_INFO_ADMIN_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context);
		setEnvValue("REGISTER_KEY", res.info.value.get());

		return {
			id: res.getId().get(),
			type: res.getType().get(),
			name: res.getName().get(),
			value: res.info.value.get(),
		};
	}

	public generateRegisterKey() {
		if (process.env.REGISTER_KEY) return process.env.REGISTER_KEY;

		const generator = require("generate-password");
		var registerKey = generator.generate({ length: 20, numbers: true });
		return registerKey;
	}

	public async updateRegisterKeyNode(): Promise<IRegisterKeyObject> {
		const child = await this.getRegisterKeySpinalNode();
		child.info.value.set(this.generateRegisterKey());

		return {
			id: child.getId().get(),
			type: child.getType().get(),
			name: child.getName().get(),
			value: child.info.value.get(),
		};
	}

	public async getRegisterKeyNode(): Promise<IRegisterKeyObject> {
		const found = await this.getRegisterKeySpinalNode();

		return {
			id: found.getId().get(),
			type: found.getType().get(),
			name: found.getName().get(),
			value: found.info.value.get(),
		};
	}

	public generateTokenBosAdmin(platformName: string) {
		const secret = TokensService.getInstance().generateTokenKey();
		let token = jwt.sign({ platformName: platformName }, secret, { expiresIn: "1y" });
		// let decodedToken = jwt_decode(token);
		return token;
	}

	public async registerNewPlatform(object: IRegisterParams): Promise<IPlatform | string> {
		const plateform = await this.getPlatformByClientId(object.clientId);
		if (!plateform || plateform.info.clientSecret?.get() !== object.clientSecret) {
			await LogsService.getInstance().createLog(undefined, PLATFORM_LOG_CATEGORY_NAME, EVENTS_NAMES.REGISTER, EVENTS_REQUEST_NAMES.REGISTER_NOT_VALID, "Invalid ClientId or ClientSecret");
			throw new OperationError("Invalid ClientId or ClientSecret", HttpStatusCode.BAD_REQUEST);
		}

		// if (plateform.info.statusPlatform.get() === statusPlatform.connected && plateform.info.TokenBosAdmin?.get()) {
		// 	await LogsService.getInstance().createLog(plateform, PLATFORM_LOG_CATEGORY_NAME, EVENTS_NAMES.REGISTER, EVENTS_REQUEST_NAMES.REGISTER_NOT_VALID, "Platform Already Connected");
		// 	throw new OperationError("Platform Already Connected", HttpStatusCode.BAD_REQUEST);
		// }

		const plateformName = plateform.getName().get();
		const tokenBosAdmin = this.generateTokenBosAdmin(plateformName);

		plateform.info.statusPlatform.set(statusPlatform.connected);
		plateform.info.mod_attr("TokenBosAdmin", tokenBosAdmin);
		plateform.info.mod_attr("TokenAdminBos", "");

		return this._formatPlatform(plateform);
	}

	public async updateNewPlatform(updateParams) {
		const [platform] = await this.getPlatformsNodes(updateParams.platformId);

		if (platform.info.TokenBosAdmin?.get() === updateParams.TokenBosAdmin && updateParams.jsonData) {
			//update the old Organ List
			const oldOrgans = await platform.getChildren("HasOrgan");
			await updateOrganProfile(oldOrgans, platform, updateParams.jsonData.organList);
			// update th old user Profiles
			const oldUserProfileList = await platform.getChildren(AUTH_SERVICE_USER_PROFILE_RELATION_NAME);
			await updateAppUserProfile(oldUserProfileList, platform, updateParams.jsonData.userProfileList, "userProfile");

			// update the old app profiles
			const oldAppProfileList = await platform.getChildren(AUTH_SERVICE_APP_PROFILE_RELATION_NAME);
			await updateAppUserProfile(oldAppProfileList, platform, updateParams.jsonData.appProfileList, "appProfile");

			platform.info.mod_attr("lastSyncTime", Date.now());
			// platform.info.idPlatformOfAdmin.set(updateParams.idPlatformOfAdmin);
			if (updateParams.TokenAdminBos && !platform.info?.TokenAdminBos?.get()) // if the token is not already set
				await this.updateTokenAdminBosInGraph(platform, updateParams.TokenAdminBos);

			await LogsService.getInstance().createLog(platform, PLATFORM_LOG_CATEGORY_NAME, EVENTS_NAMES.PUSH_DATA, EVENTS_REQUEST_NAMES.PUSH_DATA, "Push Data Valid ");
			return;
		}

		await LogsService.getInstance().createLog(platform, PLATFORM_LOG_CATEGORY_NAME, EVENTS_NAMES.PUSH_DATA, EVENTS_REQUEST_NAMES.PUSH_DATA_NOT_VALID, "Push Data Not Valid Empty Json Data");
		throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
	}


	public sendTokenAdminBosUpdatingRequest(platformId: string) {

	}

	public async sendUpdatePlatformDataRequest(plateformId: string) {
		const [plateform] = await this.getPlatformsNodes(plateformId);
		const token = plateform?.info?.TokenAdminBos?.get();
		let url = plateform?.info?.url?.get();

		if (!token || !url) {
			throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		}

		// url += url.endsWith("/") ? "api/v1/pam/update_data" : "/api/v1/pam/update_data";

		return axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } }).then((result) => {
			plateform.info.mod_attr("lastSyncTime", Date.now());
			return plateform.info.get();
		})

	}


	// update the token in graph
	public async updateTokenAdminBosInGraph(platform: string | SpinalNode, token: string): Promise<string> {
		if (typeof platform === "string") {
			const [platformNode] = await this.getPlatformsNodes(platform);
			platform = platformNode;
		}
		if (!token) return "";

		platform.info.mod_attr("TokenAdminBos", token.trim());
		return token;
	}




	public async getPlateformLogs(id: string): Promise<IPlatformLogs[]> {
		try {
			const [platform] = await this.getPlatformsNodes(id);
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

	public async getRegisterKeySpinalNode(): Promise<SpinalNode> {
		const context = await this.getRegisterKeyContext();
		const childrens = await context.getChildren(AUTH_SERVICE_INFO_ADMIN_RELATION_NAME);
		return childrens.find((child) => child.getName().get() === "registerKey");
	}

	public async getPlatformsNodes(id?: string): Promise<SpinalNode[]> {
		const context = await this.getContext();
		const nodes = await context.getChildren(AUTH_SERVICE_PLATFORM_RELATION_NAME);
		if (!id) return nodes;

		return nodes.filter((platform) => platform.getId().get() === id || platform.info.clientId?.get() === id);
	}

	public async getPlatformByClientId(clientId: string): Promise<SpinalNode> {
		const nodes = await this.getPlatformsNodes();
		return nodes.find((platform) => platform.info.clientId?.get() === clientId);
	}

	public async addLoginServerToPlatform(platform: SpinalNode, ids: string[] = []): Promise<SpinalNode[]> {
		const nodes = await loginService.getServeralServersById(ids);
		const promises = nodes.map(el => platform.addChild(el, PLATFORM_TO_LOGIN_SERVER, SPINAL_RELATION_PTR_LST_TYPE));
		return Promise.all(promises);
	}

	public async removeLoginServerFromPlatform(platform: SpinalNode | string, ids: string[] = []): Promise<string[]> {
		const nodes = await loginService.getServeralServersById(ids);
		if (nodes.length === 0) return [];

		if (typeof platform === "string") {
			const [p] = await this.getPlatformsNodes(platform);
			platform = p;
		}
		await platform.removeChildren(nodes, PLATFORM_TO_LOGIN_SERVER, SPINAL_RELATION_PTR_LST_TYPE);
		return ids;
	}

	public async editLoginServerLink(platform: SpinalNode, loginServerIds: string[]) {
		const servers = await this.getLoginServerFromPlatform(platform);
		const idsObj = servers.reduce((obj, el) => {
			const id = el.getId().get();
			obj[id] = el;
			return obj;
		}, {});

		const idsToAdd = [];

		for (const id of loginServerIds) {
			if (idsObj[id]) delete idsObj[id];
			else idsToAdd.push(id);
		}

		const toDelete = Array.from(Object.keys(idsObj));

		const promises = [this.addLoginServerToPlatform(platform, idsToAdd), this.removeLoginServerFromPlatform(platform, toDelete)];

		return Promise.all(promises);

	}

	public async getLoginServerFromPlatform(platform: string | SpinalNode): Promise<SpinalNode[]> {
		if (typeof platform === "string") {
			let [_n] = await this.getPlatformsNodes(platform);
			platform = _n;
		}

		let node = platform;

		if (!node) return [];

		return node.getChildren(PLATFORM_TO_LOGIN_SERVER);
	}

	public _formatPlatform(platform: SpinalNode): IPlatform {
		return {
			id: platform.getId().get(),
			type: platform.getType().get(),
			name: platform.getName().get(),
			statusPlatform: platform.info.statusPlatform?.get(),
			url: platform.info.url?.get(),
			redirectUrl: platform.info.redirectUrl?.get(),
			address: platform.info.address?.get(),
			TokenBosAdmin: platform.info.TokenBosAdmin?.get(),
			TokenAdminBos: platform.info.TokenAdminBos?.get(),
			idPlatformOfAdmin: platform.info.idPlatformOfAdmin?.get(),
			clientId: platform.info.clientId?.get(),
			clientSecret: platform.info.clientSecret?.get(),
			lastSyncTime: platform.info.lastSyncTime?.get(),
			grant_types: platform.info.grant_types?.get() || [],
			// authentication_method: platform.info.authentication_method?.get(),
			// authentication_info: platform.info.authentication_info?.get(),
		};
	}

	private _verifyAuthInfo(authentication_method: CONNECTION_METHODS, authentication_info: ISAMLAuthenticationInfo | IOAuthAuthenticationInfo | ILocalAuthenticationInfo): Boolean {

		switch (authentication_method) {
			case CONNECTION_METHODS.local:
				return isLocalAuthenticationInfo(authentication_method);

			case CONNECTION_METHODS.oauth2:
				return isOAuthAuthenticationInfo(authentication_info);

			case CONNECTION_METHODS.saml:
				return isSAMLAuthenticationInfo(authentication_info);

			default:
				return false;
		}
	}

	private _formatPlatformCreationParams(platformCreationParms: IPlateformCreationParams) {
		let grant_types = platformCreationParms.grant_types || [];
		if (!Array.isArray(grant_types)) grant_types = [grant_types];

		return Object.assign({}, platformCreationParms, {
			clientSecret: platformCreationParms.clientSecret,
			url: platformCreationParms.url || platformCreationParms.redirectUrl,
			redirectUrl: platformCreationParms.redirectUrl || platformCreationParms.url,
			address: platformCreationParms.address || "",
			statusPlatform: statusPlatform["not connected"],
			grant_types
			// ...(platformCreationParms.authentication_method === CONNECTION_METHODS.local && {
			// 	authentication_info: {
			// 		code_challenge: "sdfsdfsdfsdf", // generate code challenge
			// 		code_challenge_method: "S256"
			// 	}
			// })
		});
	}

}

async function updateOrganProfile(oldOrgans: SpinalNode<any>[], platform: SpinalNode<any>, newList: any[]) {
	var arrayDelete = [];
	var arrayCreate = [];
	for (const oldOrgan of oldOrgans) {
		const resSome = newList.some((it) => {
			return it.label === oldOrgan.getName().get();
		});
		if (resSome === false) {
			arrayDelete.push(oldOrgan);
		}
	}
	for (const newOrgan of newList) {
		const resSome = oldOrgans.some((it) => {
			return it.getName().get() === newOrgan.label;
		});

		if (resSome === false) {
			arrayCreate.push(newOrgan);
		}
	}
	for (const organ of arrayDelete) {
		await organ.removeFromGraph();
	}
	const organService = OrganService.getInstance();
	for (const organ of arrayCreate) {
		organService.createOrgan({
			name: organ.label,
			organType: organ.type,
			statusOrgan: "online",
			platformId: platform.getId().get(),
		});
	}
}

async function updateAppUserProfile(oldList: SpinalNode<any>[], platform: SpinalNode<any>, newList: any[], type: string) {
	const profileServices = ProfileServices.getInstance();

	var arrayDelete = [];
	var arrayCreate = [];
	if (type === "userProfile") {
		for (const olditem of oldList) {
			const resSome = newList.some((it) => {
				return it.userProfileId === olditem.info.userProfileId.get();
			});
			if (resSome === false) {
				arrayDelete.push(olditem);
			}
		}
		for (const newItem of newList) {
			const resSome = oldList.some((it) => {
				return it.info.userProfileId.get() === newItem.userProfileId;
			});

			if (resSome === false) {
				arrayCreate.push(newItem);
			}
		}
		for (const item of arrayDelete) {
			await item.removeFromGraph();
		}

		for (const item of arrayCreate) {
			profileServices.createUserProfileService({
				userProfileId: item.userProfileId,
				name: item.label,
				platformId: platform.getId().get(),
			});
		}
	} else if (type === "appProfile") {
		for (const olditem of oldList) {
			const resSome = newList.some((it) => {
				return it.appProfileId === olditem.info.appProfileId.get();
			});
			if (resSome === false) {
				arrayDelete.push(olditem);
			}
		}
		for (const newItem of newList) {
			const resSome = oldList.some((it) => {
				return it.info.appProfileId.get() === newItem.appProfileId;
			});

			if (resSome === false) {
				arrayCreate.push(newItem);
			}
		}
		for (const item of arrayDelete) {
			await item.removeFromGraph();
		}
		for (const item of arrayCreate) {
			profileServices.createAppProfileService({
				appProfileId: item.appProfileId,
				name: item.label,
				platformId: platform.getId().get(),
			});
		}
	}
}
