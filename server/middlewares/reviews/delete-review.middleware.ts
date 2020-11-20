import { Handler } from 'express';
import Review from '../../db/models/review.mongodb.model';

const deleteReview: Handler = async (req, res, next) => {
  try {
    const reviewId = req.params.id;

    const { deleteReply } = req.query;

    if (Number(deleteReply) === 1) {
      // remove only reply
      await Review.updateOne({ _id: reviewId }, { $unset: { reply: 1 } }, { multi: true });
    } else {
      // delete review
      await Review.deleteOne({
        _id: reviewId,
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default deleteReview;
