import { Handler } from 'express';
import Review, { ReviewModel } from '../../db/models/review.mongodb.model';
import { UserModel } from '../../db/models/user.mongodb.model';
import createError from '../../utils/error.utils';

const createReview: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const reqUserId = (<UserModel>req.user)._id;

    const { restaurantId } = req.query;

    const { comment, visitedAt, rating }: Partial<ReviewModel> = req.body;

    // validate inputs
    if (!visitedAt || !rating || (Number(rating) < 1 && Number(rating) > 5)) {
      throw createError(new Error('Invalid request body'), {
        client: 'Invalid request body',
        statusCode: 404,
      });
    }

    // create a new review record
    const review = new Review(<ReviewModel>{
      user: reqUserId,
      restaurant: restaurantId,
      comment,
      visitedAt: new Date(visitedAt),
      rating,
    });

    // save new record
    await review.save();

    res.locals.review = review;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default createReview;
