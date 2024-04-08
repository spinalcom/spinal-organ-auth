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
import { IOrgan } from '../organ/organ.model';
import {
  IPlatform,
  IPlateformCreationParams,
  IPlatformUpdateParams,
  IRegisterKeyObject,
  IPlatformLogs
} from './platform.model';
import { IUserProfile } from './userProfile.model';
import { IAppProfile } from './appProfile.model';
import { PlatformService } from './platformServices';
import { ProfileServices } from './profileServices';
import { error } from 'console';

@Route('platforms')
export class PlatformsController extends Controller {
  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createPlateform(@Body() requestBody): Promise<any> {
    try {
      let platform = await new PlatformService().createPlateform(requestBody);
      this.setStatus(201); // set return status 201rt
      return platform;
    } catch(e) {
      this.setStatus(e.status || 500);
      return {error: e.message};
    }
    
  }

  @Security('jwt')
  @Get()
  public async getPlatforms(): Promise<IPlatform[] | {error: string}> {
    try {
      const platforms = await new PlatformService().getPlateforms();
      this.setStatus(200); // set return status 201
      return platforms;
    } catch (e) {
      this.setStatus(e.status || 500);
      return {error: e.message};
    }
  }

  @Security('jwt')
  @Get('{platformId}')
  public async getPlateform(@Path() platformId: string): Promise<IPlatform| {error: string}> {
    try {
      const platform = await new PlatformService().getPlateform(platformId);
      this.setStatus(200); // set return status 201
      return platform;
    } catch(e) {
      this.setStatus(e.status || 500);
      return {error: e.message};
    }
  }

  @Security('jwt')
  @Delete('{platformId}')
  public async deletePlatform(@Path() platformId: string): Promise<void| {message?: string; error?: string}> {
    try {
      await new PlatformService().deletePlatform(platformId);
      this.setStatus(200); // set return status 201
      return {message: 'Platform deleted'};
    } catch(e) {
      this.setStatus(e.status || 500);
      return {error: e.message};
    }
  }

  @Security('jwt')
  @Put('{platformId}')
  public async updatePlateform(
    @Path() platformId: string,
    @Body() requestBody: IPlatformUpdateParams
  ): Promise<IPlatform| {error: string}> {
    try {
      const updated = await new PlatformService().updatePlateform(platformId, requestBody);
      this.setStatus(200); // set return status 201
      return updated;
    } catch(e) {
      this.setStatus(e.status || 500);
      return {error: e.message};
    }
  }

  @Security('jwt')
  @Get('{platformId}/getUserProfileList')
  public async getUserProfileList(
    @Path() platformId: string
  ): Promise<IUserProfile[]| {error: string}> {
    try {
      const userProfile = await new ProfileServices().getUserProfileService(platformId);
      this.setStatus(200); // set return status 201
      return userProfile;
    } catch(e) {
      this.setStatus(e.status || 500);
      return {error: e.message};
    }
  }

  @Security('jwt')
  @Get('{platformId}/getAppProfileList')
  public async getAppProfileService(
    @Path() platformId: string
  ): Promise<IAppProfile[]| {error: string}> {
    try {
      const appProfile = await new ProfileServices().getAppProfileService(platformId);
      this.setStatus(200); // set return status 201
      return appProfile;
    } catch(e) {
      this.setStatus(e.status || 500);
      return {error: e.message};
    }
  }

  @Security('jwt')
  @Get('{platformId}/platformLogs')
  public async getPlatformLogs(
    @Path() platformId: string
  ): Promise<IPlatformLogs[]| {error: string}> {
    try {
      const plateformLogs = await new PlatformService().getPlateformLogs(platformId);
      this.setStatus(200); // set return status 201
      return plateformLogs;
    } catch(e) {
      this.setStatus(e.status || 500);
      return {error: e.message};
    }
  }

  @Security('jwt')
  @Post('/registerKey')
  public async updateRegisterKeyNode(): Promise<IRegisterKeyObject| {error: string}> {
    try {
      const updated = await new PlatformService().updateRegisterKeyNode();
      this.setStatus(200); // set return status 201
      return updated;
    } catch(e) {
      this.setStatus(e.status || 500);
      return {error: e.message};
    }
  }
}
