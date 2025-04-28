import * as express from "express";
import spinalPassportSaml from ".";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { IPlatform, ISAMLAuthenticationInfo } from "../../routes/platform/platform.model";
import { formatResponseHtml } from "../../utilities/formatResponseHtml";
import { convertSSOData } from "../utils";


export function RegisterSamlRoutes(app: express.Application) {
	app.get("/saml/login/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
		const { platformId, serverId } = req.query;

		try {
			if (!platformId) return res.status(HttpStatusCode.BAD_REQUEST).send({ message: "no platform specified" });
			if (!serverId) return res.status(HttpStatusCode.BAD_REQUEST).send({ message: "no authentication server specified" });

			spinalPassportSaml.auth.bind(spinalPassportSaml)("saml", { failureRedirect: "/error", failureFlash: true })(req, res, next);
		} catch (error) {
			return res.status(HttpStatusCode.MOVED_PERMANENTLY).redirect(`/login/${platformId}?error=true&error_description=${error.message}`);
			// return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
		}
	})

	app.post("/callback", (req, res, next) => {
		spinalPassportSaml.auth.bind(spinalPassportSaml)("saml", { failureRedirect: "/error", failureFlash: true }, async (err, data, info) => {
			if (err) {
				return res.status(HttpStatusCode.BAD_REQUEST).send({ status: HttpStatusCode.BAD_REQUEST, message: err.message })
			}


			try {
				const resData: any = await convertSSOData(data.user, data.platform);
				const html = formatResponseHtml(data.platform.redirectUrl, resData);
				res.status(HttpStatusCode.OK).send(html);
			} catch (error) {
				// res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ status: HttpStatusCode.INTERNAL_SERVER_ERROR, message: error.message })
				return res.status(HttpStatusCode.MOVED_PERMANENTLY).redirect(`/login/${data.platform.id}?error=true&error_description=${error.message}`);

			}

		})(req, res, next);

	});
}