/**
 * @export
 * @interface User
 */
export interface User {
  id: string | number;
  type: string
  userName: string;
  password: string;
  userProfileId?: string;
  role?: string;
}
 export interface UserCreationParams {
  userName: string;
  password: string;
 }