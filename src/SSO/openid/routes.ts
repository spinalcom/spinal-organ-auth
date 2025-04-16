import * as express from 'express';
import spinalPassportOpenId from '.';
import { HttpStatusCode } from '../../utilities/http-status-code';



export function RegisterOpenIdRoutes(app: express.Application) {

    app.get("/openid/login/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { platformId, serverId } = req.query;

            if (!platformId) return res.status(HttpStatusCode.BAD_REQUEST).send({ message: "no platform specified" });
            if (!serverId) return res.status(HttpStatusCode.BAD_REQUEST).send({ message: "no authentication server specified" });

            // spinalPassportOpenId.auth.bind(spinalPassportOpenId)(req, { failureRedirect: "/error", failureFlash: true })(req, res, next);
            const authenticate = await spinalPassportOpenId.auth.bind(spinalPassportOpenId)(req, { failureRedirect: "/error", failureFlash: true });
            return authenticate(req, res, next);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    });

    app.all("/openid/callback", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const authenticate = await spinalPassportOpenId.auth.bind(spinalPassportOpenId)(req, { failureRedirect: "/error", failureFlash: true });
            return authenticate(req, res, next);
        } catch (error) {
            console.error(error);

        }
        // spinalPassportOpenId.auth.bind(spinalPassportOpenId)(req, { failureRedirect: "/error", failureFlash: true }, async (err, data, info) => {
        //     if (err) {
        //         return res.status(HttpStatusCode.BAD_REQUEST).send({ status: HttpStatusCode.BAD_REQUEST, message: err.message })
        //     }
        // })(req, res, next);
    });

}