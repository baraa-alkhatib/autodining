import { RequestHandler } from 'express';
import { User } from '../db/models';
import { UserModel } from '../db/models/user.mongodb.model';
import createError from '../utils/error.utils';
import { Validator } from '../utils/validator.utils';

const signup: RequestHandler = async (req, res, next) => {
  try {
    // extract necessary fields
    const { email, type, name, password, ADMIN_CREATE_ACCESS_TOKEN } = req.body;

    const { newPassword } = password;
    // validate inputs
    if (
      !Validator.isValidUserName(name) ||
      !Validator.isEmail(email) ||
      !Validator.isStrongPassword(newPassword) ||
      (type !== 'owner' && type !== 'regular' && type !== 'admin')
    ) {
      throw createError(new Error('Invalid request body'), {
        client: 'Invalid request body',
        statusCode: 404,
      });
    }

    if (type === 'admin') {
      // check for access token
      if (ADMIN_CREATE_ACCESS_TOKEN !== process.env.ADMIN_CREATE_ACCESS_TOKEN) {
        throw createError(new Error('Invalid request body'), {
          client: 'Invalid request body',
          statusCode: 404,
        });
      }
    }

    const user = await User.findOne({ email: email.trim() });

    if (user) {
      // if user is present throw error 403 (forbidden)
      throw createError(new Error('User already exists'), {
        client: 'already exists',
        statusCode: 403,
      });
    }

    // create a new user record
    const newUser = new User(<UserModel>{
      name,
      email,
      type,
    });

    /**
     * - Function register() is made available by passport-local-mongoose.
     * - This function will take care of hash and salt.
     */
    await (<any>User).register(newUser, newPassword.trim());

    // TODO: send email verification message

    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

export default signup;
