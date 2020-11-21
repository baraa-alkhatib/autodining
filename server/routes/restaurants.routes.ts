import * as express from 'express';
import upload from '../config/multer.config';
import disallowUserAdmin from '../middlewares/disallow-user-admin.middleware';
import disallowUserRegular from '../middlewares/disallow-user-regular.middleware';
import createRestaurant from '../middlewares/restaurants/create-restaurant.middleware';
import deleteRestaurant from '../middlewares/restaurants/delete-restaurant.middleware';
import getRestaurant from '../middlewares/restaurants/get-restaurant.middleware';
import getRestaurants from '../middlewares/restaurants/get-restaurants.middleware';
import updateRestaurant from '../middlewares/restaurants/update-restaurant.middleware';

const router = express.Router();

// get restaurants
router.get('/', getRestaurants, (req, res) => {
  res.status(200).json({ restaurants: res.locals.restaurants });
});

// get restaurant by id
router.get('/:id', getRestaurant, (req, res) => {
  res.status(200).json({ restaurant: res.locals.restaurant });
});

// create restaurant
router.post(
  '',
  disallowUserAdmin,
  disallowUserRegular,
  upload('image'),
  createRestaurant,
  (req, res) => {
    res.status(200).json({ newImageUrl: res.locals.imageUrl });
  }
);

// update restaurant
router.put('/:id', disallowUserRegular, upload('image'), updateRestaurant, (req, res) => {
  res.status(200).json({ restaurant: res.locals.restaurant });
});

// delete restaurant
router.delete('/:id', disallowUserRegular, deleteRestaurant, (req, res) => {
  res.status(200).end();
});

export default router;
