import * as OAuth2Server from "@node-oauth/oauth2-server";
import { AuthServerModel } from "./AuthServerModel";
import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { HttpStatusCode } from "../../utilities/http-status-code";
import * as url from "url";
import { AuthenticateHandler } from "./AuthenticateHandler";
import { getTokenFromRequest } from "./utils";
import path = require("path");
import * as NodeOAuthServer from "@node-oauth/oauth2-server";
import { PlatformService } from "../../routes/platform/platformServices";
import loginService from "../../routes/loginServer/loginServerService";
import axios from "axios";

export class SpinalOAuth2Server extends OAuth2Server {
	constructor(private options: OAuth2Server.ServerOptions) {
		super(options);
	}

	verifyToken(req: ExpressRequest, res: ExpressResponse, next?: NextFunction) {
		const request = new OAuth2Server.Request(req);
		const response = new OAuth2Server.Response(res);

		return this.authenticate(request, response, this.options)
			.then((token) => {
				if (next && typeof next === "function") return next();
				return token;
			})
			.catch((err) => {
				if (next && typeof next === "function") return next(err);
				throw err;
				// res.status(err.code || HttpStatusCode.INTERNAL_SERVER_ERROR).json(err);
			});
	}

	// async askUserAuthorization(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
	// 	const { client_id, redirect_uri, response_type, scope, state } = req.query;

	// 	if (!client_id) return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "missing parameters client_id" });
	// 	if (!redirect_uri) return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "missing parameters redirect_uri" });
	// 	if (!response_type) return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "missing parameters response_type" });

	// 	const client = await AuthServerModel.instance.getClient(client_id as string, null);
	// 	if (!client) return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Invalid client" });

	// 	res.sendFile(path.resolve(__dirname, "../../authorizationPage", "index.html"));
	// }

	askUserAuthorization(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
		const { userName, password } = req.body;
		const token = getTokenFromRequest(req);

		if (!token && (!userName || !password)) {
			return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "missing parameters username and/or password, and token" });
		}

		const request = new OAuth2Server.Request(req);
		const response = new OAuth2Server.Response(res);

		const options = (token && this.options) || { authenticateHandler: new AuthenticateHandler(this.options) };

		return new NodeOAuthServer(this.options)
			.authorize(request, response, { authenticateHandler: new AuthenticateHandler(this.options) })
			.then((result) => {
				const state = req.body.state || req.query.state;
				return res.redirect(
					url.format({
						pathname: result.redirectUri,
						query: {
							code: result.authorizationCode,
							...(state && { state }),
						},
					})
				);
			})
			.catch((err) => {
				// res.status(HttpStatusCode.UNAUTHORIZED).json(err);
				const query = { ...req.query, ...req.body, error: "error" };
				delete query.userName;
				delete query.password;

				res.redirect(url.format({ pathname: "/authorize", query }));
			});
	}

	getToken(req: ExpressRequest, res: ExpressResponse) {
		const request = new OAuth2Server.Request(req);
		const response = new OAuth2Server.Response(res);

		return this.token(request, response, this.options)
			.then((token) => {
				res.status(HttpStatusCode.OK).send(token);
			})
			.catch((err) => {
				console.error(err);

				res.status(err.code || HttpStatusCode.INTERNAL_SERVER_ERROR).json(err);
			});
	}

	async loginWithExternalServer(req: ExpressRequest, res: ExpressResponse) {
		const { platformId, serverId } = req.query as any;
		// const platformNode = await PlatformService.getInstance().getPlateformByClientId(platformId);
		// const platform = PlatformService.getInstance()._formatPlatform(platformNode);
		const [serverNode] = await loginService.getLoginServer(serverId);
		const server = loginService.formatServerNode(serverNode);

		let { clientId, callbackUrl, endpoint, scopes } = server.authentication_info;

		endpoint = endpoint.endsWith("/") ? endpoint.substring(0, endpoint.length - 1) : endpoint;
		callbackUrl = callbackUrl.endsWith("/") ? callbackUrl.substring(0, callbackUrl.length - 1) : callbackUrl;
		scopes = scopes.split(",").map(el => el.trim("")).join("%20");

		const code_challenge = "8jIqKP0G-eVXqVO0N3U00pf-tsUDXJSpsbB_FW9l8w0";
		const code_challenge_method = "S256";
		const state = "1234";

		const url = `${endpoint}?client_id=${clientId}&redirect_uri=${callbackUrl}&state=${state}&response_type=code&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}&scope=${scopes}`;

		return res.redirect(url);

		// res.redirect(`${platform.server_uri}/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&response_type=code&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}`);


	}

	getTokenWithCode(req: ExpressRequest, res: ExpressResponse) { }

}



export const spinalOAuth2Server = new SpinalOAuth2Server({
	model: AuthServerModel.instance,
	accessTokenLifetime: 60 * 60, // 1 hour en secondes,
	allowBearerTokensInQueryString: true,
});

// export const router = express.Router();

// router.use("/authorize", spinalOAuth2Server.askClientAuthorization.bind(spinalOAuth2Server));
// router.post("/token", spinalOAuth2Server.getToken.bind(spinalOAuth2Server));

// export default router;
