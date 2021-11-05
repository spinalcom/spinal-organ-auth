import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Put,
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
      return new UsersService().getUser();
    }
//
//
    @Get()
    public async getUsers(
      //@Path() userId: string,
      //@Query() name?: string
    ): Promise<User[]> {
      console.log("=================");
      //this.setStatus(201); // set return status 201
      return  new UsersService().getUsers();
    }


    //@Post()
    //public async login(
    //  @Body() requestBody: UserCreationParams
    //): Promise<{}> {
    //  console.log(requestBody);
    //  
    //  let login = new UsersService().login(requestBody);
    //  return login;
    //}

  
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
      @Body() requestBody: UserCreationParams
    ): Promise<User> {
      console.log(requestBody);
      
      //this.setStatus(201); // set return status 201
      let user = new UsersService().createUser(requestBody);
      return user;
    }
  }