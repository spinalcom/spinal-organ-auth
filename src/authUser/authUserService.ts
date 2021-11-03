import {AuthUser} from './user.model'

export type UserCreationParams = Pick<AuthUser, "email" | "name" >;

export class UsersService {

    public getUser(id: number, name?: string): AuthUser {
      return {
        id,
        email: "jane@doe.com",
        name: name ?? "Jane Doe"
      };
    }
  
    public createUser(userCreationParams:UserCreationParams): AuthUser {
      return {
        id: Math.floor(Math.random() * 10000), // Random
        ...userCreationParams,
      };
    }


  
    public updateUser(userCreationParams): AuthUser {
        return {
          id: Math.floor(Math.random() * 10000), // Random
          status: "Happy",
          ...userCreationParams,
        };
      }

      public delete(userCreationParams): AuthUser {
        return {
          id: Math.floor(Math.random() * 10000), // Random
          status: "Happy",
          ...userCreationParams,
        };
      }


  }