import { Handler } from 'express';
import { User } from '../../db/models';
import { UserModel } from '../../db/models/user.mongodb.model';
import createError from '../../utils/error.utils';
import { Validator } from '../../utils/validator.utils';

const updateUser: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const userType = (<UserModel>req.user).type;

    const reqUserId = (<UserModel>req.user).id;

    const userId = req.params.id;

    const { name, email, password }: UserModel = req.body;

    const imageUrl: string = req.file?.filename;

    // validate request
    if (userType !== 'admin' && reqUserId !== userId) {
      // if non-admin user is requesting on behalf of another user, throw error 403 (forbidden)
      throw createError(new Error('Non-admin user is requesting on behalf of another'), {
        client: 'You do not have the necessary permissions!',
        statusCode: 403,
      });
    }

    // validate inputs
    if (
      (name && !Validator.isValidUserName(name)) ||
      (email && !Validator.isEmail(email)) ||
      (password && !Validator.isStrongPassword(password))
    ) {
      throw createError(new Error('Invalid request body'), {
        client: 'Invalid request body',
        statusCode: 404,
      });
    }

    // find user record
    const user = <UserModel>await User.findById(userId);

    // set the required changes on the found record
    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (imageUrl) {
      user.imageUrl = imageUrl;
    }

    if (password) {
      /**
       * - Function setPassword() is made available by passport-local-mongoose.
       * - This function will take care of hash and salt.
       * - This function updates the password field but does not save the document.
       */
      await (<any>user).setPassword(password);
    }

    // commit changes
    try {
      await user.save();
    } catch (err) {
      if (err?.code === 11000) {
        throw createError(err, {
          client: 'this email is already registered with another account.',
          statusCode: 403,
        });
      }
    }

    res.locals.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default updateUser;
