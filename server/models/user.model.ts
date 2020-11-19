/**
 * User data model
 * @export
 * @interface User
 */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  type: 'admin' | 'owner' | 'regular';
  imageUrl?: string;
}
