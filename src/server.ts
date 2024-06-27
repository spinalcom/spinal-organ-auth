/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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
import * as fileUpload from "express-fileupload";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as morgan from "morgan";
import * as _ from "lodash";
import config from "./config";
import path = require("path");
import * as methodOverride from "method-override";
import { RegisterRoutes } from "./routes";
import { Response as ExResponse, Request as ExRequest } from "express";
import * as swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { AuthError } from "./security/AuthError";
// import * as OAuthServer from "@node-oauth/express-oauth-server";
import { spinalOAuth2Server } from "./oauth";
import { AuthServerModel } from "./oauth/AuthServerModel";
// import { AuthenticateHandler } from "./oauth/AuthenticateHandler";

const jsonFile = require("../build/swagger.json");
var history = require("connect-history-api-fallback");
/**
 *
 *
 * @return {*}  {express.Express}
 */
function Server(): express.Express {
	const app: any = express();

	// app.oauth = new OAuthServer({
	// 	model: AuthServerModel.instance,
	// 	useErrorHandler: false,
	// });

	// enable files upload
	app.use(fileUpload({ createParentPath: true }));
	app.use(morgan("tiny"));
	app.use(cors());
	app.disable("x-powered-by");
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	// app.use(methodOverride());

	// app.use(history());

	app.use(express.static(path.resolve(__dirname, "../vue-client/dist")));

	// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(jsonFile));

	app.get("/", (req, res) => res.sendFile(path.resolve(__dirname, "../vue-client/dist", "index.html")));
	app.get("/authorize", (req, res) => res.sendFile(path.resolve(__dirname, "../vue-client/dist", "index.html")));

	// app.post("/oauth/token", app.oauth.token());
	// app.post(
	// 	"/oauth/authorize",
	// 	app.oauth.authorize({
	// 		authenticateHandler: new AuthenticateHandler({ model: AuthServerModel.instance }),
	// 	})
	// );

	app.post("/oauth/token", spinalOAuth2Server.getToken.bind(spinalOAuth2Server));
	app.post("/oauth/authorize", spinalOAuth2Server.askUserAuthorization.bind(spinalOAuth2Server));

	RegisterRoutes(app);

	app.use(errorHandler);

	app.listen(config.api.port, () => console.log(`app listening at http://localhost:${config.api.port} ....`));

	return app;
}

export default Server;

function errorHandler(err: unknown, req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void {
	//@ts-ignore
	if (err instanceof ValidateError) {
		return res.status(400).send(_formatValidationError(err));
	}

	if (err instanceof AuthError) {
		return res.status(err.code).send({ message: err.message });
	}

	if (err instanceof Error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}

	next();
}

function _formatValidationError(err: ValidateError) {
	err;
	return {
		message: "Validation Failed",
		details: err?.fields,
	};
}
