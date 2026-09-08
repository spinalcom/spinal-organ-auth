import * as express from 'express';
import { getSessionData } from '../../utilities/redirectToBos';
import { formatResponseHtml } from '../../utilities/formatResponseHtml';
import { HttpStatusCode } from '../../utilities/http-status-code';


export function registerRedirectToBosRoute(app: express.Application) {

    app.get("/tokens/redirect/:sessionId", async (req: express.Request, res: express.Response) => {
        try {
            const sessionId = req.params.sessionId;
            const { callbackUrl, tokenInfo } = await getSessionData(sessionId);
            const html = formatResponseHtml(callbackUrl, tokenInfo);

            res.status(HttpStatusCode.OK).send(html);
        } catch (error) {
            const code = error.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
            res.status(code).send({ error: error.message });
        }
    })

}