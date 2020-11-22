import * as mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
      required: true,
    },
  },
  { timestamps: true }
);

export interface RestaurantModel extends mongoose.Document {
  user: any;
  name: string;
  description: string;
  address: string;
  imageUrl: string;
  status: 'open' | 'closed';
  createdAt?: Date;
  updatedAt?: Date;
}

// make sure the same user cannot have more than one restaurnat with the same name
restaurantSchema.index({ user: 1, name: 1 }, { unique: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
