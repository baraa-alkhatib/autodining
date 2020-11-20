import { Handler } from 'express';
import * as passport from 'passport';
import createError from '../utils/error.utils';

/**
 * Permits only logged in users to carry on to the next middleware
 * If the user is logged out, it throws error 403 (forbidden)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const onlyLoggedIn: Handler = (req, res, next) => {
  // if user is authenticated in the session, carry on
  passport.authenticate('jwt', { session: false }, (err, user) => {
    try {
      if (err) {
        throw createError(err, { client: 'Something went wrong!', statusCode: 400 });
      }

      if (!user) {
        // if they are logged in throw error 403 (forbidden)
        throw createError(err, {
          client: 'You do not have the necessary permissions!',
          statusCode: 403,
        });
      }

      // carry on
      return next();
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

export default onlyLoggedIn;
