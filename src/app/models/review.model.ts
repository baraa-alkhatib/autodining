import { IUser } from '../../../server/models/user.model';
import IRestaurant from './restaurant.model';

/**
 * Review data model
 * @export
 * @interface IReview
 */
export default interface IReview {
  _id: string;
  user: IUser;
  restaurant: IRestaurant;
  rating: number;
  comment: string;
  reply: string;
  visitedAt: Date;
}
