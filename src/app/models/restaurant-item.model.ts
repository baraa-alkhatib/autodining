/**
 * Non-detailed restaurant view data model
 * @export
 * @interface IRestaurantItem
 */
export default interface IRestaurantItem {
  _id: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  address: string;
  status: 'open' | 'closed';
}
