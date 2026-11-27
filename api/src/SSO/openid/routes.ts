import * as express from "express";
import { spinalPassportOpenId } from ".";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { convertSSOData } from "../utils";
import { sendResponseToClientUrl } from "../../utilities/formatResponseHtml";

export function RegisterOpenIdRoutes(app: express.Application) {
	app.get("/openid/login/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		const { platformId, serverId } = req.query;

		try {
			if (!platformId) throw new Error("no platform specified");
			if (!serverId) throw new Error("no authentication server specified");

			const authenticate = await spinalPassportOpenId.auth.bind(spinalPassportOpenId)(req, (err) => {
				if (err) throw err;
				next();
			});

			return authenticate(req, res, next);
		} catch (error: any) {
			return res.status(HttpStatusCode.MOVED_PERMANENTLY).redirect(`/login/${platformId as string}?error=true&error_description=${error.message}`);
		}
	});

	app.all("/openid/callback", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			const authenticate = await spinalPassportOpenId.auth.bind(spinalPassportOpenId)(req, async (err, platform, userinfo) => {
				try {
					if (err) throw err;

					const resData: any = await convertSSOData(userinfo as any, platform as any);

					res.status(HttpStatusCode.OK);
					return sendResponseToClientUrl(res, platform as any, (platform as any).url, resData);
				} catch (error: any) {
					return res.status(HttpStatusCode.MOVED_PERMANENTLY).redirect(`/login/${(platform as any).id as string}?error=true&error_description=${error.message}`);
				}
			});

			return authenticate(req, res, next);
		} catch (error: any) {
			return res.status(HttpStatusCode.BAD_REQUEST).send({ status: HttpStatusCode.BAD_REQUEST, message: error.message });
		}
	});
}
