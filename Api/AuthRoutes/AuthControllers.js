const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../../Model/Users');

class AuthController {
  constructor() {
    this.saltRounds = 10;
  }

  createNewUser = async (req, res, next) => {
    try {
      const { password } = req.body;

      const passwordHash = await bcrypt.hash(password, this.saltRounds);

      const createdUser = await Users.create({
        ...req.body,
        password: passwordHash,
      });

      return res.status(201).json({
        user: {
          email: createdUser.email,
          subscription: createdUser.subscription,
        },
      });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email: email });
      if (!user) return this.unathorizedError(res);

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return this.unathorizedError(res);
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET_KEY_JWT,
        { expiresIn: '1h' },
      );

      await Users.updateOne({ _id: user._id }, { token: token });

      return res.status(200).json({
        token: `Bearer ${token}`,
        user: { email: user.email, subscription: user.subscription },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };

  logout = async (req, res, next) => {
    await Users.updateOne({ _id: req.user._id }, { token: '' });

    return res.sendStatus(204);
  };

  checkIsEmailUnique = async (req, res, next) => {
    try {
      const candidateEmail = await Users.findOne({ email: req.body.email });

      if (candidateEmail) {
        res.status(409).json({ message: 'Email in use' });
      } else {
        next();
      }
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  };

  validateLoginFields = async (req, res, next) => {
    try {
      const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      });

      await schema.validateAsync(req.body);

      next();
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  };

  validateRegisterFields = async (req, res, next) => {
    try {
      const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        subscription: Joi.string(),
      });

      await schema.validateAsync(req.body);

      next();
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  };

  unathorizedError = res => {
    return res.status(401).json({ message: 'Email or password is wrong' });
  };
}

module.exports = new AuthController();
