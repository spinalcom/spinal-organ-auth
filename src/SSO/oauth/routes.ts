import * as express from "express";
import { spinalOAuth2Server } from ".";

export function registerOAuthRoutes(app: express.Application) {
    app.post("/oauth/token", spinalOAuth2Server.getToken.bind(spinalOAuth2Server));
    app.post("/oauth/authorize", spinalOAuth2Server.askUserAuthorization.bind(spinalOAuth2Server));
    app.get("/oauth/login", spinalOAuth2Server.loginWithExternalServer.bind(spinalOAuth2Server));
    app.get("/oauth/callback", spinalOAuth2Server.getTokenWithCode.bind(spinalOAuth2Server));
}