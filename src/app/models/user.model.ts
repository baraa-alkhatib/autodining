/**
 * User data model
 * @export
 * @interface IUser
 */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  type: 'admin' | 'owner' | 'regular';
  imageUrl?: string;
}
