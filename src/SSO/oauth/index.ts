import * as OAuth2Server from "@node-oauth/oauth2-server";
import * as url from "url";

import { AuthServerModel } from "./AuthServerModel";
import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { AuthenticateHandler } from "./AuthenticateHandler";
import { getTokenFromRequest } from "./utils";
import loginService from "../../routes/loginServer/loginServerService";

export class SpinalOAuth2Server extends OAuth2Server {
	constructor(private options: OAuth2Server.ServerOptions) {
		super(options);
	}

	public async verifyToken(req: ExpressRequest, res: ExpressResponse, next?: NextFunction) {
		try {
			const request = new OAuth2Server.Request(req);
			const response = new OAuth2Server.Response(res);
			const token = await this.authenticate(request, response, this.options);
			if (next && typeof next === "function") return next();
			return token;
		} catch (err) {
			if (next && typeof next === "function") return next(err);
			throw err;
		}
	}

	public async askUserAuthorization(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {

		try {
			const request = new OAuth2Server.Request(req);
			const response = new OAuth2Server.Response(res);
			const result = await this.authorize(request, response, { authenticateHandler: new AuthenticateHandler(this.options) });


			const state = req.body.state || req.query.state;
			const urlFormatted = url.format({
				pathname: result.redirectUri,
				query: { code: result.authorizationCode, ...(state && { state }) }
			})

			return res.redirect(urlFormatted);

		} catch (error) {
			console.error("error.message", error.message);

			const query = Object.assign({ error: true }, { ...req.body });
			delete query.password;

			res.redirect(url.format({ pathname: "/authorize", query }));
			// return res.status(error.code || HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
		}


		// // const { userName, password } = req.body;
		// // const token = getTokenFromRequest(req);

		// // if (!token && (!userName || !password)) {
		// // 	return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "missing parameters username and/or password, and token" });
		// // }

		// const request = new OAuth2Server.Request(req);
		// const response = new OAuth2Server.Response(res);

		// // const options = (token && this.options) || { authenticateHandler: new AuthenticateHandler(this.options) };

		// return new OAuth2Server(this.options)
		// 	.authorize(request, response, { authenticateHandler: new AuthenticateHandler(this.options) })
		// 	.then((result) => {
		// 		const state = req.body.state || req.query.state;
		// 		return res.redirect(
		// 			url.format({
		// 				pathname: result.redirectUri,
		// 				query: {
		// 					code: result.authorizationCode,
		// 					...(state && { state }),
		// 				},
		// 			})
		// 		);
		// 	})
		// 	.catch((err) => {
		// 		res.status(HttpStatusCode.UNAUTHORIZED).json(err);
		// 		// const query = { ...req.query, ...req.body, error: "error" };
		// 		// delete query.userName;
		// 		// delete query.password;

		// 		// res.redirect(url.format({ pathname: "/authorize", query }));
		// 	});
	}

	public async getToken(req: ExpressRequest, res: ExpressResponse) {
		try {
			const request = new OAuth2Server.Request(req);
			const response = new OAuth2Server.Response(res);
			const token = await this.token(request, response, this.options);
			return res.status(HttpStatusCode.OK).json(token);
		} catch (err) {
			console.error(err);
			res.status(err.code || HttpStatusCode.INTERNAL_SERVER_ERROR).json(err);
		}
	}

}

export const spinalOAuth2Server = new SpinalOAuth2Server({
	model: AuthServerModel.instance,
	accessTokenLifetime: 60 * 60, // 1 hour in seconds,
	allowBearerTokensInQueryString: true,
});