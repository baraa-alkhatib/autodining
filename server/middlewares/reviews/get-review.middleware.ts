import { Handler } from 'express';

import Review, { ReviewModel } from '../../db/models/review.mongodb.model';
import createError from '../../utils/error.utils';

const getReview: Handler = async (req, res, next) => {
  try {
    // extract necessary fields

    const reviewId = req.params.id;

    // validate inputs
    if (!reviewId) {
      throw createError(new Error('Invalid request body'), {
        client: 'Invalid request body',
        statusCode: 404,
      });
    }

    let review: ReviewModel | null = null;

    review = <ReviewModel>await Review.findById(reviewId).populate('user').populate('restaurant');

    res.locals.review = review;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default getReview;
