"use strict";

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
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
    type: String,
    required: true
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
  virtual: true
});
module.exports = mongoose.model('Users', userSchema);