import { Handler } from 'express';
import { User } from '../../db/models';

const getUsers: Handler = async (req, res, next) => {
  try {
    const users = await User.find();

    res.locals.users = users;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default getUsers;
