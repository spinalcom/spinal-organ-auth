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
import {expressAuthentication} from "./authentication"

@Route("users")
export class UsersController extends Controller {

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

  @Get("{userId}")
  public async getUser(
    @Path() userId: string
  ): Promise<IUser> {
    this.setStatus(201); // set return status 201
    return new UsersService().getUser(userId);
  }

  @Delete('{userId}')
  public async deleteUser( 
    @Path() userId: string
  ): Promise<void> {
    return new UsersService().deleteUser(userId);
  }

  
  @Put('{userId}')
  public async updateUser( 
    @Path() userId: string,
    @Body() requestBody: IUserUpdateParams

  ): Promise<IUser> {
    return new UsersService().updateUser(userId,requestBody);
  }



  @Post("/login")
  public async login(
  @Body() requestBody: IUserLoginParams
  ): Promise<string> {
    this.setStatus(201); // set return status 201    
    return new UsersService().login(requestBody);

  }




}
