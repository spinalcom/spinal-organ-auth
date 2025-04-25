import * as express from 'express';
import { spinalPassportOpenId } from '.';
import { HttpStatusCode } from '../../utilities/http-status-code';
import { convertSSOData } from '../utils';
import { formatResponseHtml } from '../../utilities/formatResponseHtml';



export function RegisterOpenIdRoutes(app: express.Application) {

    app.get("/openid/login/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { platformId, serverId } = req.query;

            if (!platformId) throw new Error("no platform specified");
            if (!serverId) throw new Error("no authentication server specified");

            // spinalPassportOpenId.auth.bind(spinalPassportOpenId)(req, { failureRedirect: "/error", failureFlash: true })(req, res, next);
            const authenticate = await spinalPassportOpenId.auth.bind(spinalPassportOpenId)(req, { failureRedirect: "/error", failureFlash: true }, (err) => {
                if (err) throw err;
                next();
            });

            return authenticate(req, res, next);
        } catch (error) {
            return res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
        }
    });


    app.all("/openid/callback", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const authenticate = await spinalPassportOpenId.auth.bind(spinalPassportOpenId)(req, { failureRedirect: "/error", failureFlash: true }, async (err, platform, userinfo) => {
                try {
                    if (err) throw err;

                    const resData: any = await convertSSOData(userinfo, platform);
                    const html = formatResponseHtml(platform.redirectUrl, resData);
                    res.status(HttpStatusCode.OK).send(html);
                } catch (error) {
                    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ status: HttpStatusCode.INTERNAL_SERVER_ERROR, message: error.message });
                }

            })

            return authenticate(req, res, next);

        } catch (error) {
            return res.status(HttpStatusCode.BAD_REQUEST).send({ status: HttpStatusCode.BAD_REQUEST, message: error.message })
        }
    });

}