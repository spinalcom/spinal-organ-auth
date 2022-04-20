/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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
  IApplication,
  IApplicationCreationParams,
  IApplicationUpdateParams,
  IApplicationLoginParams,
} from './application.model';
import { ApplicationService } from './applicationService';
import { IApplicationToken } from '../tokens/token.model';

@Route('applications')
export class ApplicationsController extends Controller {
  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createApplication(
    @Body() requestBody: IApplicationCreationParams
  ): Promise<IApplication> {
    let application = new ApplicationService().createApplication(requestBody);
    this.setStatus(201); // set return status 201rt
    return application;
  }

  @Security('jwt')
  @Get()
  public async getApplications(): Promise<any[]> {
    this.setStatus(201); // set return status 201
    return new ApplicationService().getApplications();
  }

  @Security('jwt')
  @Get('{applicationId}')
  public async getApplication(
    @Path() applicationId: string
  ): Promise<IApplication> {
    this.setStatus(201); // set return status 201
    return new ApplicationService().getApplication(applicationId);
  }

  @Security('jwt')
  @Delete('{applicationId}')
  public async deleteApplication(@Path() applicationId: string): Promise<void> {
    return new ApplicationService().deleteApplication(applicationId);
  }

  @Security('jwt')
  @Put('{applicationId}')
  public async updateApplication(
    @Path() applicationId: string,
    @Body() requestBody: IApplicationUpdateParams
  ): Promise<IApplication> {
    return new ApplicationService().updateApplication(
      applicationId,
      requestBody
    );
  }

  @Post('/login')
  public async login(
    @Body() requestBody: IApplicationLoginParams
  ): Promise<IApplicationToken> {
    this.setStatus(201); // set return status 201
    return new ApplicationService().login(requestBody);
  }
}
