export const environment = {
  production: true,
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
