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

import { APPLICATION_LIST, AUTH_SERVICE_APPLICATION_RELATION_NAME, APPLICATION_TYPE, AUTH_SERVICE_RELATION_TYPE_PTR_LST, TOKEN_TYPE, TOKEN_LIST, AUTH_SERVICE_TOKEN_RELATION_NAME, PLATFORM_TYPE, AUTH_SERVICE_APP_PROFILE_RELATION_NAME, AUTH_SERVICE_LOG_RELATION_NAME, APPLICATION_LOG_CATEGORY_NAME, EVENTS_NAMES, EVENTS_REQUEST_NAMES } from "../../constant";

import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";

import { OperationError } from "../../utilities/operation-error";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { IApplication, IApplicationCreationParams, IApplicationUpdateParams, IApplicationLoginParams, IApplicationLogs } from "./application.model";
import { IApplicationToken } from "../tokens/token.model";
import SpinalMiddleware from "../../spinalMiddleware";
import { LogsService } from "../logs/logService";
import { PlatformService } from "../platform/platformServices";
import { TokensService } from "../tokens/tokenService";

export class ApplicationService {
	public context: SpinalContext;
	static instance: ApplicationService;

	private constructor() { }

	static getInstance(): ApplicationService {
		if (!this.instance) this.instance = new ApplicationService();
		return this.instance;
	}

	public async getProfile(platformId: string, profileIdBosConfig: string) {
		return PlatformService.getInstance().getAppProfile(platformId, profileIdBosConfig);
	}

	public async getApplicationListContext() {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		return graph.getContext(APPLICATION_LIST);
	}

	public async createApplicationListContext() {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		const context = new SpinalContext(APPLICATION_LIST);
		return graph.addContext(context);
	}

	public async createApplication(applicationCreationParams: IApplicationCreationParams): Promise<IApplication> {
		const context = await this.getApplicationListContext();

		const applicationObject = {
			// appType: applicationCreationParams.appType,
			clientId: applicationCreationParams.clientId,
			clientSecret: applicationCreationParams.clientSecret,
			redirectUri: applicationCreationParams.redirectUri || "",
			grant_types: applicationCreationParams.grant_types || [],
		};

		const application = new SpinalNode(applicationCreationParams.name, APPLICATION_TYPE);
		application.info.add_attr(applicationObject);

		const res = await context.addChildInContext(application, AUTH_SERVICE_APPLICATION_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context);

		return this._addAppProfileToApplication(res, applicationCreationParams.platformList);
	}

	public async login(applicationLoginParams: IApplicationLoginParams): Promise<IApplicationToken> {
		const app = await this.findApplicationByClientId(applicationLoginParams.clientId);

		if (!app || applicationLoginParams.clientSecret !== app.info?.clientSecret?.get()) {
			await LogsService.getInstance().createLog(undefined, APPLICATION_LOG_CATEGORY_NAME, EVENTS_NAMES.CONNECTION, EVENTS_REQUEST_NAMES.LOGIN_NOT_VALID, "Login Not Valid Unknown Client Id && Client Secret ");
			throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		}

		const platforms = await this._getApplicationPlatforms(app);
		const platformList = this._formatPlatForms(platforms);
		const tokenNode = await TokensService.getInstance().createToken(app, { applicationId: app.getId().get() }, platformList, "application");

		await LogsService.getInstance().createLog(app, APPLICATION_LOG_CATEGORY_NAME, EVENTS_NAMES.CONNECTION, EVENTS_REQUEST_NAMES.LOGIN_VALID, EVENTS_REQUEST_NAMES.LOGIN_VALID);
		return {
			name: tokenNode.getName().get(),
			type: tokenNode.getType().get(),
			token: tokenNode.info.token?.get(),
			createdToken: tokenNode.info.createdToken?.get(),
			expieredToken: tokenNode.info.expieredToken?.get(),
			applicationId: app.getId().get(),
			platformList: platformList,
		};
	}

	private async findApplicationByClientId(client_id: string) {
		const applications = await this.getApplicationNodes();
		const app = applications.find((app) => client_id === app.info.clientId?.get());
		return app;
	}

	public async _getAppPlatformsByClientId(app: string | SpinalNode) {
		const application = typeof app === "string" ? await this.findApplicationByClientId(app) : app;
		const platforms = await this._getApplicationPlatforms(application);
		return this._formatPlatForms(platforms);
	}

	public async getApplications() {
		const applications = await this.getApplicationNodes();

		const promises = applications.map(async (app) => {
			const platforms = await this._getApplicationPlatforms(app);
			return this._formatApplication(app, platforms);
		});

		return Promise.all(promises).then((result) => {
			return result;
		});
	}

	public async getApplication(id: string): Promise<IApplication> {
		const [app] = await this.getApplicationNodes();

		if (!app) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

		const platformList = await this._getApplicationPlatforms(app);
		return this._formatApplication(app, platformList);
	}

	public async updateApplication(applicationId: string, requestBody: IApplicationUpdateParams): Promise<IApplication> {
		const [app] = await this.getApplicationNodes(applicationId);
		if (!app) {
			await LogsService.getInstance().createLog(app, APPLICATION_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID, EVENTS_REQUEST_NAMES.EDIT_NOT_VALID);
			throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		}

		const keys = ["name", "clientId", "clientSecret", "appType", "grant_types"];

		for (const key of keys) {
			if (requestBody[key] !== undefined && app.info[key] !== undefined) {
				app.info[key].set(requestBody[key]);
			}
		}

		const oldAppProfileList = await app.getChildren(AUTH_SERVICE_APP_PROFILE_RELATION_NAME);
		const newAppPlatformList = requestBody.platformList;
		await updateAppProfileList(oldAppProfileList, newAppPlatformList, app);

		var platformList = await this._getApplicationPlatforms(app);

		await LogsService.getInstance().createLog(app, APPLICATION_LOG_CATEGORY_NAME, EVENTS_NAMES.EDIT, EVENTS_REQUEST_NAMES.EDIT_VALID, EVENTS_REQUEST_NAMES.EDIT_VALID);
		return this._formatApplication(app, platformList);
	}

	public async deleteApplication(applicationId: string): Promise<void> {
		const [appFound] = await this.getApplicationNodes(applicationId);

		if (appFound) {
			await LogsService.getInstance().createLog(appFound, APPLICATION_LOG_CATEGORY_NAME, EVENTS_NAMES.DELETE, EVENTS_REQUEST_NAMES.DELETE_VALID, EVENTS_REQUEST_NAMES.DELETE_VALID);
			await appFound.removeFromGraph();
		} else {
			await LogsService.getInstance().createLog(appFound, APPLICATION_LOG_CATEGORY_NAME, EVENTS_NAMES.DELETE, EVENTS_REQUEST_NAMES.DELETE_NOT_VALID, "Delete Not Valid, User Not Found");
			throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		}
	}

	public async getInfoToken(tokenParam: string) {
		return TokensService.getInstance().getTokenInfo(tokenParam);
	}

	public async getApplicationLogs(id: string): Promise<IApplicationLogs[]> {
		const context = await this.getApplicationListContext();
		const platforms = await context.getChildren(AUTH_SERVICE_APPLICATION_RELATION_NAME);

		const platform = platforms.find((platform) => platform.getId().get() === id);
		if (!platform) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

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
	}

	public async getApplicationNodes(id?: string): Promise<SpinalNode[]> {
		const context = await this.getApplicationListContext();
		const applications = await context.getChildren(AUTH_SERVICE_APPLICATION_RELATION_NAME);

		if (!id) return applications;
		return applications.filter((app) => app.getId().get() === id);
	}

	///////////////////////////////////////// PRIVATE FUNCTIONS /////////////////////////////////////////

	private async _getApplicationPlatforms(application: SpinalNode): Promise<{ platform: SpinalNode; profile: SpinalNode }[]> {
		const profiles = await this._getApplicationAppProfile(application);
		const promises = profiles.map(async (profile) => ({
			profile,
			platform: await this._getPlatFormByProfile(profile),
		}));

		return Promise.all(promises);
	}

	private _addAppProfileToApplication(application: SpinalNode, platformList: any[]) {
		const promises = platformList.map(async (platform) => {
			const pro = await this.getProfile(platform.platformId, platform.appProfile.appProfileId);
			return application.addChild(pro, AUTH_SERVICE_APP_PROFILE_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
		});

		return Promise.all(promises)
			.then(async () => {
				await LogsService.getInstance().createLog(application, APPLICATION_LOG_CATEGORY_NAME, EVENTS_NAMES.CREATE, EVENTS_REQUEST_NAMES.CREATE_VALID, EVENTS_REQUEST_NAMES.CREATE_VALID);
				return this._formatApplication(application);
			})
			.catch(async (err) => {
				await LogsService.getInstance().createLog(application, APPLICATION_LOG_CATEGORY_NAME, EVENTS_NAMES.CREATE, EVENTS_REQUEST_NAMES.CREATE_NOT_VALID, EVENTS_REQUEST_NAMES.CREATE_NOT_VALID);
				throw new OperationError("NOT_CREATED", HttpStatusCode.BAD_REQUEST);
			});
	}

	private _getApplicationAppProfile(application: SpinalNode): Promise<SpinalNode[]> {
		return application.getChildren(AUTH_SERVICE_APP_PROFILE_RELATION_NAME);
	}

	private async _getPlatFormByProfile(profileNode: SpinalNode): Promise<SpinalNode> {
		const parents = await profileNode.getParents(AUTH_SERVICE_APP_PROFILE_RELATION_NAME);
		for (const parent of parents) {
			if (parent.getType().get() === PLATFORM_TYPE) {
				return parent;
			}
		}
	}

	private _formatApplication(application: SpinalNode, platformList?: { platform: SpinalNode; profile: SpinalNode }[]) {
		return {
			id: application.getId().get(),
			type: application.getType().get(),
			name: application.getName().get(),
			appType: application.info.appType?.get() || "",
			grant_types: application.info.grant_types?.get() || [],
			clientId: application.info.clientId.get(),
			clientSecret: application.info.clientSecret.get(),
			...(platformList && { platformList: this._formatPlatForms(platformList) as any }),
		};
	}

	private _formatPlatForms(platformList: { platform: SpinalNode; profile: SpinalNode }[]) {
		return platformList.map(({ platform, profile }) => ({
			platformId: platform.getId().get(),
			platformName: platform.getName().get(),
			idPlatformOfAdmin: platform.info.idPlatformOfAdmin?.get(),
			appProfile: {
				appProfileAdminId: profile.getId().get(),
				appProfileBosConfigId: profile.info.appProfileId.get(),
				appProfileName: profile.getName().get(),
			},
		}));
	}
}

async function updateAppProfileList(oldAppProfileList: SpinalNode<any>[], newAppPlatformList: any[], app: SpinalNode<any>) {
	const graph = await SpinalMiddleware.getInstance().getGraph();
	var arrayDelete = [];
	var arrayCreate = [];
	for (const olditem of oldAppProfileList) {
		const resSome = newAppPlatformList.some((it) => {
			return it.appProfile.appProfileAdminId === olditem.getId().get();
		});
		if (resSome === false) {
			arrayDelete.push(olditem);
		}
	}
	for (const newItem of newAppPlatformList) {
		const resSome = oldAppProfileList.some((it) => {
			return it.getId().get() === newItem.appProfile.appProfileAdminId;
		});
		if (resSome === false) {
			arrayCreate.push(newItem);
		}
	}
	for (const arrdlt of arrayDelete) {
		await app.removeChild(arrdlt, AUTH_SERVICE_APP_PROFILE_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
	}
	for (const arrcrt of arrayCreate) {
		const realNode = await getrealNodeProfile(arrcrt.appProfile.appProfileAdminId, arrcrt.platformId, graph);
		await app.addChild(realNode, AUTH_SERVICE_APP_PROFILE_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
	}
}

async function getrealNodeProfile(profileId: string, platformId: string, graph: SpinalGraph<any>) {
	const contexts: SpinalNode<any>[] = await graph.getChildren("hasContext");
	for (const context of contexts) {
		const platforms = await context.getChildren("HasPlatform");
		for (const platform of platforms) {
			if (platform.getId().get() === platformId) {
				const profiles = await platform.getChildren(AUTH_SERVICE_APP_PROFILE_RELATION_NAME);
				for (const profile of profiles) {
					if (profile.getId().get() === profileId) {
						return profile;
					}
				}
			}
		}
	}
}
