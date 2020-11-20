import { Handler } from 'express';
import * as passport from 'passport';
import createError from '../utils/error.utils';

/**
 * Permits only logged out users to carry on to the next middleware
 * If the user is logged in, it throws error 403 (forbidden)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const onlyLoggedOut: Handler = (req, res, next) => {
  // if user is not authenticated in the session, carry on
  passport.authenticate('jwt', { session: false }, (err, user) => {
    try {
      if (err) {
        throw createError(err, { client: 'Something went wrong!', statusCode: 400 });
      }

      if (!user) {
        // carry on
        return next();
      }

      // if they are logged in throw error 403 (forbidden)
      throw createError(err, { client: 'you are already logged in!', statusCode: 403 });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

export default onlyLoggedOut;
