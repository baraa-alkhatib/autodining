/**
 * Non-detailed restaurant view data model
 * @export
 * @interface IRestaurantItem
 */
export default interface IRestaurantItem {
  _id: string;
  user?: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  pendingReviews?: number;
  address: string;
  status: 'open' | 'closed';
}
