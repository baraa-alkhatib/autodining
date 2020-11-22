import { Handler } from 'express';
import Review, { ReviewModel } from '../../db/models/review.mongodb.model';

const updateReview: Handler = async (req, res, next) => {
  try {
    const reviewId = req.params.id;

    const { comment, visitedAt, rating, reply }: Partial<ReviewModel> = req.body;

    // TODO: validate inputs (Restaurant owners must not be able to edit this)

    // construct update
    const update: any = {};

    if (comment) {
      update.comment = comment;
    }

    if (visitedAt) {
      update.visitedAt = new Date(visitedAt);
    }

    if (rating) {
      update.rating = rating;
    }

    if (reply) {
      update.reply = reply;
    }

    // find and update review record
    const review = await Review.findOneAndUpdate({ _id: reviewId }, update);

    res.locals.review = review;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default updateReview;
