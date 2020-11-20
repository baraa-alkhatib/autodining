import { IUser } from '../../../server/models/user.model';

/**
 * Detailed restaurant data model
 * @export
 * @interface IRestaurant
 */
export default interface IRestaurant {
  _id: string;
  user: IUser;
  name: string;
  imageUrl: string;
  description: string;
  address: string;
  status: 'open' | 'closed';
}
