const { Router } = require('express');
const usersRoutes = Router();
const multer = require('multer');
const upload = multer({ dest: 'tmp/', limits: { fileSize: 2000000 } });
const checkAuth = require('../../Middlewares/checkAuth');
const UsersController = require('./UsersControllers');

usersRoutes.get('/current', checkAuth, UsersController.getCurrentUser);

usersRoutes.patch(
  '/',
  checkAuth,
  UsersController.validateUpdateSubscription,
  UsersController.updateSubscription,
);

usersRoutes.patch(
  '/avatar',
  checkAuth,
  upload.single('avatar'),
  UsersController.updateUserAvatar,
);

module.exports = usersRoutes;
