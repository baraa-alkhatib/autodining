import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { UserModel } from '../db/models/user.mongodb.model';
import { IUser } from '../models/user.model';
import createError from '../utils/error.utils';

const login: RequestHandler = async (req, res, next) => {
  try {
    // extract necessary fields
    const { email, password } = req.body;

    // validate inputs
    if (!email || !password) {
      throw createError(new Error('Wrong request params'), {
        client: 'Something went wrong!',
        statusCode: 400,
      });
    }

    // authenticate with passport
    passport.authenticate('local', { session: false }, (err, user: UserModel) => {
      try {
        if (err) {
          throw createError(err, {
            client: 'Something went wrong!',
            statusCode: 400,
          });
        }

        if (!user) {
          throw createError(new Error('No such user'), {
            client: 'No such user!',
            statusCode: 404,
          });
        }

        return req.login(user, { session: false }, (error) => {
          try {
            if (error) {
              throw createError(error, {
                client: 'Something went wrong!',
                statusCode: 500,
              });
            }
            // generate a signed json web token with the contents of user object and return it in the response
            const token = jwt.sign(
              { id: user.id, email: user.email },
              <string>process.env.JWT_SECRET,
              {
                expiresIn: process.env.LOGIN_TOKEN_EXPIRES_IN || '2 days',
              }
            );
            return res.json({
              user: <IUser>{
                _id: user._id,
                email: user.email,
                name: user.name,
                imageUrl: user.imageUrl,
                type: user.type,
              },
              token,
            });
          } catch (e) {
            return next(e);
          }
        });
      } catch (error) {
        return next(error);
      }
    })(req, res);
  } catch (err) {
    next(err);
  }
};

export default login;
