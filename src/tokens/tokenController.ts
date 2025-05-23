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
import { IToken, IUserToken, IApplicationToken } from "./token.model";
import { TokensService } from "./tokenService";
import { HttpStatusCode } from "../utilities/http-status-code";

@Route("tokens")
export class TokensController extends Controller {
	@Security("jwt", ["authAdmin"])
	@Get("")
	public async getTokens(): Promise<IToken[] | { error: string }> {
		try {
			const tokens = await TokensService.getInstance().getTokens();
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return tokens;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin"])
	@Get("/UserToken")
	public async getUserTokens(): Promise<IToken[] | { error: string }> {
		try {
			const userTokens = await TokensService.getInstance().getUserTokens();
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return userTokens;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["authAdmin"])
	@Get("/ApplicationToken")
	public async getApplicationTokens(): Promise<IToken[] | { error: string }> {
		try {
			const applicationTokens = await TokensService.getInstance().getApplicationTokens();
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return applicationTokens;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["ownData"])
	@Post("/getUserProfileByToken")
	public async getUserProfileByToken(@Body() requestBody: any): Promise<any> {
		try {
			const profile = await TokensService.getInstance().getUserProfileByToken(requestBody.token, requestBody.platformId);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return profile;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["ownData"])
	@Post("/getAppProfileByToken")
	public async getAppProfileByToken(@Body() requestBody: any): Promise<any> {
		try {
			const profile = await TokensService.getInstance().getAppProfileByToken(requestBody.token, requestBody.platformId);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return profile;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Security("jwt", ["ownData"])
	@Post("/getCodeProfileByToken")
	public async getCodeProfileByToken(@Body() requestBody: { token: string, platformId: string; }): Promise<any> {
		try {
			const profile = await TokensService.getInstance().getCodeProfileByToken(requestBody.token, requestBody.platformId);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return profile;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}

	@Post("/verifyToken")
	public async verifyToken(@Body() requestBody: any): Promise<any> {
		try {
			const verifiedToken = await TokensService.getInstance().verifyToken(requestBody.tokenParam, requestBody.actor);
			this.setStatus(HttpStatusCode.OK); // set return status 201
			return verifiedToken;
		} catch (error) {
			this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
			return { error: error.message };
		}
	}
}
