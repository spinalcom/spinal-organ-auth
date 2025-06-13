import { AuthenticateCallback, AuthenticateOptions, Authenticator } from "passport";
import * as OpenIDConnectStrategy from "passport-openidconnect";
import loginService from "../../routes/loginServer/loginServerService";
import { IOpenIdAuthenticationInfo } from "../../routes/platform/platform.model";
import * as Express from "express";
import jwtDecode from "jwt-decode";
import { PlatformService } from "../../routes/platform/platformServices";

export class SpinalOpenIDServer extends Authenticator {
    private static _instance: SpinalOpenIDServer;
    private issuerToStrategy: Map<string, OpenIDConnectStrategy> = new Map();
    private serverEntityIdToPlatformId = {};

    private constructor() {
        super();
        this.serializeUser((user, done) => done(null, user));
        this.deserializeUser((user, done) => done(null, user));
    }

    static getInstance(): SpinalOpenIDServer {
        if (!this._instance) this._instance = new SpinalOpenIDServer();
        return this._instance;
    }

    public async auth(req: Express.Request, options: AuthenticateOptions, callback?: AuthenticateCallback) {

        const { error } = req.query;
        if (error) return callback(new Error(error as string));

        let strategy: OpenIDConnectStrategy = await this._getStrategy(req.url, req.query);
        if (!strategy) return callback(new Error("No strategy found"));

        return this.authenticate(strategy.name, options, callback);
    }

    private async _getStrategy(url: string, query: { iss?: string; platformId?: string; serverId?: string }): OpenIDConnectStrategy {

        if (url.includes("/openid/callback")) {
            const { iss: issuer } = query;
            return this.issuerToStrategy.get(issuer as string);
        }

        const serverId = query.serverId as string;
        let serverInfo = await this._getServerInfo(serverId);
        const strategy = this._getnewStrategy(serverInfo);
        this.use(strategy);

        this.serverEntityIdToPlatformId[serverInfo.issuer] = query.platformId;
        this.issuerToStrategy.set(serverInfo.issuer, strategy);
        return strategy;
    }

    private _getnewStrategy(serverInfo: IOpenIdAuthenticationInfo) {
        const params = this._formatServerInfo(serverInfo);
        const strategy = new OpenIDConnectStrategy(params, async (iss, sub, profile, jwtClaims, accessToken, refreshToken, par, done) => {

            const platformId = this.serverEntityIdToPlatformId[iss];

            const platformNode = await PlatformService.getInstance().getPlateformByClientId(platformId);
            const platform = PlatformService.getInstance()._formatPlatform(platformNode);
            const info_decoded: any = jwtDecode(jwtClaims);

            const userinfo = {
                nameID: info_decoded.email || info_decoded.sub,
                issuer: iss,
                email: info_decoded.email,
                firstName: info_decoded.given_name,
                lastName: info_decoded.family_name,
                groups: info_decoded.droit_jul || info_decoded.groups,
                profileClassifyByPriority: params.profileClassifyByPriority,
            }

            done(null, platform, userinfo);
        });

        strategy.name = params.issuer;
        return strategy;
    }


    private async _getServerInfo(serverId: string): Promise<IOpenIdAuthenticationInfo> {
        const [serverNode] = await loginService.getLoginServer(serverId);

        const server = loginService.formatServerNode(serverNode);
        return server.authentication_info;
    }

    private _formatServerInfo(serverInfo: IOpenIdAuthenticationInfo) {
        return {
            issuer: serverInfo.issuer,
            authorizationURL: serverInfo.authorizationUrl,
            tokenURL: serverInfo.tokenUrl,
            userInfoURL: serverInfo.userInfoUrl,
            clientID: serverInfo.clientId,
            clientSecret: serverInfo.clientSecret,
            callbackURL: serverInfo.callbackUrl,
            scope: (serverInfo as any).scopes,
            profileClassifyByPriority: (serverInfo as any).profileClassifyByPriority
        }
    }



}

const spinalPassportOpenId = SpinalOpenIDServer.getInstance();

export default spinalPassportOpenId;
export { spinalPassportOpenId };