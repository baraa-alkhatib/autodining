import { Handler } from 'express';
import * as mongoose from 'mongoose';
import Restaurant from '../../db/models/restaurant.mongodb.model';
import Review from '../../db/models/review.mongodb.model';
import User, { UserModel } from '../../db/models/user.mongodb.model';

const getRestaurant: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const userType = (<UserModel>req.user).type;

    const reqUserId = (<UserModel>req.user).id;

    const restaurantId = req.params.id;

    // construct filter
    const filter: any = {
      _id: mongoose.Types.ObjectId(restaurantId),
    };

    if (userType === 'owner') {
      // TODO: alternatively validate request to make sure owners do not makes requests on others' restaurants
      filter.user = mongoose.Types.ObjectId(reqUserId);
    }

    const restaurants = await Restaurant.aggregate([
      // match restaurant with filter
      { $match: filter },
      // get average rating
      {
        $lookup: {
          // rating is stored in reviews collection
          from: Review.collection.name,

          let: { restaurant: '$_id' },

          pipeline: [
            // match reviews connected to the same restaurant id
            {
              $match: {
                $expr: { $eq: ['$restaurant', '$$restaurant'] },
              },
            },

            {
              $project: {
                _id: 0,
                restaurant: 1,
                rating: 1,
                pending: { $cond: [{ $ifNull: ['$reply', true] }, 1, 0] },
              },
            },

            // group reviews and get average rating and count
            {
              $group: {
                _id: '$restaurant',
                count: { $sum: 1 },
                averageRating: { $avg: '$rating' },
                awaitingResponse: { $sum: '$pending' },
              },
            },
          ],

          // return reviews array
          as: 'reviews',
        },
      },

      // unwind reviews array in order to sort by rating if requested
      {
        $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true },
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
          rating: '$reviews.averageRating',
          reviewsCount: '$reviews.count',
          awaitingResponse:
            userType === 'owner' || userType === 'admin' ? '$reviews.awaitingResponse' : undefined,
        },
      },
    ]);

    // retrieve the first and only restaurant in the resulting array
    const [restaurant] = [...restaurants];

    // extract restaurant's owner info
    const owner = await User.findById(restaurant.user);

    restaurant.user = {
      _id: owner?.id,
      name: (<UserModel>owner)?.name,
      imageUrl: (<UserModel>owner)?.imageUrl,
    };

    res.locals.restaurant = restaurant;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default getRestaurant;
