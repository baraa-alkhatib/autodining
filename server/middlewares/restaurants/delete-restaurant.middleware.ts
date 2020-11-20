import { Handler } from 'express';
import Restaurant from '../../db/models/restaurant.mongodb.model';
import { UserModel } from '../../db/models/user.mongodb.model';

const deleteRestaurant: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const userType = (<UserModel>req.user).type;

    const reqUserId = (<UserModel>req.user)._id;

    const restaurantId = req.params.id;

    // delete restaurant
    await Restaurant.deleteOne({
      _id: restaurantId,
      // make sure that only the admin or the owner of the restaurant is deleting the record
      user: { _id: restaurantId, user: userType === 'admin' ? { $exists: true } : reqUserId },
    });

    return next();
  } catch (error) {
    return next(error);
  }
};

export default deleteRestaurant;
