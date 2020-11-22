import { Handler } from 'express';
import Restaurant from '../../db/models/restaurant.mongodb.model';
import { UserModel } from '../../db/models/user.mongodb.model';
import createError from '../../utils/error.utils';

const updateRestaurant: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const userType = (<UserModel>req.user).type;

    const reqUserId = (<UserModel>req.user).id;

    const restaurantId = req.params.id;

    const { name, description, address, status } = req.body;

    const imageUrl: string = req.file?.filename;

    // validate inputs
    if (status && status !== 'open' && status !== 'closed') {
      throw createError(new Error('Invalid request body'), {
        client: 'Invalid request body',
        statusCode: 404,
      });
    }

    // construct update
    const update: any = {};

    if (name) {
      update.name = name;
    }

    if (description) {
      update.description = description;
    }

    if (address) {
      update.address = address;
    }

    if (imageUrl) {
      update.imageUrl = imageUrl;
    }

    if (status) {
      update.status = status;
    }

    // find and update restaurant record
    const restaurant = await Restaurant.findOneAndUpdate(
      // make sure that only the admin or the owner of the restaurant is updating the record
      { _id: restaurantId, user: userType === 'admin' ? { $exists: true } : reqUserId },
      update
    );

    res.locals.restaurant = restaurant;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default updateRestaurant;
