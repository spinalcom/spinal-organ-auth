import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
  } from "tsoa";
  import { AuthUser } from "./user.model";
  import { UsersService, UserCreationParams } from "./authUserService";
  
  @Route("users")
  export class UsersController extends Controller {
    @Get("{userId}")
    public async getUser(
      @Path() userId: number,
      @Query() name?: string
    ): Promise<AuthUser> {
      return new UsersService().getUser(userId, name);
    }
  
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
      @Body() requestBody: UserCreationParams
    ): Promise<void> {
      this.setStatus(201); // set return status 201
      new UsersService().createUser(requestBody);
      return;
    }
  }