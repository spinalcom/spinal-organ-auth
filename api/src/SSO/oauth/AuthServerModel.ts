import { AuthorizationCode, AuthorizationCodeModel, Client, ClientCredentialsModel, Falsey, PasswordModel, RefreshToken, RefreshTokenModel, Token, User } from "@node-oauth/oauth2-server";
import { ApplicationService } from "../../routes/authApplication/applicationService";
import { TokensService } from "../../routes/tokens/tokenService";
import { UserService } from "../../routes/authUser/userService";
import { AuthorizationCodeService } from "../../routes/tokens/AuthorizationCodeService";
import { RefreshTokenService } from "../../routes/tokens/refreshTokenService";
import { getScope } from "./utils";
import { PlatformService } from "../../routes/platform/platformServices";
import { SpinalNode } from "spinal-model-graph";

export class AuthServerModel implements AuthorizationCodeModel, ClientCredentialsModel, PasswordModel, RefreshTokenModel {
	private static _instance: AuthServerModel;
	private constructor() {}

	static get instance(): AuthServerModel {
		if (!this._instance) {
			this._instance = new AuthServerModel();
		}
		return this._instance;
	}

	public async getClient(clientId: string, clientSecret: string): Promise<Client | Falsey> {
		const applications = await this._getAllApplications();

		const appFound = applications.find((app) => clientId === app.info.clientId?.get() && (clientSecret === app.info.clientSecret?.get() || !clientSecret));
		if (!appFound) return null;

		return {
			id: appFound.getId().get(),
			client_id: appFound.info.clientId?.get(),
			grants: appFound.info.grant_types?.get() || [],
			redirectUris: appFound.info.redirectUri?.get() || appFound.info.redirectUrl?.get(),
		};
	}

	public saveToken(token: Token, client: Client, user: User): Promise<Token | Falsey> {
		return TokensService.getInstance()
			.saveOAuthToken(token, client, user)
			.then(() => {
				return {
					...token,
					client,
					user,
				};
			})
			.catch((err) => {
				console.error(err);
				return null;
			});
	}

	public async getAccessToken(accessToken: string): Promise<Token | Falsey> {
		const tokens = await TokensService.getInstance().getAllTokensNode();
		const tokenNode = tokens.find((token) => token.info?.token?.get() === accessToken);

		if (!tokenNode) return null;

		const expireDate = tokenNode.info.expieredToken.get();
		return {
			authType: tokenNode.info?.authType?.get(),
			accessToken: tokenNode.info.token.get(),
			accessTokenExpiresAt: (expireDate && new Date(expireDate * 1000)) || null,
			client: tokenNode.info?.client?.get() || {},
			user: tokenNode.info?.user?.get() || {},
			...(tokenNode.info.scope && { scope: tokenNode.info.scope.get() }),
		};
	}

	public async getUser(username: string, password: string, client: Client): Promise<User | Falsey> {
		const user = await UserService.getInstance().getUserByCredentials(username, password);
		if (!user) return null;

		const obj = {
			id: user.getId().get(),
			name: user.getName().get(),
			type: user.info?.userType?.get(),
			userName: user.info.userName.get(),
			email: user.info?.email?.get(),
			telephone: user.info?.telephone?.get(),
		};

		return obj;
	}

	async getUserFromClient(client: Client): Promise<User | Falsey> {
		const applications = await this._getAllApplications();
		const app = applications.find((app) => app.info.clientId?.get() === client.client_id);
		if (!app) return null;

		return {
			id: app.getId().get(),
			name: app.getName().get(),
			type: app.getType().get(),
			appType: app.info.appType?.get(),
			client_id: app.info.clientId?.get(),
			...(app.info.scope && { scope: app.info.scope?.get() }),
		};
	}

	async getAuthorizationCode(authorizationCode: string): Promise<AuthorizationCode | Falsey> {
		const node = await AuthorizationCodeService.getInstance().getAuthorizationCode(authorizationCode);
		if (!node) return null;
		return Object.assign(node.info.get(), { expiresAt: new Date(node.info.expiresAt.get()) });
	}

	async saveAuthorizationCode(code: AuthorizationCode, client: Client, user: User): Promise<AuthorizationCode | Falsey> {
		await AuthorizationCodeService.getInstance().saveReAuthorizationCode(code, client, user);
		return {
			...code,
			client,
			user,
		};
	}

	public revokeAuthorizationCode(code: AuthorizationCode): Promise<boolean> {
		return AuthorizationCodeService.getInstance().removeAuthorizationCode(code);
	}

	public async validateRedirectUri(redirect_uri: string, client: Client): Promise<boolean> {
		try {
			const uris = Array.isArray(client.redirectUris) ? client.redirectUris : [client.redirectUris];
			return !!uris.includes(redirect_uri);
		} catch (error) {
			return false;
		}
	}

	public async verifyScope(token: Token, scope: string[]): Promise<boolean> {
		const tokenScope: unknown = (token as any).scope;
		const grantedScopes = Array.isArray(tokenScope) ? tokenScope : typeof tokenScope === "string" ? tokenScope.split(" ") : [];
		for (const grantedScope of grantedScopes) {
			if (scope.includes(grantedScope)) return true;
		}

		return false;
	}

	public async validateScope(user: User, client: Client, scope?: string[]): Promise<string[] | Falsey> {
		const clientType = user.id === client.id ? "client" : "user";
		const accessScopes = await getScope(clientType, user, client);

		if (!scope) return accessScopes;
		for (const s of scope) {
			if (!accessScopes.includes(s)) return null;
		}

		return scope;
	}

	public async getRefreshToken(refreshToken: string): Promise<RefreshToken | Falsey> {
		const token = await RefreshTokenService.getInstance().getRefreshToken(refreshToken);
		if (!token) return null;

		return Object.assign(token.info.get(), { refreshTokenExpiresAt: new Date(token.info.refreshTokenExpiresAt.get()) });
	}

	public revokeToken(token: RefreshToken): Promise<boolean> {
		return RefreshTokenService.getInstance().removeRefreshToken(token);
	}

	private _getAllApplications(): Promise<SpinalNode[]> {
		const promises = [ApplicationService.getInstance().getApplicationNodes(), PlatformService.getInstance().getPlatformsNodes()];
		return Promise.allSettled(promises).then((values) => {
			return values.reduce((acc, val) => {
				if (val.status === "fulfilled") {
					acc.push(...val.value);
				}
				return acc;
			}, [] as SpinalNode[]);
		});
	}
}
