const { Router } = require('express');
const usersRoutes = Router();
const checkAuth = require('../../Middlewares/checkAuth');
const UsersController = require('./UsersControllers');

usersRoutes.get('/current', checkAuth, UsersController.getCurrentUser);

usersRoutes.patch(
  '/',
  checkAuth,
  UsersController.validateUpdateSubscription,
  UsersController.updateSubscription,
);

module.exports = usersRoutes;
