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
  import { User,UserCreationParams } from "./user.model";
  import { UsersService,  } from "./userService";
  

  @Route("users")
  export class UsersController extends Controller {
    @Get("{userId}")
    public async getUser(
      @Path() userId: string,
      //@Query() name?: string
    ): Promise<User> {
      this.setStatus(201); // set return status 201
      return new UsersService().getUser(userId);
    }
  
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
      @Body() requestBody: UserCreationParams
    ): Promise<User> {
      this.setStatus(201); // set return status 201
      let user = new UsersService().createUser(requestBody);
      return user;
    }
  }