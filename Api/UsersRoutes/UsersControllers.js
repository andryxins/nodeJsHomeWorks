const Joi = require('@hapi/joi');
const Users = require('../../Model/Users');

class UsersController {
  getCurrentUser = async (req, res, next) => {
    return res
      .status(200)
      .json({ email: req.user.email, subscription: req.user.subscription });
  };

  updateSubscription = async (req, res, next) => {
    await Users.updateOne({ _id: req.user._id }, { ...req.body });

    return res.sendStatus(200);
  };

  validateUpdateSubscription = async (req, res, next) => {
    try {
      const schema = Joi.object({
        subscription: Joi.string().required(),
      });

      await schema.validateAsync(req.body);

      if (
        req.body.subscription !== 'free' &&
        req.body.subscription !== 'pro' &&
        req.body.subscription !== 'premium'
      ) {
        throw new Error('Wrong subscription');
      }

      return next();
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  };
}

module.exports = new UsersController();
