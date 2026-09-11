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
import { AuthError } from "./AuthError";
import { HttpStatusCode } from "../utilities/http-status-code";
import { TokensService } from "../routes/tokens/tokenService";
import { UserService } from "../routes/authUser/userService";
import { SCOPES } from "../constant";
import { AuthServerModel } from "../SSO/oauth/AuthServerModel";
import { InsufficientScopeError, InvalidTokenError, Token } from "@node-oauth/oauth2-server";

export async function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
	try {
		if (securityName === "all") return;

		if (securityName !== "jwt") throw new AuthError(HttpStatusCode.UNAUTHORIZED, "Invalid security name");

		const token = getToken(request);

		if (!token) throw new Error("No token provided");

		const { decoded, tokenInfo, isPlatformToken } = await verifyToken(token);

		if (isPlatformToken) return tokenInfo;

		const isAdmin = itIsAdmin(tokenInfo, decoded);
		if (isAdmin) return tokenInfo;

		if (scopes) await verifyScope(tokenInfo, scopes);
		if (scopes) await verifySelfScopeOwnership(request, scopes, tokenInfo, decoded, token);
		return tokenInfo;
	} catch (error: any) {
		throw new AuthError(HttpStatusCode.UNAUTHORIZED, error.message);
	}
}

export function getToken(request: express.Request): string {
	const header = request.headers.authorization || request.headers.Authorization;

	if (header) {
		const splitted = (<string>header).split(" ");
		const token = splitted[splitted.length - 1];
		if (token) return token;
	}

	return request.body?.tokenParam || request.body?.token || request.query?.token || request.headers["x-access-token"];
}

export async function verifyToken(token: string): Promise<any> {
	const tokenIstance = TokensService.getInstance();
	const decoded = await tokenIstance.decodeToken(token); // verify token structure
	const tokenInfo = await tokenIstance.getTokenInfo(token); // verify token in graph
	let isPlatformToken = false;

	if (!tokenInfo) {
		const tokenPlat = await tokenIstance.checkIfItsPlatformToken(token);
		if (!tokenPlat) throw new AuthError(HttpStatusCode.UNAUTHORIZED, "Invalid token: access token has expired");

		isPlatformToken = true;
	}

	return { decoded, tokenInfo, isPlatformToken };
}

type ITokenWithScopes = Token & { scope?: string | string[]; scopes?: string | string[]; user?: { scope?: string | string[]; scopes?: string | string[] } };

async function verifyScope(accessToken: Token, scope: string[]) {
	const granted = getTokenScopes(accessToken as ITokenWithScopes);
	const hasScope = scope.some((requiredScope) => granted.includes(requiredScope));

	if (hasScope) return;

	const verifiedScope = await AuthServerModel.instance.verifyScope(accessToken, scope);

	if (!verifiedScope) {
		throw new InsufficientScopeError("Insufficient scope: authorized scope is insufficient");
	}
}

function itIsAdmin(tokenInfo: Token, decoded?: any): boolean {
	if (decoded?.isAuthAdmin) return true;

	return getTokenScopes(tokenInfo as ITokenWithScopes).some((el) => el.includes(SCOPES.authAdmin));
}

function getTokenScopes(tokenInfo: ITokenWithScopes): string[] {
	const tokenScope = tokenInfo?.scope ?? tokenInfo?.scopes ?? tokenInfo?.user?.scope ?? tokenInfo?.user?.scopes;

	if (!tokenScope) return [];
	if (Array.isArray(tokenScope)) return tokenScope;

	if (typeof tokenScope === "string")
		return tokenScope
			.split(" ")
			.map((el) => el.trim())
			.filter(Boolean);

	return [];
}

const SELF_SCOPES = new Set([SCOPES.selfRead, SCOPES.selfUpdate, SCOPES.selfPasswordUpdate]);

function hasSelfScope(scopes?: string[]): boolean {
	if (!scopes) return false;
	return scopes.some((scope) => SELF_SCOPES.has(scope as SCOPES));
}

async function verifySelfScopeOwnership(request: express.Request, scopes: string[], tokenInfo: any, decoded: any, authToken: string): Promise<void> {
	if (!hasSelfScope(scopes)) return;

	const tokenUserId = tokenInfo?.userId || decoded?.userId;
	const tokenApplicationId = tokenInfo?.applicationId || decoded?.applicationId;

	if (request.params?.userId) {
		if (!tokenUserId || tokenUserId !== request.params.userId) {
			throw new AuthError(HttpStatusCode.FORBIDDEN, "Self scope violation: userId mismatch");
		}
	}

	if (request.params?.applicationId || request.params?.applicationid) {
		if (!tokenApplicationId || tokenApplicationId !== (request.params.applicationId || request.params.applicationid)) {
			throw new AuthError(HttpStatusCode.FORBIDDEN, "Self scope violation: applicationId mismatch");
		}
	}

	if (request.params?.userName || request.params?.username) {
		if (!tokenUserId) throw new AuthError(HttpStatusCode.FORBIDDEN, "Self scope violation: missing user identity");

		const requestedUserId = await getUserIdFromUserName(request.params.userName || request.params.username);
		if (!requestedUserId || requestedUserId !== tokenUserId) {
			throw new AuthError(HttpStatusCode.FORBIDDEN, "Self scope violation: userName mismatch");
		}
	}

	if (request.body?.userName || request.body?.username) {
		if (!tokenUserId) throw new AuthError(HttpStatusCode.FORBIDDEN, "Self scope violation: missing user identity");

		const requestedUserId = await getUserIdFromUserName(request.body.userName || request.body.username);
		if (!requestedUserId || requestedUserId !== tokenUserId) {
			throw new AuthError(HttpStatusCode.FORBIDDEN, "Self scope violation: body userName mismatch");
		}
	}

	const bodyToken = request.body?.token || request.body?.tokenParam;
	if (bodyToken && bodyToken !== authToken) {
		throw new AuthError(HttpStatusCode.FORBIDDEN, "Self scope violation: token mismatch");
	}
}

async function getUserIdFromUserName(userName: string): Promise<string | undefined> {
	const users = await UserService.getInstance().getUserNodes();
	const found = users.find((user) => user.info?.userName?.get?.() === userName);
	return found?.getId?.().get?.();
}
