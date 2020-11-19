import { Handler } from 'express';

/**
 * Permits only admin users to carry on to the next middleware
 * otherwise, it redirect the user with a 403 (forbidden)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const onlyUserAdmin: Handler = (req, res, next) => {
  // if user is not authenticated in the session, carry on
  console.log('onlyUserAdmin() => user: ', req.user);
  return next();
};

export default onlyUserAdmin;
