/**
 * @export
 * @interface User
 */
export interface IUser {
  id: string | number;
  type: string
  name?: string
  userName: string;
  password?: string;
  role?: string;
  rights?: {
    userProfileId?: string;
    plateformId?: string,
    serverId? : string,
  }[]
}
 /**

  * @export
  * @interface IUserCreationParams
  */
 export interface IUserCreationParams {
  userName: string;
  password: string;
  userProfileId?: string;
  role?: string;
  rights?: {
    userProfileId?: string;
    plateformId?: string,
    serverId? : string,
  }[]
 }

 export interface IUserUpdateParams{
  userName?: string;
  password?: string;
  userProfileId?: string;
  role?: string;
 }


 export interface IUserLoginParams{
  userName: string;
  password: string;
 }