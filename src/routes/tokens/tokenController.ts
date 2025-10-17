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

import { Body, Controller, Delete, Get, Path, Post, Put, Query, Res, Route, Security, SuccessResponse } from "tsoa";
import { IToken, IUserToken, IApplicationToken } from "./token.model";
import { TokensService } from "./tokenService";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { createRedirectToBosUrl } from "../../utilities/redirectToBos";
import { session } from "passport";
import { formatResponseHtml } from "../../utilities/formatResponseHtml";
import { Response } from "express";

@Route("tokens")
export class TokensController extends Controller {
	@Security("jwt", ["authAdmin:read"])
	@Get("")
	public async getTokens(): Promise<IToken[] | { error: string }> {
		try {
			const tokens = await TokensService.getInstance().getTokens();
			this.setStatus(HttpStatusCode.OK);
			return tokens;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read"])
	@Get("/UserToken")
	public async getUserTokens(): Promise<IToken[] | { error: string }> {
		try {
			const userTokens = await TokensService.getInstance().getUserTokens();
			this.setStatus(HttpStatusCode.OK);
			return userTokens;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read"])
	@Get("/ApplicationToken")
	public async getApplicationTokens(): Promise<IToken[] | { error: string }> {
		try {
			const applicationTokens = await TokensService.getInstance().getApplicationTokens();
			this.setStatus(HttpStatusCode.OK);
			return applicationTokens;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read", "ownData:read"])
	@Post("/getUserProfileByToken")
	public async getUserProfileByToken(@Body() requestBody: any): Promise<any> {
		try {
			const profile = await TokensService.getInstance().getUserProfileByToken(requestBody.token, requestBody.platformId);
			this.setStatus(HttpStatusCode.OK);
			return profile;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read", "ownData:read"])
	@Post("/getAppProfileByToken")
	public async getAppProfileByToken(@Body() requestBody: any): Promise<any> {
		try {
			const profile = await TokensService.getInstance().getAppProfileByToken(requestBody.token, requestBody.platformId);
			this.setStatus(HttpStatusCode.OK);
			return profile;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin:read", "ownData:read"])
	@Post("/getCodeProfileByToken")
	public async getCodeProfileByToken(@Body() requestBody: any): Promise<any> {
		try {
			const profile = await TokensService.getInstance().getCodeProfileByToken(requestBody.token, requestBody.platformId);
			this.setStatus(HttpStatusCode.OK);
			return profile;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Post("/verifyToken")
	public async verifyToken(@Body() requestBody: any): Promise<any> {
		try {
			const verifiedToken = await TokensService.getInstance().verifyToken(requestBody.tokenParam, requestBody.platformId, requestBody.actor);
			this.setStatus(HttpStatusCode.OK);
			return verifiedToken;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Post("/generate_redirect_url")
	public async createRedirectToBosUrl(@Body() requestBody: { bosurl: string; bosApiUrl: string; token: string; }): Promise<{ sessionId: string } | { error: string }> {
		try {
			const sessionId = await createRedirectToBosUrl(requestBody);
			if (sessionId === null) throw new Error("Failed to create redirect URL");

			this.setStatus(HttpStatusCode.OK);
			return { sessionId };

		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	// @Get("/redirect/{sessionId}")
	// public async redirectToBos(@Path() sessionId: string): Promise<string | { error: string }> {
	// 	// public async redirectToBos(@Path() sessionId: string, @Res() res: Response): Promise<void> {
	// 	try {
	// 		const { callbackUrl, tokenInfo } = await getSessionData(sessionId);
	// 		const html = formatResponseHtml(callbackUrl, tokenInfo);
	// 		this.setHeader('Content-Type', 'text/html; charset=utf-8');
	// 		this.setStatus(HttpStatusCode.OK);
	// 		return html;
	// 		// this.setStatus(HttpStatusCode.OK);
	// 		// res.status(HttpStatusCode.OK).send(html);
	// 	} catch (error) {
	// 		this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
	// 		return { error: error.message };

	// 		// const code = error.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
	// 		// res.status(code).send({ error: error.message });
	// 	}
	// }
}
