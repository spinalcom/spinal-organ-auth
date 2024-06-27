import { SPINAL_RELATION_PTR_LST_TYPE, SpinalContext, SpinalNode } from "spinal-model-graph";
import SpinalMiddleware from "../spinalMiddleware";
import { AUTHORIZATION_CODE_CONTEXT_TO_NODE_RELATION_NAME, AUTHORIZATION_CODE_TYPE, REFRESH_TOKEN_CONTEXT_NAME, REFRESH_TOKEN_CONTEXT_TO_NODE_RELATION_NAME, REFRESH_TOKEN_CONTEXT_TYPE, REFRESH_TOKEN_TYPE } from "../constant";
import { Token, Client, User, RefreshToken } from "@node-oauth/oauth2-server";

export class RefreshTokenService {
	private static _instance: RefreshTokenService;
	public context: SpinalContext;

	private constructor() {}

	static getInstance(): RefreshTokenService {
		if (!this._instance) {
			this._instance = new RefreshTokenService();
		}
		return this._instance;
	}

	public async init() {
		const graph = await SpinalMiddleware.getInstance().getGraph();
		this.context = await graph.getContext(REFRESH_TOKEN_CONTEXT_NAME);
		if (!this.context) this.context = await graph.addContext(new SpinalContext(REFRESH_TOKEN_CONTEXT_NAME, REFRESH_TOKEN_CONTEXT_TYPE));
		return this.context;
	}

	public saveRefreshToken(token: Token, client: Client, user: User, tokenNode: SpinalNode) {
		const node = new SpinalNode(`${user.name}_token`, REFRESH_TOKEN_TYPE);
		node.info.add_attr({
			refreshToken: token.refreshToken,
			refreshTokenExpiresAt: token.refreshTokenExpiresAt.getTime(),
			scope: token.scope || [],
			client,
			user,
		});

		return this.context.addChildInContext(node, REFRESH_TOKEN_CONTEXT_TO_NODE_RELATION_NAME, SPINAL_RELATION_PTR_LST_TYPE, this.context);
	}

	public async removeRefreshToken(token: RefreshToken): Promise<boolean> {
		try {
			const node = await this.getRefreshToken(token.refreshToken);
			if (!node) return false;
			await node.removeFromGraph();
			return true;
		} catch (error) {
			return false;
		}
	}

	public async getRefreshToken(refreshToken: string): Promise<SpinalNode> {
		const nodes = await this.context.getChildren(REFRESH_TOKEN_CONTEXT_TO_NODE_RELATION_NAME);
		return nodes.find((node) => node.info.refreshToken?.get() === refreshToken);
	}
}
