import { AuthenticateCallback, AuthenticateOptions, Authenticator } from "passport";
import * as OpenIDConnectStrategy from "passport-openidconnect";
import loginService from "../../routes/loginServer/loginServerService";
import { IOpenIdAuthenticationInfo } from "../../routes/platform/platform.model";
import * as Express from "express";

export class SpinalOpenIDServer extends Authenticator {
    private static _instance: SpinalOpenIDServer;
    private issuerToStrategy: Map<string, OpenIDConnectStrategy> = new Map();

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

        let strategy: OpenIDConnectStrategy = await this._getStrategy(req.url, req.query);

        if (!strategy) return callback(new Error("No strategy found"));

        return this.authenticate(strategy.name, options, callback);
    }

    private async _getStrategy(url: string, query: { iss?: string; serverId?: string }): OpenIDConnectStrategy {

        if (url.includes("/openid/callback")) {
            const { iss: issuer } = query;
            return this.issuerToStrategy.get(issuer as string);
        }

        const serverId = query.serverId as string;
        let serverInfo = await this._getServerInfo(serverId);
        const strategy = this._getnewStrategy(serverInfo);
        this.use(strategy);

        this.issuerToStrategy.set(serverInfo.issuer, strategy);
        return strategy;
    }

    private _getnewStrategy(serverInfo: IOpenIdAuthenticationInfo) {
        const params = this._formatServerInfo(serverInfo);
        const strategy = new OpenIDConnectStrategy(params, (iss, sub, profile, jwtClaims, accessToken, refreshToken, params, done) => {
            console.log("iss", iss)
            console.log(" sub", sub)
            console.log(" profile", profile)
            console.log(" jwtClaims", jwtClaims)
            console.log(" accessToken", accessToken)
            console.log(" refreshToken", refreshToken)
            console.log(" params", params)
            done(null, profile);
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
        }
    }

}


export default SpinalOpenIDServer.getInstance();