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
import { IPlatform, IPlateformCreationParams, IPlatformUpdateParams } from "./platform.model";
import { PlatformsService } from "./platformServices"

@Route("platforms")
export class PlatformsController extends Controller {

  @Security("jwt")
  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createPlateform(
    @Body() requestBody: IPlateformCreationParams
  ): Promise<IPlatform> {
    //return Promise.resolve();
    let platform = new PlatformsService().createPlateform(requestBody);
    this.setStatus(201); // set return status 201rt
    return platform;
  }

  @Security("jwt")
  @Get()
  public async getPlatforms():
    Promise<IPlatform[]> {
    this.setStatus(201); // set return status 201
    return new PlatformsService().getPlateforms();
  }

  @Security("jwt")
  @Get("{platformId}")
  public async getPlateform(
    @Path() platformId: string
  ): Promise<IPlatform> {
    this.setStatus(201); // set return status 201
    return new PlatformsService().getPlateform(platformId);
  }


  @Security("jwt")
  @Delete('{platformId}')
  public async deletePlatform(
    @Path() platformId: string
  ): Promise<void> {
    return new PlatformsService().deletePlatform(platformId);
  }

  @Security("jwt")
  @Put('{platformId}')
  public async updatePlateform(
    @Path() platformId: string,
    @Body() requestBody: IPlatformUpdateParams

  ): Promise<IPlatform> {
    return new PlatformsService().updatePlateform(platformId, requestBody);
  }

}