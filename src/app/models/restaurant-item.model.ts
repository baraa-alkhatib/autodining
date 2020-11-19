/**
 * Non-detailed restaurant view data model
 * @export
 * @interface IRestaurantItem
 */
export default interface IRestaurantItem {
  _id: string;
  imageUrl: string;
  name: string;
  rating: number;
  reviewsNumber: number;
  address: string;
  status: 'open' | 'closed';
}
