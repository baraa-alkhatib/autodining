import * as mongoose from 'mongoose';
import * as passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ['owner', 'regular'],
      required: true,
    },
  },
  { timestamps: true }
);

export interface UserModel extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  type: 'owner' | 'regular';
  createdAt?: any;
  updatedAt?: any;
}

// plugin local-mongoose, use email instead of username
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);

export default User;
