const { Schema, model, set } = require('mongoose');

// next line fix this problem https://github.com/Automattic/mongoose/issues/6890
set('useCreateIndex', true);

const user = new Schema({
  email: String,
  password: String,
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: String,
});

module.exports = model('user', user);
