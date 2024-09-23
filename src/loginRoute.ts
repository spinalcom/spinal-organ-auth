import * as express from "express";
import { HttpStatusCode } from "./utilities/http-status-code";
import { PlatformService } from "./routes/platform/platformServices";
import { CONNECTION_METHODS } from "./constant";
import { IPlatform } from "./routes/platform/platform.model";
import loginService from "./routes/loginServer/loginServerService";
import * as path from "path";
import { UserService } from "./routes/authUser/userService";
import { formatResponseHtml } from "./utilities/formatResponseHtml";

export async function redirectToLoginPage(req: express.Request, res: express.Response) {
    try {
        const platformInstance = PlatformService.getInstance();
        const client_id = req.params?.plateformClientId;
        if (!client_id) throw { status: HttpStatusCode.BAD_REQUEST, message: "invalid clientId" };

        const platform = await platformInstance.getPlateformByClientId(client_id);
        if (!platform) throw { status: HttpStatusCode.BAD_REQUEST, message: "invalid clientId" };

        const servers = await platformInstance.getLoginServerFromPlatform(platform);

        const serversFormatted = servers.map(el => ({
            id: el.getId().get(),
            name: el.getName().get(),
            type: el.getType().get(),
            authentication_method: el.info.authentication_method.get()
        }));

        const myRelativePath = path.resolve(__dirname, "../authorizationPage", "index.ejs");

        res.render(myRelativePath, { servers: JSON.stringify(serversFormatted) });

    } catch (error) {
        const status = error.status || HttpStatusCode.INTERNAL_SERVER_ERROR
        res.status(status).send({
            status,
            message: error.message
        })
    }

}


export async function LogWithServer(req: express.Request, res: express.Response) {
    const { platformId, serverId } = req.params;
    let [server] = await loginService.getLoginServer(serverId);

    try {
        if (!server) throw { status: HttpStatusCode.BAD_REQUEST, message: "invalid server id" };
        server = loginService.formatServerNode(server);

        const auth_mode = server.authentication_method;

        switch (auth_mode) {
            case CONNECTION_METHODS.local:
                loginWithLocal(req, res);
                break;
            case CONNECTION_METHODS.oauth2:
                break;

            case CONNECTION_METHODS.saml:
                const query = `platformId=${encodeURIComponent(platformId)}&serverId=${encodeURIComponent(serverId)}`;
                return res.redirect(`/saml/login?${query}`);
        }
    } catch (error) {
        const status = error.status || HttpStatusCode.INTERNAL_SERVER_ERROR
        res.status(status).send({
            status,
            message: error.message
        })
    }
}

async function loginWithLocal(req: express.Request, res: express.Response) {
    const { platformId, serverId } = req.params;
    try {
        const platformNode = await PlatformService.getInstance().getPlateformByClientId(platformId);
        const platform = PlatformService.getInstance()._formatPlatform(platformNode);

        const body = req.body;

        const userToken = await UserService.getInstance().login(body, platform.id);
        const html = formatResponseHtml(platform.redirectUrl, userToken);

        res.send(html);

    } catch (error) {
        console.error(error);
        res.redirect(`/login/${platformId}?error=true`)
    }

}

