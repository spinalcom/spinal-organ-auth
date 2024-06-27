// import { AuthorizationCode, AuthorizationCodeModel, Client, ClientCredentialsModel, Falsey, PasswordModel, RefreshToken, RefreshTokenModel, Token, User } from "@node-oauth/oauth2-server";
import { AuthorizationCode, AuthorizationCodeModel, Client, ClientCredentialsModel, Falsey, PasswordModel, RefreshToken, RefreshTokenModel, Token, User } from "@node-oauth/oauth2-server";
import { ApplicationService } from "../authApplication/applicationService";
import { TokensService } from "../tokens/tokenService";
import { UserService } from "../authUser/userService";
import { AuthorizationCodeService } from "../tokens/AuthorizationCodeService";
import { RefreshTokenService } from "../tokens/refreshTokenService";
import { getScope } from "./utils";

export class AuthServerModel implements AuthorizationCodeModel, ClientCredentialsModel, PasswordModel, RefreshTokenModel {
	private static _instance: AuthServerModel;
	private constructor() {}

	static get instance(): AuthServerModel {
		if (!this._instance) {
			this._instance = new AuthServerModel();
		}
		return this._instance;
	}

	async getClient(clientId: string, clientSecret: string): Promise<Client | Falsey> {
		const applications = await ApplicationService.getInstance().getApplicationNodes();
		const app = applications.find((app) => clientId === app.info.clientId?.get() && (clientSecret === app.info.clientSecret?.get() || !clientSecret));
		if (!app) return null;

		return {
			id: app.getId().get(),
			client_id: app.info.clientId?.get(),
			grants: app.info.grants?.get() || [],
			redirectUris: app.info.redirectUri?.get(),
		};
	}

	saveToken(token: Token, client: Client, user: User): Promise<Token | Falsey> {
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

	async getAccessToken(accessToken: string): Promise<Token | Falsey> {
		const tokens = await TokensService.getInstance().getAllTokensNode();
		const tokenNode = tokens.find((token) => token.info?.token?.get() === accessToken);
		if (!tokenNode) return null;

		const expireDate = tokenNode.info.expieredToken.get();
		return {
			accessToken: tokenNode.info.token.get(),
			accessTokenExpiresAt: (expireDate && new Date(expireDate * 1000)) || null,
			client: tokenNode.info?.client?.get() || {},
			user: tokenNode.info?.user?.get() || {},
			...(tokenNode.info.scope && { scope: tokenNode.info.scope.get() }),
		};
	}

	async getUser(username: string, password: string, client: Client): Promise<User | Falsey> {
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
		const applications = await ApplicationService.getInstance().getApplicationNodes();
		const app = applications.find((app) => app.info.clientId.get() === client.client_id);
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

	revokeAuthorizationCode(code: AuthorizationCode): Promise<boolean> {
		return AuthorizationCodeService.getInstance().removeAuthorizationCode(code);
	}

	async validateRedirectUri(redirect_uri: string, client: Client): Promise<boolean> {
		try {
			const applications = await ApplicationService.getInstance().getApplicationNodes();
			const app = applications.find((app) => app.info.clientId?.get() === client.client_id);
			if (!app) return false;

			return app.info.redirectUri?.get() === redirect_uri;
		} catch (error) {
			return false;
		}
	}

	async verifyScope(token: Token, scope: string[]): Promise<boolean> {
		// const t_scope = (token.scope || []).join(" ");
		// const u_scope = scope.join(" ");
		// return t_scope === u_scope;

		const t_scope = token.scope || [];
		for (let s of t_scope) {
			if (scope.includes(s)) return true;
		}

		return false;
	}

	async validateScope(user: User, client: Client, scope?: string[]): Promise<string[] | Falsey> {
		const client_type = user.id === client.id ? "client" : "user";
		const access_scopes = await getScope(client_type, user, client);

		if (!scope) return access_scopes;
		for (const s of scope) {
			if (!access_scopes.includes(s)) return null;
		}

		return scope;
	}

	async getRefreshToken(refreshToken: string): Promise<RefreshToken | Falsey> {
		const token = await RefreshTokenService.getInstance().getRefreshToken(refreshToken);
		if (!token) return null;

		return Object.assign(token.info.get(), { refreshTokenExpiresAt: new Date(token.info.refreshTokenExpiresAt.get()) });
	}

	revokeToken(token: RefreshToken): Promise<boolean> {
		return RefreshTokenService.getInstance().removeRefreshToken(token);
	}
}
