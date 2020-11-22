import { Handler } from 'express';
import Restaurant from '../../db/models/restaurant.mongodb.model';
import Review, { ReviewModel } from '../../db/models/review.mongodb.model';
import { UserModel } from '../../db/models/user.mongodb.model';
import createError from '../../utils/error.utils';

const getReviews: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const userType = (<UserModel>req.user).type;

    const reqUserId = (<UserModel>req.user).id;

    const { restaurantId, pendingCount, reviewsList } = req.query;

    // validate inputs
    if (
      !restaurantId ||
      (pendingCount && Number(pendingCount) !== 1) ||
      (reviewsList && Number(reviewsList) !== 1)
    ) {
      throw createError(new Error('Invalid request body'), {
        client: 'Invalid request body',
        statusCode: 404,
      });
    }

    // validate request to make sure owners do not makes requests on others' restaurants
    if (userType === 'owner') {
      const restaurant = await Restaurant.findOne({ _id: restaurantId, user: reqUserId });

      if (!restaurant) {
        // user does not own this restaurant, therefore should not get the reviews
        throw createError(new Error('Owner users are not permitted'), {
          client: 'You do not have the necessary permissions!',
          statusCode: 403,
        });
      }
    }

    let reviews: ReviewModel[] | null = null;

    let maxReview: ReviewModel | null = null;

    let minReview: ReviewModel | null = null;

    let awaitingResponseCount: number | null = null;

    // attach number of reviews which have not received a reply yet if the request made by an owner
    if (userType === 'owner' && Number(pendingCount) === 1) {
      awaitingResponseCount = await Review.countDocuments(<ReviewModel>{
        user: reqUserId,
        restaurant: restaurantId,
        reply: <any>{ $exists: true },
      });
    }

    if (reviewsList) {
      reviews = <ReviewModel[]>await Review.find(<ReviewModel>{
        restaurant: restaurantId,
      }).populate('user');

      // get newest max and min reviews

      maxReview = <ReviewModel>await Review.findOne({
        restaurant: restaurantId,
      })
        .populate('user')
        .sort({ rating: -1, createdAt: -1 });

      minReview = <ReviewModel>await Review.findOne({
        restaurant: restaurantId,

        // make sure min is not equal to max
        _id: { $ne: maxReview?._id },
      })
        .populate('user')
        .sort({ rating: 1, createdAt: -1 });
    }

    res.locals.reviews = reviews;

    // atach values to the resulting object

    res.locals.maxReview = maxReview;

    res.locals.minReview = minReview;

    res.locals.awaitingResponseCount = awaitingResponseCount;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default getReviews;
