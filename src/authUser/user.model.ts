/**
 * @export
 * @interface User
 */
export interface User {
  id: string | number;
  type: string
  name?: string
  userName: string;
  password?: string;
  userProfileId?: string;
  role?: string;
  buldingList?: {
    id:string;
    appList: {
      id: string;
      appProfileList: string[];
    }[]
  }[]
}
 export interface UserCreationParams {
  userName: string;
  password: string;
 }