"use strict";

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  birthday: {
    type: Date
  },
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  street: {
    type: String,
    "default": ''
  },
  apartment: {
    type: String
  },
  zip: {
    type: String
  },
  city: {
    type: String,
    "default": ''
  },
  country: {
    type: String
  },
  phone: {
    type: String
  },
  token: {
    type: String,
    "default": ''
  },
  isAdmin: {
    type: Boolean,
    "default": false
  }
});
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
userSchema.set('toJSON', {
  virtuals: true
});
module.exports = mongoose.model('Users', userSchema);