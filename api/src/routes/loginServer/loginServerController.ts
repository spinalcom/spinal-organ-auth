import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security } from "tsoa";
import { HttpStatusCode } from "../../utilities/http-status-code";
import { ILoginServer, ServerType } from "./loginServer.model";
import { loginService } from "./loginServerService"
import { OperationError } from "../../utilities/operation-error";


@Route("loginserver")
export class LoginServerController extends Controller {

    constructor() {
        super();
    }


    @Security("jwt", ["authAdmin:write"])
    @Post("/create")
    public async createLoginServer(@Body() serverInfo: ILoginServer) {
        try {
            serverInfo.type = ServerType.EXTERNAL;

            const isValid = loginService.checkExternalServer(serverInfo);
            if (!isValid) throw new OperationError("Invalid Server Info", HttpStatusCode.BAD_REQUEST);

            const node = await loginService.createLoginServer(serverInfo);
            this.setStatus(HttpStatusCode.CREATED);
            return loginService.formatServerNode(node);

        } catch (error) {
            this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

    @Security("jwt", ["authAdmin:read"])
    @Get("/all_servers")
    public async getAllLoginServer() {
        try {
            const nodes = await loginService.getLoginServer();
            if (nodes.length === 0) throw new OperationError("Server not found", HttpStatusCode.NOT_FOUND);

            this.setStatus(HttpStatusCode.OK);
            return nodes.map(el => loginService.formatServerNode(el));

        } catch (error) {
            this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

    @Security("jwt", ["authAdmin:read"])
    @Get("/{serverId}")
    public async getLoginServer(@Path() serverId: string) {
        try {
            const nodes = await loginService.getLoginServer(serverId);
            if (nodes.length !== 1) throw new OperationError("Server not found", HttpStatusCode.NOT_FOUND);

            this.setStatus(HttpStatusCode.OK);
            return loginService.formatServerNode(nodes[0]);

        } catch (error) {
            this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

    @Security("jwt", ["authAdmin:write"])
    @Put("/update/{serverId}")
    public async editLoginServer(@Path() serverId: string, @Body() requestBody: ILoginServer) {
        try {
            const node = await loginService.editLoginServer(serverId, requestBody);
            this.setStatus(HttpStatusCode.OK);
            return loginService.formatServerNode(node);
        } catch (error) {
            this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

    @Security("jwt", ["authAdmin:delete"])
    @Delete("/delete/{serverId}")
    public async deleteLoginServer(@Path() serverId: string) {
        try {
            await loginService.deleteLoginServer(serverId);
            this.setStatus(HttpStatusCode.OK);

            return { message: "Server deleted with success !" };

        } catch (error) {
            this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }


}