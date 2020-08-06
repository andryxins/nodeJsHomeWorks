const { Schema, model, set } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// next line fix this problem https://github.com/Automattic/mongoose/issues/6890
set('useCreateIndex', true);

const contact = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: value => value.includes('@'),
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: {
    type: String,
    default: '',
  },
});

contact.plugin(mongoosePaginate);

module.exports = model('contact', contact);
