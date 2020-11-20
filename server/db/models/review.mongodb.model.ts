import * as mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    // only regular users are able to create reviews
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: false,
    },
    reply: { type: String, required: false },
    visitedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export interface ReviewModel extends mongoose.Document {
  user: any;
  restaurant: any;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  reply?: string;
  visitedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const Review = mongoose.model('Review', reviewSchema);

export default Review;
