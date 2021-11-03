import {
  Model,
  Ptr,
  spinalCore,
  FileSystem,
} from "spinal-core-connectorjs_type";
import {
  USER_LIST,
  AUTH_SERVICE_USER_RELATION_NAME,
  USER_TYPE,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
} from "../constant";
import { SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from "spinal-env-viewer-graph-service";
import { OperationError } from "../utilities/operation-error";
import { HttpStatusCode } from "../utilities/http-status-code";
import { User, UserCreationParams } from "./user.model";
import { bcrypt } from "bcrypt";
//export type UserCreationParams = Pick<User, "userName">;

/**
 * @export
 * @class UsersService
 */
export class UsersService {
  constructor() {}
  public async getUsers(): Promise<User[]> {
    try {
      var usersObjectList = [];
      const context = await SpinalGraphService.getContext(USER_LIST);
      const users = await context.getChildren(AUTH_SERVICE_USER_RELATION_NAME);
      for (const user of users) {
        let userObject: User = {
          id: user.getId().get(),
          type: user.getType().get(),
          userName: user.getName().get(),
          password: await user.element.load(),
          role: await user.element.load(),
        };
        usersObjectList.push(userObject);
      }
      return usersObjectList;
    } catch (error) {
      return error;
    }
  }

  public async getUser(id: string): Promise<User> {
    const context = await SpinalGraphService.getContext(USER_LIST);
    const users = await context.getChildren(AUTH_SERVICE_USER_RELATION_NAME);
    var userObject: User;
    for (const user of users) {
      if (user.getId().get() === id) {
        userObject = {
          id: user.getId().get(),
          type: user.getType().get(),
          userName: user.getName().get(),
          password: user.info.password.get(),
          role: user.info.role.get(),
        };
      }
    }
    if (userObject) {
      return userObject;
    } else {
      throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
    }
  }

  public async createUser(
    userCreationParams: UserCreationParams
  ): Promise<User> {
    const context = await SpinalGraphService.getContext(USER_LIST);

    var userCreated = bcrypt
      .hash(userCreationParams.password, 10)
      .then(async (hash) => {
        const userObject = {
          type: USER_TYPE,
          userName: userCreationParams.userName,
          password: hash,
          userProfileId: "",
          role: "",
        };
        const UserId = SpinalGraphService.createNode(userObject, undefined);
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          UserId,
          context.getId().get(),
          AUTH_SERVICE_USER_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
        return {
          id: res.getId().get(),
          type: res.getType().get(),
          userName: res.getName().get(),
          password: res.info.password.get(),
          role: res.info.role.get(),
        };
      });
      return userCreated
    
  }

  public async updateUser(id :string): Promise<User> {
    const context = await SpinalGraphService.getContext(USER_LIST);
    const users = await context.getChildren(AUTH_SERVICE_USER_RELATION_NAME);
    var userObject: User;
    for (const user of users) {
      if (user.getId().get() === id) {
        userObject = {
          id: user.getId().get(),
          type: user.getType().get(),
          userName: user.getName().get(),
          password: user.info.password.get(),
          role: user.info.role.get(),
        };
      }
    }
    return
  }

  public async delete(id:string):Promise<void> {
    const context = await SpinalGraphService.getContext(USER_LIST);
    const users = await context.getChildren(AUTH_SERVICE_USER_RELATION_NAME);
    for (const user of users) {
      if (user.getId().get() === id) {
        SpinalGraphService.removeFromGraph(id)
      }
    }
  }
}
