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
} from 'tsoa';
import {
  IOrganCreationParams,
  IOrganUpdateParams,
  IOrgan,
  statusOrgan,
} from './organ.model';
import { OrganService } from './organService';

@Route('organs')
export class OrgansController extends Controller {
  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post('{platformId}')
  public async createOrgan(
    @Body() requestBody: IOrganCreationParams
  ): Promise<IOrgan> {
    let organ = new OrganService().createOrgan(requestBody);
    this.setStatus(201); // set return status 201rt
    return organ;
  }

  @Security('jwt')
  @Get('{platformId}')
  public async getOrgans(@Path() platformId: string): Promise<IOrgan[]> {
    this.setStatus(201); // set return status 201
    return new OrganService().getOrgans(platformId);
  }

  // @Security('jwt')
  // @Get('{platformId}/organ/{OrganId}')
  // public async getOrgan(
  //   @Path() platformId: string,
  //   @Path() organId: string
  // ): Promise<IOrgan> {
  //   this.setStatus(201); // set return status 201
  //   return new OrganService().getOrgan(platformId, organId);
  // }

  // @Security('jwt')
  // @Delete('{platformId}/{organId}')
  // public async deleteOrgan(
  //   @Path() platformId: string,
  //   @Path() organId: string
  // ): Promise<void> {
  //   return new OrganService().deleteOrgan(platformId, organId);
  // }

  @Security('jwt')
  @Put('{organId}')
  public async updatePlateform(
    @Path() organId: string,
    @Body() requestBody: IOrganUpdateParams
  ): Promise<IOrgan> {
    return new OrganService().updateOrgan(organId, requestBody);
  }
}
