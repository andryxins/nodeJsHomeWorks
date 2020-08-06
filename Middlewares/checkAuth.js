const jwt = require('jsonwebtoken');
const Users = require('../Model/Users');

function authError(res) {
  return res.status(401).json({ message: 'Not authorized' });
}

module.exports = async (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');

    if (!authorizationHeader) {
      return authError(res);
    }
    const token = authorizationHeader.replace('Bearer ', '');

    let userId;
    try {
      userId = jwt.verify(token, process.env.SECRET_KEY_JWT).id;
    } catch (err) {
      return authError(res);
    }

    const user = await Users.findOne({ _id: userId });

    if (!user) {
      return authError(res);
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
