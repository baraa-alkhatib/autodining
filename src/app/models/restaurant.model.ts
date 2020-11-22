/* eslint-disable import/no-cycle */
import IReview from './review.model';
import { IUser } from './user.model';

/**
 * Detailed restaurant data model
 * @export
 * @interface IRestaurant
 */
export default interface IRestaurant {
  _id: string;
  user: IUser;
  maxReview: IReview;
  minReview: IReview;
  name: string;
  imageUrl: string;
  description: string;
  address: string;
  rating: number;
  reviewsCount: number;
  awaitingResponse?: number;
  status: 'open' | 'closed';
}
