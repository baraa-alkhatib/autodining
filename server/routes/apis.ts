import * as express from 'express';
import restaurantsRoutes from './restaurants.routes';
import reviewsRoutes from './reviews.routes';
import usersRoutes from './users.routes';

// define epxress router obj
const router: express.Router = express.Router({ mergeParams: true });

router.use('/users', usersRoutes);

router.use('/restaurants', restaurantsRoutes);

router.use('/reviews', reviewsRoutes);

export default router;
