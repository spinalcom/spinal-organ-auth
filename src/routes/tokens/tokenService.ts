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

import {
	TOKEN_TYPE,
	AUTH_SERVICE_TOKEN_RELATION_NAME,
	TOKEN_LIST,
	AUTH_SERVICE_RELATION_TYPE_PTR_LST,
	USER_TOKEN_CATEGORY_TYPE,
	APPLICATION_TOKEN_CATEGORY_TYPE,
	AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME,
	APPLICATION_TYPE,
	CONNECTION_METHODS,
	USER_PROFILE_TYPE,
	CODE_TOKEN_CATEGORY_TYPE
} from "../../constant";
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { OperationError } from "../../utilities/operation-error";
import { HttpStatusCode } from "../../utilities/http-status-code";
import SpinalMiddleware from "../../spinalMiddleware";
import jwt_decode from "jwt-decode";
import { Token, Client, User } from "@node-oauth/oauth2-server";
import { RefreshTokenService } from "./refreshTokenService";
import { IPlatform } from "../platform/platform.model";
import { ApplicationService } from "../authApplication/applicationService";
import { UserService } from "../authUser/userService";
import { ITokenActor } from "./token.model";
const jwt = require("jsonwebtoken");

export class TokensService {
	context: SpinalContext;
	static instance: TokensService;

	private constructor() { }

	static getInstance(): TokensService {
		if (!this.instance) this.instance = new TokensService();
		return this.instance;
	}

	public async getTokenListContext(): Promise<SpinalContext> {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		return graph.getContext(TOKEN_LIST);
	}

	public async createTokenListContext(): Promise<SpinalContext> {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		let context = new SpinalContext(TOKEN_LIST);
		return graph.addContext(context);
	}

	public generateTokenKey() {
		// let key = process.env.TOKEN_SECRET || generator.generate({ length: 30, numbers: true, uppercase: true, strict: true });
		let key = process.env.TOKEN_SECRET;
		// setEnvValue("TOKEN_SECRET", key);
		return key;
	}


	public generateToken(tokenData: any, actor: ITokenActor = "application") {
		const secret = this.generateTokenKey();
		return jwt.sign(tokenData, secret, { expiresIn: this._getTokenExpirationTime(actor) });

	}


	public async addTokenToContext(tokenNode: SpinalNode, actor: ITokenActor) {
		const context = await this.getTokenListContext();
		let tokenCategory = await this.getTokenCategory(actor);

		return tokenCategory.addChildInContext(tokenNode, AUTH_SERVICE_TOKEN_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context);
	}


	public async createToken(node: SpinalNode, tokenData: any, platformList: any[], actor: ITokenActor) {
		const token = this.generateToken(tokenData, actor);
		let decodedToken: any = jwt_decode(token);

		const tokenNode = new SpinalNode(`token_${node.getName().get()}`, TOKEN_TYPE);
		tokenNode.info.add_attr({
			token: token,
			authType: CONNECTION_METHODS.local,
			createdToken: decodedToken.iat,
			expieredToken: decodedToken.exp,
			platformList: platformList || [],
			...(actor === "application" && { applicationId: node.getId().get() }),
			...(actor === "user" && { userId: node.getId().get() }),
			...(actor === "code" && { userId: node.getId().get(), applicationId: node.getId().get() }),
			...(node.info?.scope && { scope: node.info.scope.get() }),
		});


		await node.addChild(tokenNode, AUTH_SERVICE_TOKEN_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
		return this.addTokenToContext(tokenNode, actor);

	}

	public async createSSOToken(tokenData: any, platform: IPlatform) {

		const token = this.generateToken(tokenData);
		let decodedToken: any = jwt_decode(token);

		const tokenNode = new SpinalNode(`token_${tokenData.userId}`, TOKEN_TYPE);

		tokenNode.info.add_attr({
			token,
			authType: CONNECTION_METHODS.saml,
			createdToken: decodedToken.iat,
			expieredToken: decodedToken.exp,
			userId: tokenData.userId,
			platformList: [
				{
					platformId: platform.id,
					platformName: platform.name,
					idPlatformOfAdmin: platform.idPlatformOfAdmin,
					userProfile: tokenData.profile
					// userProfileId: tokenData.profile.userProfileBosConfigId,
					// platformId: platform.id,
					// type: USER_PROFILE_TYPE,
					// name: tokenData.userInfo.name
				}
			],
		})

		return this.addTokenToContext(tokenNode, "user");
	}

	public async saveOAuthToken(token: Token, client: Client, user: User) {
		const actor = user.type === APPLICATION_TYPE ? "application" : "user";

		const tokenNode = new SpinalNode(`token_${user.name}`, TOKEN_TYPE);
		tokenNode.info.add_attr({
			token: token.accessToken,
			authType: CONNECTION_METHODS.oauth2,
			createdToken: new Date().getTime(),
			expieredToken: token.accessTokenExpiresAt.getTime(),
			...(actor === "application" && { applicationId: user.id }),
			...(actor === "user" && { userId: user.id }),
			...(token.scope && { scope: token.scope }),
			platformList: await this._getPlatformList(actor, client, user) || [],
			client,
			user,
		});

		const context = await this.getTokenListContext();
		let tokenCategory = await this.getTokenCategory(actor);

		return tokenCategory.addChildInContext(tokenNode, AUTH_SERVICE_TOKEN_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, context).then(async (result) => {
			if (token.refreshToken && token.refreshTokenExpiresAt) {
				await RefreshTokenService.getInstance().saveRefreshToken(token, client, user, tokenNode);
			}

			return result;
		});
	}

	public async getTokenCategory(actor: ITokenActor): Promise<SpinalNode> {
		const context = await this.getTokenListContext();

		const categoriesToken = await context.getChildren(AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME);
		const type = this._getTokenCategoryType(actor);

		return categoriesToken.find((el) => el.getType().get() === type);
	}

	public async createTokenTree(): Promise<SpinalNode[]> {
		const context = await this.getTokenListContext();
		const categoryNodes = await context.getChildren(AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME);

		let userTokenCategory = categoryNodes?.find((el) => el.getType().get() === USER_TOKEN_CATEGORY_TYPE);
		let appTokenCategory = categoryNodes?.find((el) => el.getType().get() === APPLICATION_TOKEN_CATEGORY_TYPE);
		let codeTokenCategory = categoryNodes?.find((el) => el.getType().get() === CODE_TOKEN_CATEGORY_TYPE);

		if (!userTokenCategory) {
			let node = new SpinalNode("User Token", USER_TOKEN_CATEGORY_TYPE);
			userTokenCategory = await context.addChildInContext(node, AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
		}

		if (!appTokenCategory) {
			let node = new SpinalNode("Application Token", APPLICATION_TOKEN_CATEGORY_TYPE);
			appTokenCategory = await context.addChildInContext(node, AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
		}

		if (!codeTokenCategory) {
			let node = new SpinalNode("Code Token", CODE_TOKEN_CATEGORY_TYPE);
			codeTokenCategory = await context.addChildInContext(node, AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
		}

		return [userTokenCategory, appTokenCategory, codeTokenCategory];
	}

	// public async verify(): Promise<any[]> {
	// 	const tokens = await this.getAllTokensNode();
	// 	const promises = tokens.map((token) => {
	// 		if (Math.floor(Date.now() / 1000) > token.info?.expieredToken.get()) return token.removeFromGraph();
	// 	});

	// 	return Promise.all(promises);
	// }

	public async getTokens() {
		const tokens = await this.getAllTokensNode();
		return tokens.map(this._formatToken);
	}

	public async getUserTokens() {
		const userTokens = await this._getUserTokensNode();
		return userTokens.map(this._formatToken);
	}

	public async getApplicationTokens() {
		const appTokens = await this._getApplicationTokensNode();
		return appTokens.map(this._formatToken);
	}

	public async getCodeTokens() {
		const appTokens = await this._getCodeTokensNode();
		return appTokens.map(this._formatToken);
	}

	public async verifyToken(tokenParam: string, actor?: ITokenActor) {
		const type = this._getTokenCategoryType(actor);

		let tokens = type ? await this.getTokenByCategoryType(type) : await this.getAllTokensNode();

		if (!tokens) throw new OperationError("UNKNOWN_TOKEN", HttpStatusCode.UNAUTHORIZED);

		const token = tokens.find((el) => el.info?.token?.get() === tokenParam);
		if (!token) throw new OperationError("UNKNOWN_TOKEN", HttpStatusCode.UNAUTHORIZED);


		try {
			const token_secret = this.generateTokenKey();
			const decoded = jwt.verify(token.info.token.get(), token_secret);

			const copy = Object.assign({
				createdToken: decoded.iat,
				expieredToken: decoded.exp,
				token: tokenParam
			}, decoded);

			delete copy.iat;
			delete copy.exp;

			return copy;
		} catch (error) {
			throw error;
		}



		// const expirationDate = token.info.expieredToken.get() * 1000;
		// const now = Date.now();
		// if (Date.now() > expirationDate) throw new OperationError("TOKEN_EXPIRED", HttpStatusCode.UNAUTHORIZED);

		// return {
		// 	token: token.info.token.get(),
		// 	createdToken: token.info.createdToken.get(),
		// 	expieredToken: token.info.expieredToken.get(),
		// 	status: "token valid",
		// };
	}

	public async getTokenInfo(tokenParam: string) {
		const tokens = await this.getAllTokensNode();
		const token = tokens.find((el) => el.info?.token?.get() === tokenParam);
		if (token) return this._formatToken(token);
	}

	/////////////////////////////// PROFILE //////////////////////////////////////

	public async getUserProfileByToken(Token: string, platformId: string) {
		const token = await this.getTokenNode(Token);

		if (!token || !token.info?.platformList) return;

		const platforms = token.info.platformList.get();
		const platform = platforms.find((el) => el.platformId === platformId);
		if (!platform) return;

		return {
			token: Token,
			platformId: platformId,
			userProfileName: platform.userProfile.userProfileName,
			userProfileBosConfigId: platform.userProfile.userProfileBosConfigId,
		};
	}



	public async getAppProfileByToken(token: string, platformId: string) {
		const tokenNode = await this.getTokenNode(token);
		if (!tokenNode || tokenNode.info?.platformList) return;

		const platforms = tokenNode.info.platformList.get();

		const platform = platforms.find((el) => el.platformId === platformId);
		if (!platform) return;
		return {
			token,
			platformId: platformId,
			appProfileName: platform.appProfile.appProfileName,
			appProfileBosConfigId: platform.appProfile.appProfileBosConfigId,
		};
	}

	public async removeToken(token: string | SpinalNode): Promise<boolean> {
		try {
			if (!(token instanceof SpinalNode)) token = await this.getTokenNode(token);

			if (!token) return false;

			await token.removeFromGraph();
			return true;
		} catch (error) {
			return false;
		}
	}

	async getTokenNode(token: string): Promise<SpinalNode> {
		const tokens = await this.getAllTokensNode(token);
		return tokens.find((el) => el.info?.token?.get() === token);
	}

	/////////////////////////////// PURGE //////////////////////////////////////

	public async purgeInvalidToken() {
		const tokens = await this.getAllTokensNode();
		const now = Math.floor(Date.now() / 1000);
		const promises = tokens.map(async (token) => {
			if (now >= token.info.expieredToken.get()) return this.removeToken(token);
		});

		return Promise.all(promises);
	}

	public getAllTokensNode(token?: string): Promise<SpinalNode[]> {
		return Promise.all([this._getApplicationTokensNode(), this._getUserTokensNode(), this._getCodeTokensNode()]).then((result) => {
			if (!token) return result.flat();
			return result.flat().filter((el) => el.info?.token?.get() === token);
		});
	}

	async getTokenByCategoryType(categoryType: string): Promise<SpinalNode[]> {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		const context = await graph.getContext(TOKEN_LIST);
		const categoriesToken = await context.getChildren(AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME);
		const categoryNode = categoriesToken.find((el) => el.getType().get() === categoryType);
		if (!categoryNode) return [];

		return categoryNode.getChildren(AUTH_SERVICE_TOKEN_RELATION_NAME);
	}

	private async _getUserTokensNode(): Promise<SpinalNode[]> {
		return this.getTokenByCategoryType(USER_TOKEN_CATEGORY_TYPE)
	}

	private async _getApplicationTokensNode(): Promise<SpinalNode[]> {
		return this.getTokenByCategoryType(APPLICATION_TOKEN_CATEGORY_TYPE)
	}

	private async _getCodeTokensNode(): Promise<SpinalNode[]> {
		return this.getTokenByCategoryType(CODE_TOKEN_CATEGORY_TYPE)
	}

	private _formatToken(token: SpinalNode) {
		return {
			id: token.getId().get(),
			type: token.getType().get(),
			name: token.getName().get(),
			token: token.info?.token?.get(),
			createdToken: token.info?.createdToken?.get(),
			expieredToken: token.info?.expieredToken?.get(),
			userId: token.info?.userId?.get(),
			userType: token.info?.userType?.get(),
			applicationId: token.info?.applicationId?.get(),
		};
	}

	private _getPlatformList(actor: string, client: Client, user: User) {
		if (actor === "application") {
			return ApplicationService.getInstance()._getAppPlatformsByClientId((client.client_id as string));
		} else {
			return UserService.getInstance().getUserPlatformList(user.id, client.id);
		}
	}

	private _getTokenCategoryType(actor: ITokenActor): string {
		switch (actor) {
			case "user":
				return USER_TOKEN_CATEGORY_TYPE;
			case "application":
			case "app":
				return APPLICATION_TOKEN_CATEGORY_TYPE;
			case "code":
				return CODE_TOKEN_CATEGORY_TYPE;
		}
	}

	private _getTokenExpirationTime(actor: ITokenActor): string {
		switch (actor) {
			case "user":
			case "application":
			case "app":
				return "24h";
			case "code":
				return "1000y";
		}
	}
}

// 'UNKNOWN_TOKEN'
// 'TOKEN_EXPIRED'
