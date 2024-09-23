import { SPINAL_RELATION_PTR_LST_TYPE, SpinalContext, SpinalNode } from "spinal-model-graph";
import SpinalMiddleware from "../../spinalMiddleware";
import { AUTHORIZATION_CODE_CONTEXT_NAME, AUTHORIZATION_CODE_CONTEXT_TO_NODE_RELATION_NAME, AUTHORIZATION_CODE_CONTEXT_TYPE, AUTHORIZATION_CODE_TYPE } from "../../constant";
import { AuthorizationCode, AuthorizationCodeModel, Client, ClientCredentialsModel, Falsey, PasswordModel, RefreshToken, RefreshTokenModel, Token, User } from "@node-oauth/oauth2-server";

export class AuthorizationCodeService {
	private static _instance: AuthorizationCodeService;
	public context: SpinalContext;

	private constructor() { }

	static getInstance(): AuthorizationCodeService {
		if (!this._instance) {
			this._instance = new AuthorizationCodeService();
		}
		return this._instance;
	}

	public async init() {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		this.context = await graph.getContext(AUTHORIZATION_CODE_CONTEXT_NAME);
		if (!this.context) this.context = await graph.addContext(new SpinalContext(AUTHORIZATION_CODE_CONTEXT_NAME, AUTHORIZATION_CODE_CONTEXT_TYPE));
		return this.context;
	}

	public saveReAuthorizationCode(code: AuthorizationCode, client: Client, user: User): Promise<SpinalNode> {
		const node = new SpinalNode(code.authorizationCode, AUTHORIZATION_CODE_TYPE);
		node.info.add_attr({
			expiresAt: code.expiresAt.getTime(),
			redirectUri: code.redirectUri,
			scope: code.scope || [],
			authorizationCode: code.authorizationCode,
			codeChallenge: code.codeChallenge || "",
			codeChallengeMethod: code.codeChallengeMethod || "",
			client,
			user,
		});

		return this.context.addChildInContext(node, AUTHORIZATION_CODE_CONTEXT_TO_NODE_RELATION_NAME, SPINAL_RELATION_PTR_LST_TYPE, this.context);
	}

	public async removeAuthorizationCode(code: AuthorizationCode): Promise<boolean> {
		try {
			const node = await this.getAuthorizationCode(code.authorizationCode);
			if (!node) return false;
			await node.removeFromGraph();
			return true;
		} catch (error) {
			return false;
		}
	}

	public async getAuthorizationCode(authorizationCode: string): Promise<SpinalNode> {
		const nodes = await this.context.getChildren(AUTHORIZATION_CODE_CONTEXT_TO_NODE_RELATION_NAME);
		return nodes.find((node) => node.info?.authorizationCode?.get() === authorizationCode);
	}
}
