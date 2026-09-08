import * as express from "express";
import * as path from "path";
import * as swaggerUi from "swagger-ui-express";

const swaggerOption = {
	swaggerOptions: {
		swaggerDefinition: {
			info: {
				"x-logo": {
					url: "/admin/logo",
				},
				"x-favicon": {
					url: "/admin/favicon",
				},
			},
		},
	},
	customCss: ".topbar-wrapper img {content: url(/admin/logo);} .swagger-ui .topbar {background: #dbdbdb;}",
};

const swaggerFile = path.resolve(__dirname, "./swagger/swagger.json");

export function initSwagger(app: express.Express) {
	app.use("/admin/swagger.json", (req, res) => {
		res.sendFile(swaggerFile);
	});

	app.get("/admin/logo", (req, res) => {
		res.sendFile("spinalcore.png", {
			root: path.resolve(__dirname, "../assets"),
		});
	});

	// app.use("/admin_docs", swaggerUi.serve, async (req, res) => {
	// return res.send(swaggerUi.generateHTML(await import("../swagger/swagger.json"), swaggerOption))
	// });

	app.use("/docs", swaggerUi.serve, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		return swaggerUi.setup(await import("./swagger/swagger.json"), swaggerOption)(req, res, next);
	});
}
