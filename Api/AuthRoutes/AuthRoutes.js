const { Router } = require('express');
const authRoutes = Router();
const checkAuth = require('../../Middlewares/checkAuth');
const AuthController = require('./AuthControllers');

authRoutes.post(
  '/register',
  AuthController.validateRegisterFields,
  AuthController.checkIsEmailUnique,
  AuthController.createNewUser,
);

authRoutes.post(
  '/login',
  AuthController.validateLoginFields,
  AuthController.loginUser,
);

authRoutes.post('/logout', checkAuth, AuthController.logout);

module.exports = authRoutes;
