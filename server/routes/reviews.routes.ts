import * as express from 'express';
import disallowUserAdmin from '../middlewares/disallow-user-admin.middleware';
import disallowUserOwner from '../middlewares/disallow-user-owner.middleware';
import disallowUserRegular from '../middlewares/disallow-user-regular.middleware';
import createReview from '../middlewares/reviews/create-review.middleware';
import deleteReview from '../middlewares/reviews/delete-review.middleware';
import getReview from '../middlewares/reviews/get-review.middleware';
import getReviews from '../middlewares/reviews/get-reviews.middleware';
import updateReview from '../middlewares/reviews/update-review.middleware';

const router = express.Router({ mergeParams: true });

// get reviews
router.get('/', getReviews, (req, res) => {
  res.status(200).json({
    reviews: res.locals.reviews,
    maxReview: res.locals.maxReview,
    minReview: res.locals.minReview,
    awaitingResponseCount: res.locals.awaitingResponseCount,
  });
});

// get review
router.get('/:id', disallowUserOwner, disallowUserRegular, getReview, (req, res) => {
  res.status(200).json({ review: res.locals.reviews });
});

// create review
router.post('/', disallowUserAdmin, disallowUserOwner, createReview, (req, res) => {
  res.status(200).json({ review: res.locals.review });
});

// update review/reply
router.put('/:id', disallowUserRegular, updateReview, (req, res) => {
  res.status(200).json({ review: res.locals.review });
});

// delete review/reply
router.delete('/:id', disallowUserOwner, disallowUserRegular, deleteReview, (req, res) => {
  res.status(200).end();
});

export default router;
