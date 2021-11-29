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
import { IUser, IUserCreationParams, IUserUpdateParams, IUserLoginParams } from "./user.model";
import { UsersService } from "./userService";
import { expressAuthentication } from "./authentication"

@Route("users")
export class UsersController extends Controller {
  @Security("jwt")
  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: IUserCreationParams
  ): Promise<IUser> {
    //return Promise.resolve();
    let user = new UsersService().createUser(requestBody);
    this.setStatus(201); // set return status 201rt
    return user;
  }

  @Security("jwt")
  @Get()
  public async getUsers():
    Promise<IUser[]> {
    this.setStatus(201); // set return status 201
    return new UsersService().getUsers();
  }

  @Security("jwt")
  @Get("{userId}")
  public async getUser(
    @Path() userId: string
  ): Promise<IUser> {
    this.setStatus(201); // set return status 201
    return new UsersService().getUser(userId);
  }

  @Security("jwt")
  @Delete('{userId}')
  public async deleteUser(
    @Path() userId: string
  ): Promise<void> {
    return new UsersService().deleteUser(userId);
  }

  @Security("jwt")
  @Put('{userId}')
  public async updateUser(
    @Path() userId: string,
    @Body() requestBody: IUserUpdateParams
  ): Promise<IUser> {
    return new UsersService().updateUser(userId, requestBody);
  }



  @Post("/login")
  public async login(
    @Body() requestBody: IUserLoginParams
  ): Promise<string> {
    this.setStatus(201); // set return status 201    
    return new UsersService().login(requestBody);
  }




}
