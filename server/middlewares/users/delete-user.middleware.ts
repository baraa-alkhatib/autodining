import { Handler } from 'express';
import { User } from '../../db/models';
import { UserModel } from '../../db/models/user.mongodb.model';
import createError from '../../utils/error.utils';

const deleteUser: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const userType = (<UserModel>req.user).type;

    const reqUserId = (<UserModel>req.user).id;

    const userId = req.params.id;

    // validate request
    if (userType !== 'admin' && reqUserId !== userId) {
      // if non-admin user is requesting on behalf of another user, throw error 403 (forbidden)
      throw createError(new Error('Non-admin user is requesting on behalf of another'), {
        client: 'You do not have the necessary permissions!',
        statusCode: 403,
      });
    }

    // delete user
    await User.deleteOne({ _id: userId });

    return next();
  } catch (error) {
    return next(error);
  }
};

export default deleteUser;
