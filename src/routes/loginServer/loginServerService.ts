import { SPINAL_RELATION_PTR_LST_TYPE, SpinalContext, SpinalGraph, SpinalNode } from "spinal-model-graph";
import { ILoginServer, ServerType } from "./loginServer.model";
import { isOAuthAuthenticationInfo, isOpenIdAuthenticationInfo, isSAMLAuthenticationInfo } from "../platform/utils";
import { CONNECTION_METHODS, LOGIN_SERVER_CONTEXT_NAME, LOGIN_SERVER_CONTEXT_TYPE, LOGIN_SERVER_RELATION_NAME, PLATFORM_TO_LOGIN_SERVER } from "../../constant";
import { OperationError } from "../../utilities/operation-error";
import { Http2ServerRequest } from "http2";
import { HttpStatusCode } from "../../utilities/http-status-code";


class LoginServerService {
    public context: SpinalContext;
    private _localServer: SpinalNode;
    static instance: LoginServerService;

    private constructor() { };

    static getInstance(): LoginServerService {
        if (!this.instance) this.instance = new LoginServerService();
        return this.instance;
    }

    public async init(context: SpinalContext) {
        this.context = context;
        this._localServer = await this._getOrCreateLocalServer(this.context);

        return this.context;
    }

    public async createLoginServer(serverInfo: ILoginServer): Promise<SpinalNode> {
        const node = new SpinalNode(serverInfo.name, serverInfo.type);
        node.info.add_attr({
            authentication_method: serverInfo.authentication_method,
            ...(serverInfo.authentication_info && { authentication_info: serverInfo.authentication_info })
        })

        return this.context.addChildInContext(node, LOGIN_SERVER_RELATION_NAME, SPINAL_RELATION_PTR_LST_TYPE, this.context);
    }

    public async getLoginServer(serverId?: string): Promise<SpinalNode[]> {
        const servers = await this.context.getChildren(LOGIN_SERVER_RELATION_NAME);
        if (!serverId) return servers;

        return servers.filter(el => el.getId().get() === serverId || el.info?.authentication_info?.clientId?.get() === serverId);
    }


    public async getServeralServersById(serverIds: string[]) {
        const servers = await this.context.getChildren(LOGIN_SERVER_RELATION_NAME);
        return servers.filter(el => serverIds.includes(el.getId().get()));
    }

    public async getServerByIssuer(issuer: string): Promise<SpinalNode> {
        const servers = await this.getLoginServer();
        return servers.find(el => el.info?.authentication_info?.issuer?.get() === issuer);
    }

    public async editLoginServer(serverId: string, requestBody: ILoginServer): Promise<SpinalNode> {
        const [server] = await this.getLoginServer(serverId);
        if (!server) throw new OperationError("Server Not Found", HttpStatusCode.NOT_FOUND);

        for (const key in requestBody) {
            if (Object.prototype.hasOwnProperty.call(requestBody, key)) {
                const value = requestBody[key];
                if (server.info[key]) server.info.mod_attr(key, value);
            }
        }

        return server;
    }

    public async deleteLoginServer(serverId: string) {
        const [server] = await this.getLoginServer(serverId);
        if (!server)
            throw new OperationError("Server Not Found", HttpStatusCode.NOT_FOUND);

        if (server.getId().get() === this._localServer.getId().get())
            throw new OperationError("You cannot delete local server", HttpStatusCode.FORBIDDEN);

        return server.removeFromGraph();
    }


    public async getPlatformsUsingServer(serverNode: SpinalNode | string): Promise<SpinalNode[]> {
        if (typeof serverNode === "string") {
            const [server] = await this.getLoginServer(serverNode);
            if (!server) throw new OperationError("Server Not Found", HttpStatusCode.NOT_FOUND);
            serverNode = server;
        }

        return serverNode.getParents(PLATFORM_TO_LOGIN_SERVER);
    }


    public checkExternalServer(serverInfo: ILoginServer): Boolean {

        const base = serverInfo && serverInfo.type === ServerType.EXTERNAL && serverInfo.name && serverInfo.authentication_method;

        if (!base) return false;

        switch (serverInfo.authentication_method) {
            // case CONNECTION_METHODS.oauth2:
            //     return isOAuthAuthenticationInfo(serverInfo.authentication_info);
            case CONNECTION_METHODS["openid connect"]:
                return isOpenIdAuthenticationInfo(serverInfo.authentication_info);

            case CONNECTION_METHODS.saml:
                return isSAMLAuthenticationInfo(serverInfo.authentication_info);
            default:
                return false;
        }

    }

    public formatServerNode(node: SpinalNode) {
        return node.info.get();
    }


    private async _getOrCreateContext(graph: SpinalGraph): Promise<SpinalContext> {
        let context = await graph.getContext(LOGIN_SERVER_CONTEXT_NAME);
        if (!context) {
            let _c = new SpinalContext(LOGIN_SERVER_CONTEXT_NAME, LOGIN_SERVER_CONTEXT_TYPE);
            context = await graph.addContext(_c);
        }

        this.context = context;
        return context;
    }

    private async _getOrCreateLocalServer(context: SpinalContext) {
        const children = await context.getChildren(LOGIN_SERVER_RELATION_NAME);
        let localServer = children.find(el => el.getType().get() === ServerType.INTERNAL);
        if (!localServer) {
            const info = { name: "LocalServer", type: ServerType.INTERNAL, authentication_method: CONNECTION_METHODS.local };

            localServer = await this.createLoginServer(info);
        }

        return localServer;
    }
}

const loginService = LoginServerService.getInstance();
export default loginService;

export { loginService };