import * as express from "express";
import { getSessionData } from "../../utilities/redirectToBos";
import { sendResponseToClientUrl } from "../../utilities/formatResponseHtml";
import { HttpStatusCode } from "../../utilities/http-status-code";

export function registerRedirectToBosRoute(app: express.Application) {
	app.get("/tokens/redirect/:sessionId", async (req: express.Request, res: express.Response) => {
		try {
			const sessionId = req.params.sessionId;
			const { platform, callbackUrl, tokenInfo, apiUrl } = (await getSessionData(sessionId)) || {};

			if (!tokenInfo || !tokenInfo.token) throw { status: HttpStatusCode.BAD_REQUEST, message: "tokenInfo not found" };

			// if (vueClientUrl) {
			// 	return sendResponseToClientUrl(res, vueClientUrl, tokenInfo.token, apiUrl!, tokenInfo.expieredToken);
			// }

			if (!callbackUrl) throw { status: HttpStatusCode.BAD_REQUEST, message: "callbackUrl not found" };
			if (!platform || !apiUrl) throw { status: HttpStatusCode.BAD_REQUEST, message: "platform not found" };

			res.status(HttpStatusCode.OK);
			return sendResponseToClientUrl(res, platform, apiUrl, tokenInfo);
		} catch (error: any) {
			const code = (error as any).status || HttpStatusCode.INTERNAL_SERVER_ERROR;
			res.status(code).send({ error: (error as any).message });
		}
	});
}
