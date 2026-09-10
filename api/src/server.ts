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
import * as cors from "cors";
import * as morgan from "morgan";
import * as passport from "passport";
import * as session from "express-session";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";

import config from "./config";
import { RegisterRoutes } from "./routes";
import { ValidateError } from "tsoa";
import { AuthError } from "./security/AuthError";
import { LogWithServer, redirectToLoginPage } from "./loginRoute";
import { RegisterSamlRoutes } from "./SSO/saml/routes";
import { registerOAuthRoutes } from "./SSO/oauth/routes";
import { RegisterOpenIdRoutes } from "./SSO/openid/routes";
import { registerRedirectToBosRoute } from "./SSO/redirect/routes";
import { initSwagger } from "./initSwagger";
import { buildApiErrorResponse, getErrorStatus } from "./utilities/apiErrorResponse";
import { OperationError } from "./utilities/operation-error";

// const jsonFile = require("../build/swagger.json");
// var history = require("connect-history-api-fallback");

function Server(): express.Express {
	const vueClientPath = path.resolve(__dirname, "../../vue-client/dist");
	const authorizationPagePath = path.resolve(__dirname, "../authorizationPage");

	const app: any = express();

	app.set("view engine", "ejs");

	// enable files upload
	app.use(fileUpload({ createParentPath: true }));
	app.use(morgan("tiny"));
	app.use(cors());
	app.disable("x-powered-by");
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(session({ secret: "sessionSecret", resave: true, saveUninitialized: true, cookie: { secure: false, maxAge: 60000 } }));
	app.use(passport.initialize());
	app.use(passport.session());

	app.use("/auth_static", express.static(authorizationPagePath));
	app.use(express.static(vueClientPath));

	// Register routes here !!!!
	registerOAuthRoutes(app);
	RegisterSamlRoutes(app);
	RegisterOpenIdRoutes(app);
	registerRedirectToBosRoute(app);
	RegisterRoutes(app);

	app.get("/login/:plateformClientId", redirectToLoginPage);
	app.post("/login/:platformId/:serverId", LogWithServer);

	// Page to authorize the client
	app.get("/authorize", (req, res) => {
		try {
			const myRelativePath = path.resolve(authorizationPagePath, "index.ejs");
			res.render(myRelativePath, { name: "Moussa" });
		} catch (error) {
			console.error(error);
			res.status(500).send("Internal Server Error");
		}
	});

	// Initialize Swagger documentation
	initSwagger(app);

	// client Page
	app.get("/*", (req, res) => res.sendFile(path.resolve(vueClientPath, "index.html")));

	app.use(errorHandler);

	// launch the server
	if (process.env.SERVER_PROTOCOL === "https") {
		const sslOptions = { key: fs.readFileSync(process.env.SSL_KEY_PATH), cert: fs.readFileSync(process.env.SSL_CERT_PATH) };
		https.createServer(sslOptions, app).listen(config.api.port, () => console.log(`app listening at https://localhost:${config.api.port} ....`));
	} else {
		app.listen(config.api.port, () => console.log(`app listening at http://localhost:${config.api.port} ....`));
	}

	return app;
}

export default Server;

function errorHandler(err: unknown, req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void {
	if (err instanceof ValidateError || err instanceof AuthError || err instanceof OperationError || err instanceof Error) {
		const status = getErrorStatus(err);
		return res.status(status).json(buildApiErrorResponse(err, status));
	}

	next();
}
