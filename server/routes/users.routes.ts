import * as express from 'express';
import upload from '../config/multer.config';
import disallowUserOwner from '../middlewares/disallow-user-owner.middleware';
import disallowUserRegular from '../middlewares/disallow-user-regular.middleware';
import deleteUser from '../middlewares/users/delete-user.middleware';
import getUser from '../middlewares/users/get-user.middleware';
import getUsers from '../middlewares/users/get-users.middleware';
import updateUser from '../middlewares/users/update-user.middleware';

const router = express.Router();

// get users
router.get('/', disallowUserOwner, disallowUserRegular, getUsers, (req, res) => {
  res.status(200).json({ users: res.locals.users });
});

// get user by id
router.get('/:id', getUser, (req, res) => {
  res.status(200).json({ user: res.locals.user });
});

// update user
router.put('/:id', updateUser, upload, (req, res) => {
  res.status(200).json({ user: res.locals.user });
});

// delete user
router.delete('/:id', deleteUser, (req, res) => {
  res.status(200).end();
});

export default router;
