/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Route,
  Security,
  SuccessResponse,
} from "tsoa";
import {
  IUserProfile,
  IServerCreationParams,
  IServerUpdateParams,
  IServer
} from "./server.model";
import { ServerService } from "./serverServices"


@Route("servers")
export class ServersController extends Controller {

  @Security("jwt")
  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createServer(
    @Body() requestBody
  ): Promise<IServer> {
    //return Promise.resolve();
    let server = new ServerService().createServer(requestBody);
    this.setStatus(201); // set return status 201rt
    return server;
  }

  @Security("jwt")
  @Get()
  public async getServers():
    Promise<IServer[]> {
    this.setStatus(201); // set return status 201
    return new ServerService().getServers();
  }

  @Security("jwt")
  @Get("{serverId}")
  public async getServer(
    @Path() serverId: string
  ): Promise<IServer> {
    this.setStatus(201); // set return status 201
    return new ServerService().getServer(serverId);
  }

  @Security("jwt")
  @Delete('{serverId}')
  public async deleteServer(
    @Path() serverId: string
  ): Promise<void> {
    return new ServerService().deleteServer(serverId);
  }

  @Security("jwt")
  @Put('{serverId}')
  public async updatePlateform(
    @Path() serverId: string,
    @Body() requestBody: IServerUpdateParams

  ): Promise<IServer> {
    return new ServerService().updateServer(serverId, requestBody);
  }


}
