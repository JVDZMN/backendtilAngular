"use strict";

var mongoose = require('mongoose');

var orderItemsSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'Products',
    required: true
  }
});
orderItemsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
module.exports = mongoose.model('orderItems', orderItemsSchema);