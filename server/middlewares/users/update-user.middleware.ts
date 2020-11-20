import { Handler } from 'express';
import { User } from '../../db/models';
import { UserModel } from '../../db/models/user.mongodb.model';
import createError from '../../utils/error.utils';
import { Validator } from '../../utils/validator.utils';

const updateUser: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const userType = (<UserModel>req.user).type;

    const reqUserId = (<UserModel>req.user)._id;

    const userId = req.params.id;

    const { name, email, password, imageUrl }: UserModel = req.body;

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
      (email && !Validator.isValidUserName(email)) ||
      (password && !Validator.isStrongPassword(password))
    ) {
      throw createError(new Error('Invalid request body'), {
        client: 'Invalid request body',
        statusCode: 404,
      });
    }

    // construct update
    const update: any = {};

    if (name) {
      update.name = name;
    }

    if (email) {
      update.email = email;
    }

    if (password) {
      update.password = password;
    }

    if (imageUrl) {
      update.imageUrl = imageUrl;
    }

    // find and update user record
    const user = await User.findByIdAndUpdate(userId, update);

    res.locals.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default updateUser;
