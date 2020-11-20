import { Handler } from 'express';
import { UserModel } from '../db/models/user.mongodb.model';
import createError from '../utils/error.utils';

/**
 * Prevents users (type=owner) from passing.
 * This middleware assumes the user is already authenticated.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const disallowUserOwner: Handler = (req, res, next) => {
  try {
    if ((<UserModel>req?.user).type === 'owner') {
      throw createError(new Error('Owner users are not permitted'), {
        client: 'You do not have the necessary permissions!',
        statusCode: 403,
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export default disallowUserOwner;
