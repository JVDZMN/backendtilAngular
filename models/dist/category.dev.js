"use strict";

var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  color: {
    type: String
  }
});
categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});
categorySchema.set('toJSON', {
  virtual: true
});
module.exports = mongoose.model('Categories', categorySchema);