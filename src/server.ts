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
import * as _ from "lodash";
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
import { Z_FIXED } from "zlib";


// const jsonFile = require("../build/swagger.json");
// var history = require("connect-history-api-fallback");


function Server(): express.Express {
	const app: any = express();

	app.set('view engine', 'ejs');

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


	app.use("/auth_static", express.static(path.resolve(__dirname, "../authorizationPage")));
	app.use(express.static(path.resolve(__dirname, "../vue-client/dist")));


	// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(jsonFile));

	// app.get("/", (req, res) => res.sendFile(path.resolve(__dirname, "../vue-client/dist", "index.html")));


	// Register routes here !!!!
	registerOAuthRoutes(app);
	RegisterSamlRoutes(app);
	RegisterOpenIdRoutes(app);
	RegisterRoutes(app);

	app.get("/login/:plateformClientId", redirectToLoginPage);
	app.post("/login/:platformId/:serverId", LogWithServer);

	app.get("/authorize", (req, res) => {
		const myRelativePath = path.resolve(__dirname, "../authorizationPage", "index.ejs");
		console.log(myRelativePath)
		res.render(myRelativePath, { name: "Moussa" })
	});

	app.get("/*", (req, res) => res.sendFile(path.resolve(__dirname, "../vue-client/dist", "index.html")));

	app.use(errorHandler);

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
