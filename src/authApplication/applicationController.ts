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
  IApplicationLogs
} from './application.model';
import { ApplicationService } from './applicationService';
import { IApplicationToken } from '../tokens/token.model';

let applicationService = new ApplicationService()

@Route('applications')
export class ApplicationsController extends Controller {
  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createApplication(
    @Body() requestBody: IApplicationCreationParams
  ): Promise<IApplication | {error : string}> {
    try {
      await applicationService.init()
      let application = await applicationService.createApplication(requestBody);
      this.setStatus(201); // set return status 201rt
      return application;
    } catch (error) {
      this.setStatus(error.status || 500);
      return { error: error.message };
    }
    
  }

  @Security('jwt')
  @Get()
  public async getApplications(): Promise<any[] | {error : string}> {
    try {
      await applicationService.init()
      const applications = await applicationService.getApplications();
      this.setStatus(200); // set return status 201
      return applications;
    } catch (error) {
      this.setStatus(error.status || 500);
      return { error: error.message };
    }
    
  }

  @Security('jwt')
  @Get('{applicationId}')
  public async getApplication(
    @Path() applicationId: string
  ): Promise<IApplication| {error : string}> {
    try {
      await applicationService.init()
      const application = await applicationService.getApplication(applicationId);
      this.setStatus(200); // set return status 201
      return application;
    } catch (error) {
      this.setStatus(error.status || 500);
      return { error: error.message };
    }
  }

  @Security('jwt')
  @Delete('{applicationId}')
  public async deleteApplication(@Path() applicationId: string): Promise<void| {message?: string; error? : string}> {
    try {
      await applicationService.init()
      const app = applicationService.deleteApplication(applicationId);
      this.setStatus(200); // set return status 201
      return { message: 'Application deleted'}
    } catch (error) {
      this.setStatus(error.status || 500);
      return { error: error.message };
    }
  }

  @Security('jwt')
  @Put('{applicationId}')
  public async updateApplication(
    @Path() applicationId: string,
    @Body() requestBody: IApplicationUpdateParams
  ): Promise<IApplication| {error : string}> {
    try {
      await applicationService.init()
      const updated = applicationService.updateApplication(
        applicationId,
        requestBody
      );

      this.setStatus(200); // set return status 201
      return updated;
      
    } catch (error) {
      this.setStatus(error.status || 500);
      return { error: error.message };
    }
  }

  @Post('/login')
  public async login(
    @Body() requestBody: IApplicationLoginParams
  ): Promise<IApplicationToken| {error : string}> {
    try {
      await applicationService.init()
      const appToken = await applicationService.login(requestBody);
      this.setStatus(200); // set return status 201
      return appToken;
      
    } catch (error) {
      this.setStatus(error.status || 500);
      return { error: error.message };
    }
  }

  @Security('jwt')
  @Get('{applicationId}/applicationLogs')
  public async getApplicationLogs(
    @Path() applicationId: string
  ): Promise<IApplicationLogs[]| {error : string}> {
    try {
      await applicationService.init()
      const application = await  applicationService.getApplicationLogs(applicationId);
      this.setStatus(200); 
      return application;
    } catch (error) {
      this.setStatus(error.status || 500);
      return { error: error.message };
    }
  }
}
