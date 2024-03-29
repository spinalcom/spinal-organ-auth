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
  IUserProfile,
} from './user.model';
import { UserService } from './userService';
import { expressAuthentication } from './authentication';
import { IUserToken } from '../tokens/token.model';

@Route('users')
export class UsersController extends Controller {
  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: IUserCreationParams
  ): Promise<IUser> {
    //return Promise.resolve();
    let user = new UserService().createUser(requestBody);
    this.setStatus(201); // set return status 201rt
    return user;
  }

  @Security('jwt')
  @Get()
  public async getUsers(): Promise<IUser[]> {
    this.setStatus(201); // set return status 201
    return new UserService().getUsers();
  }

  @Security('jwt')
  @Get('{userId}')
  public async getUser(@Path() userId: string): Promise<IUser> {
    this.setStatus(201); // set return status 201
    return new UserService().getUser(userId);
  }

  @Security('jwt')
  @Delete('{userId}')
  public async deleteUser(@Path() userId: string): Promise<void> {
    return new UserService().deleteUser(userId);
  }

  @Security('jwt')
  @Put('{userId}')
  public async updateUser(
    @Path() userId: string,
    @Body() requestBody: IUserUpdateParams
  ): Promise<IUser> {
    return new UserService().updateUser(userId, requestBody);
  }

  @Security('jwt')
  @Post('/userProfilesList')
  public async userProfilesList(): Promise<any[]> {
    this.setStatus(201); // set return status 201
    return new UserService().userProfilesList();
  }

  @Post('/login')
  public async login(
    @Body() requestBody: IUserLoginParams
  ): Promise<IUserToken> {
    this.setStatus(201); // set return status 201
    return new UserService().login(requestBody);
  }

  // @Security("jwt")
  // @Get("/getUserProfileByToken/{verifyToken}")
  // public async getUserProfileByToken(
  //   @Path() verifyToken: string
  // ): Promise<IUserProfile> {
  //   this.setStatus(201); // set return status 201
  //   return new UserService().getUserProfileByToken(verifyToken);
  // }

  // @Security("jwt")
  @Get('/getInfoToken/{token}')
  public async getInfoToken(@Path() token: string): Promise<IUserProfile> {
    this.setStatus(201); // set return status 201
    return new UserService().getInfoToken(token);
  }

  // @Security("jwt")
  @Post('/getRoles')
  public async getRoles(): Promise<{ name: string }[]> {
    this.setStatus(201); // set return status 201
    return new UserService().getRoles();
  }
}
