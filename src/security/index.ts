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

import * as express from "express";
import * as jwt from "jsonwebtoken";
import { AuthError } from "./AuthError";
import { HttpStatusCode } from "../utilities/http-status-code";
import { TokensService } from "../routes/tokens/tokenService";
import { SCOPES } from "../constant";
import { AuthServerModel } from "../SSO/oauth/AuthServerModel";
import { InsufficientScopeError, InvalidTokenError, Token } from "@node-oauth/oauth2-server";
// import { spinalOAuth2Server } from "../oauth";

export async function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
	try {
		if (securityName !== "jwt") return;

		const token = getToken(request);

		if (!token) throw new Error("No token provided");

		let tokenInfo = await getTokenInfo(token);
		tokenInfo = await validateAccessToken(tokenInfo);
		// if (scopes) await verifyScope(tokenInfo, scopes);

		return tokenInfo;
	} catch (error) {
		throw new AuthError(HttpStatusCode.UNAUTHORIZED, error.message);
	}

	// return new Promise((resolve, reject) => {
	// 	const secret = TokensService.getInstance().generateTokenKey();
	// 	jwt.verify(token, secret, function (err: any, decoded: any) {
	// 		if (err) return reject(new AuthError(HttpStatusCode.UNAUTHORIZED, err.message));

	// 		for (let scope of scopes) {
	// 			if (!decoded.scopes.includes(scope)) {
	// 				return reject(new AuthError(HttpStatusCode.UNAUTHORIZED, "JWT does not contain required scope."));
	// 			}
	// 		}

	// 		return resolve(decoded);
	// 	});
	// });

	// spinalOAuth2Server
	// 	.verifyToken(request, null)
	// 	.then((result) => {
	// 		return result;
	// 	})
	// 	.catch((err) => {
	// 		throw new AuthError(HttpStatusCode.UNAUTHORIZED, err.message);
	// 	});
}

export function getToken(request: express.Request): string {
	const header = request.headers.authorization || request.headers.Authorization;

	if (header) {
		const splitted = (<string>header).split(" ");
		const token = splitted[splitted.length - 1];
		if (token) return token;
	}

	return request.body?.token || request.query?.token || request.headers["x-access-token"];
}

export async function getTokenInfo(token: string): Promise<Token> {
	const accessToken = await AuthServerModel.instance.getAccessToken(token);

	if (!accessToken) {
		throw new InvalidTokenError("Invalid token: access token is invalid");
	}

	return accessToken;
}

export function validateAccessToken(accessToken): Token {
	if (accessToken.accessTokenExpiresAt < new Date()) {
		throw new InvalidTokenError("Invalid token: access token has expired");
	}

	return accessToken;
}

async function verifyScope(accessToken: Token, scope: string[]) {
	const verifedScope = await AuthServerModel.instance.verifyScope(accessToken, scope);

	if (!verifedScope) {
		throw new InsufficientScopeError("Insufficient scope: authorized scope is insufficient");
	}
}
