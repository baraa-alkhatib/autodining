import { Handler } from 'express';
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
      filter.user = reqUserId;
    }

    // return restaurants with status open/closed
    if (status) {
      filter.status = status;
    }

    // return restaurants in alphabetical order
    if (Number(orderAlphabetically) === 1) {
      sort.name = 1;
    } else {
      sort.reviews = { rating: -1 };
    }

    const restaurants = await Restaurant.aggregate([
      // match restaurants with filter
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
            // group reviews and get average rating and count
            {
              $group: {
                _id: '$_id',
                count: { $sum: 1 },
                averageRating: { $avg: '$rating' },
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
      // use the custom sort object to sort the resulting restaurants array
      { $sort: sort },
      // return restaurants with smalles number of stars requested (Default: 0)
      { $match: { $gt: Number(smallestNumberOfStars || 0) } },
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

    res.locals.restaurants = restaurants;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default getRestaurants;
