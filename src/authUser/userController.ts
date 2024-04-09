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
  IUser,
  IUserCreationParams,
  IUserUpdateParams,
  IUserLoginParams,
  IAuthAdminUpdateParams,
  IUserLogs
} from './user.model';
import { UserService } from './userService';
import { IUserToken } from '../tokens/token.model';
import { HttpStatusCode } from '../utilities/http-status-code';

@Route('users')
export class UsersController extends Controller {
  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: IUserCreationParams
  ): Promise<IUser|{error: string}> {
    try {
      let user = new UserService().createUser(requestBody);
      this.setStatus(HttpStatusCode.CREATED); // set return status 201rt
      return user;
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }

  @Security('jwt')
  @Get()
  public async getUsers(): Promise<IUser[]|{error: string}> {
    try {
      const users = await new UserService().getUsers();
      this.setStatus(HttpStatusCode.OK); // set return status 201
      return users;
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }

  @Security('jwt')
  @Get('{userId}')
  public async getUser(@Path() userId: string): Promise<IUser|{error: string}> {
    try {
      const user = await new UserService().getUser(userId);
      this.setStatus(HttpStatusCode.OK); // set return status 201
      return user;
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }

  @Security('jwt')
  @Delete('{userId}')
  public async deleteUser(@Path() userId: string): Promise<void|{error?: string; message?: string}> {
    try {
      await new UserService().deleteUser(userId);
      this.setStatus(HttpStatusCode.OK); // set return status 201
      return {message: 'User deleted'};
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }

  @Security('jwt')
  @Put('{userId}')
  public async updateUser(
    @Path() userId: string,
    @Body() requestBody: IUserUpdateParams
  ): Promise<IUser|{error: string}> {
    try {
      const userUpdated = await new UserService().updateUser(userId, requestBody);
      this.setStatus(HttpStatusCode.OK); // set return status 201
      return userUpdated;
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }

  @Security('jwt')
  @Put()
  public async updateAuthAdmin(
    @Body() requestBody: IAuthAdminUpdateParams
  ): Promise<IUser|{error: string}> {
    try {
      const adminUpdated = await new UserService().updateAuthAdmin(requestBody);
      this.setStatus(HttpStatusCode.OK); // set return status 201
      return adminUpdated;
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }

  // @Security('jwt')
  @Post('/getAuthAdmin')
  public async getAuthAdmin(): Promise<IUser|{error: string}> {
    try {
      const authAdmin = await new UserService().getAuthAdmin();
      this.setStatus(HttpStatusCode.OK); // set return status 201
      return authAdmin;
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }

  @Security('jwt')
  @Post('/userProfilesList')
  public async userProfilesList(): Promise<any[]|{error: string}> {
    try {
      const profileList = await new UserService().userProfilesList();
      this.setStatus(HttpStatusCode.OK); // set return status 201
      return profileList;
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }

  @Post('/login')
  public async login(
    @Body() requestBody: IUserLoginParams
  ): Promise<IUserToken|{error: string}> {
    try {
      const userToken = await new UserService().login(requestBody);
      this.setStatus(HttpStatusCode.OK); // set return status 201
      return userToken;
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }

  @Post('/loginAuthAdmin')
  public async loginAuthAdmin(
    @Body() requestBody: IUserLoginParams
  ): Promise<IUserToken|{error: string}> {
    try {
      const userToken = await new UserService().loginAuthAdmin(requestBody);
      this.setStatus(HttpStatusCode.OK); // set return status 201
      return userToken;
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }

  // @Security("jwt")
  // @Get('/getInfoToken/{token}')
  // public async getInfoToken(@Path() token: string): Promise<IUserProfile> {
  //   this.setStatus(HttpStatusCode.CREATED); // set return status 201
  //   return new UserService().getInfoToken(token);
  // }

  // @Security("jwt")
  @Post('/getRoles')
  public async getRoles(): Promise<{ name: string }[]|{error: string}> {
    try {
      const roles = await new UserService().getRoles();
      this.setStatus(HttpStatusCode.OK); // set return status 201
      return roles;
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }
  @Security('jwt')
  @Get('{userId}/userLogs')
  public async getUserLogs(
    @Path() userId: string
  ): Promise<IUserLogs[]|{error: string}> {
    try {
      const logs = await new UserService().getUserLogs(userId);
      this.setStatus(HttpStatusCode.OK); // set return status 201
      return logs;
    } catch (error) {
      this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
      return { error: error.message };
    }
  }
}
