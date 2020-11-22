import { Handler } from 'express';
import Restaurant, { RestaurantModel } from '../../db/models/restaurant.mongodb.model';
import { UserModel } from '../../db/models/user.mongodb.model';
import createError from '../../utils/error.utils';

const createRestaurant: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const reqUserId = (<UserModel>req.user).id;

    const { name, description, address, status } = req.body;

    const imageUrl: string = req.file?.filename;

    // validate inputs
    if (!description || !address || (status !== 'open' && status !== 'closed')) {
      throw createError(new Error('Invalid request body'), {
        client: 'Invalid request body',
        statusCode: 404,
      });
    }

    // create a new restaurant record
    const restaurant = new Restaurant(<RestaurantModel>{
      user: reqUserId,
      name,
      description,
      address,
      imageUrl,
      status,
    });

    // save new record
    await restaurant.save();

    res.locals.restaurant = restaurant;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default createRestaurant;
