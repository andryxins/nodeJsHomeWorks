const fs = require('fs').promises;
const path = require('path');
const Joi = require('@hapi/joi');
const jimp = require('jimp');
const Users = require('../../Model/Users');
const createAvatarUrl = require('../../lib/createAvatarUrl');

const IMAGE_DIR = path.join(__dirname, '../../', 'public', 'images');

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

  updateUserAvatar = async (req, res, next) => {
    try {
      if (req.file) {
        const pathFile = req.file.path;
        const fileExt = path.extname(req.file.originalname);

        await jimp.read(pathFile).then(img => {
          return img
            .autocrop()
            .cover(
              250,
              250,
              jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE,
            )
            .writeAsync(pathFile);
        });

        await fs.unlink(
          path.join(IMAGE_DIR, path.basename(req.user.avatarURL)),
        );

        const newAvatarName = `${req.user.email}${fileExt}`;

        await fs.rename(pathFile, path.join(IMAGE_DIR, newAvatarName));

        const updatedUser = await Users.findOneAndUpdate(
          { _id: req.user._id },
          { avatarURL: createAvatarUrl(newAvatarName) },
          { new: true },
        );

        return res.status(200).json({ avatarURL: updatedUser.avatarURL });
      } else {
        return res.status(400).json({ message: 'file type is not supported' });
      }
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
}

module.exports = new UsersController();
