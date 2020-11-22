import { Handler } from 'express';
import * as mongoose from 'mongoose';
import Restaurant from '../../db/models/restaurant.mongodb.model';
import Review from '../../db/models/review.mongodb.model';
import { UserModel } from '../../db/models/user.mongodb.model';
import createError from '../../utils/error.utils';

const getRestaurants: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const userType = (<UserModel>req.user).type;

    const reqUserId = (<UserModel>req.user).id;

    const { orderAlphabetically, smallestNumberOfStars, status } = req.query;

    // validate inputs
    if (
      (orderAlphabetically && Number(orderAlphabetically) !== 1) ||
      (status && status !== 'open' && status !== 'closed') ||
      (smallestNumberOfStars &&
        (Number(smallestNumberOfStars) < 1 ||
          Number(smallestNumberOfStars) > 5 ||
          Number.isNaN(Number(smallestNumberOfStars))))
    ) {
      throw createError(new Error('Invalid request body'), {
        client: 'Invalid request body',
        statusCode: 404,
      });
    }

    // construct filter
    const filter: any = {};

    // construct sorting
    const sort: any = {};

    if (userType === 'owner') {
      // TODO: alternatively validate request to make sure owners do not makes requests on others' restaurants
      filter.user = mongoose.Types.ObjectId(reqUserId);
    }

    // return restaurants with status open/closed
    if (status) {
      filter.status = status;
    }

    // return restaurants in alphabetical order
    if (Number(orderAlphabetically) === 1) {
      sort.name = 1;
    } else {
      sort.rating = 1;
    }

    const restaurants = await Restaurant.aggregate([
      // match restaurants with filter
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
                pendingReviews: { $sum: '$pending' },
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
          pendingReviews:
            userType === 'owner' || userType === 'admin' ? '$reviews.pendingReviews' : 0,
        },
      },

      // return restaurants with smalles number of stars requested (Default: all)
      {
        $match: smallestNumberOfStars
          ? {
              rating: { $gt: Number(smallestNumberOfStars) },
            }
          : {},
      },

      // use the custom sort object to sort the resulting restaurants array
      { $sort: sort },
    ]);

    res.locals.restaurants = restaurants;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default getRestaurants;
