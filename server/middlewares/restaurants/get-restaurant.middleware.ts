import { Handler } from 'express';
import Restaurant from '../../db/models/restaurant.mongodb.model';
import Review from '../../db/models/review.mongodb.model';
import { UserModel } from '../../db/models/user.mongodb.model';

const getRestaurant: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const userType = (<UserModel>req.user).type;

    const reqUserId = (<UserModel>req.user).id;

    const restaurantId = req.params.id;

    // construct filter
    const filter: any = {
      _id: restaurantId,
    };

    if (userType === 'owner') {
      // TODO: alternatively validate request to make sure owners do not makes requests on others' restaurants
      filter.user = reqUserId;
    }

    const restaurants = await Restaurant.aggregate([
      // match restaurant with filter
      { $match: filter },
      // get average rating
      {
        $lookup: {
          // rating is stored in reviews
          from: Review.collection.name,
          let: { review: '$_id' },
          pipeline: [
            // match reviews with same restaurant id
            {
              $match: {
                $expr: { $eq: ['$_id', '$$review'] },
              },
            },
            // group reviews and get average rating
            {
              $group: {
                _id: '$_id',
                averageRating: { $avg: '$rating' },
              },
            },
          ],
          // return reviews array
          as: 'reviews',
        },
      },
      // return the necessary fields
      {
        $project: {
          _id: 1,
          user: 1,
          name: 1,
          description: 1,
          address: 1,
          imageUrl: 1,
          status: 1,
          createdAt: 1,
          reviews: 1,
        },
      },
    ]);

    // retrieve the first and only restaurant in the resulting array
    const [restaurant] = [restaurants];

    res.locals.restaurant = restaurant;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default getRestaurant;
