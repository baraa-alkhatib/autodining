// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
};

/**
 * App router main paths
 */
export const ROUTER_MAIN_PATHS = {
  HOME: 'home',
  login: 'login',
  signup: 'signup',
  users: 'users',
  restaurants: 'restaurants',
  reviews: 'reviews',
};

/*
 * API end points
 */
export const API = {
  signup: '/auth/signup',
  login: '/auth/login',

  // users
  getUsers: '/api/users',
  getUser: '/api/users/:userId',
  updateUser: '/api/users/:userId',
  deleteUser: '/api/users/:userId',

  // restaurants
  getRestaurants: '/api/restaurants',
  getRestaurant: '/api/restaurants/:restaurantId',
  createRestaurant: '/api/restaurants',
  updateRestaurant: '/api/restaurants/:restaurantId',
  deleteRestaurant: '/api/restaurants/:restaurantId',

  // reviews
  getReviews: '/api/reviews',
  getReview: '/api/reviews/:reviewId',
  createReview: '/api/reviews',
  updateReview: '/api/reviews/:reviewId',
  deleteReview: '/api/reviews/:reviewId',
};

/**
 * Storage Tokens
 */

export const ACCESS_TOKEN_KEY = 'access_token';

export const USER_INFO_KEY = 'user_info';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
