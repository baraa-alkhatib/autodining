import { Handler } from 'express';
import { User } from '../../db/models';
import Restaurant from '../../db/models/restaurant.mongodb.model';
import createError from '../../utils/error.utils';

const getUsers: Handler = async (req, res, next) => {
  try {
    // extract necessary fields
    const { page, sortBy, order, search } = req.query;

    // validate inputs
    if (
      !page ||
      Number(page) < 0 ||
      !sortBy ||
      !['name', 'type', 'restaurantsCount', 'createdAt'].includes(<string>sortBy) ||
      !order ||
      (order !== 'asc' && order !== 'desc')
    ) {
      throw createError(new Error('Invalid request body'), {
        client: 'Invalid request body',
        statusCode: 404,
      });
    }

    // construct filter
    const filter: any = {};

    // construct sorting
    const sort: any = {};

    // search for like terms in name
    if (search) {
      filter.name = new RegExp(<string>search);
    }

    // change order string to the corresponding number so it works in aggregation

    const orderNumber = order === 'asc' ? 1 : -1;

    switch (sortBy) {
      case 'name': {
        sort.name = orderNumber;
        break;
      }
      case 'type': {
        sort.type = orderNumber;
        break;
      }
      case 'restaurantsCount': {
        sort.restaurantsCount = orderNumber;
        break;
      }
      case 'createdAt':
      default: {
        sort.createdAt = orderNumber;
      }
    }

    // get total number of users
    const usersCount = await User.countDocuments();

    const users = await User.aggregate([
      // match users with filter
      { $match: filter },
      // get restaurants number
      {
        $lookup: {
          // restaurants count can be calculated from restaurants collection
          from: Restaurant.collection.name,
          let: { user: '$_id' },
          pipeline: [
            // match restaurants connected to the same user id
            {
              $match: {
                $expr: { $eq: ['$user', '$$user'] },
              },
            },
            // group restaurants and get restaurants count
            {
              $group: {
                _id: '$user',
                count: { $sum: 1 },
              },
            },
          ],
          // return restaurants array
          as: 'restaurants',
        },
      },
      // unwind restaurants array in order to sort by restaurants number if requested
      {
        $unwind: { path: '$restaurants', preserveNullAndEmptyArrays: true },
      },
      // CAUTION: return the necessary fields using project operator, otherwise the salt and password hash will be returned!!!
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          type: 1,
          imageUrl: 1,
          createdAt: 1,
          restaurantsCount: '$restaurants.count',
        },
      },
      // use the custom sort object to sort the resulting users array
      { $sort: sort },
      // skip the current number of pages times the default limit (30)
      {
        $skip: Number(page) * 30,
      },
      // limit the number of returning documents to 30
      {
        $limit: 30,
      },
    ]);

    res.locals.users = users;

    // attach total users count
    res.locals.usersCount = usersCount;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default getUsers;
