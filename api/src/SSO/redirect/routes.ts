import * as express from "express";
import { getSessionData } from "../../utilities/redirectToBos";
import { formatResponseHtml } from "../../utilities/formatResponseHtml";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { sendResponseToClientUrl } from "../utils";

export function registerRedirectToBosRoute(app: express.Application) {
	app.get("/tokens/redirect/:sessionId", async (req: express.Request, res: express.Response) => {
		try {
			const sessionId = req.params.sessionId;
			const { callbackUrl, vueClientUrl, tokenInfo } = (await getSessionData(sessionId)) || {};

			if (!tokenInfo || !tokenInfo.token) throw { status: HttpStatusCode.BAD_REQUEST, message: "tokenInfo not found" };

			if (vueClientUrl) {
				return sendResponseToClientUrl(res, vueClientUrl, tokenInfo.token);
			}

			if (!callbackUrl) throw { status: HttpStatusCode.BAD_REQUEST, message: "callbackUrl not found" };

			const html = formatResponseHtml(callbackUrl, tokenInfo);

			res.status(HttpStatusCode.OK).send(html);
		} catch (error: any) {
			const code = (error as any).status || HttpStatusCode.INTERNAL_SERVER_ERROR;
			res.status(code).send({ error: (error as any).message });
		}
	});
}
