"use strict";

var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  richDescription: {
    type: String,
    "default": 'richDescription'
  },
  image: {
    type: String,
    "default": ''
  },
  images: [{
    type: String
  }],
  brand: {
    type: String
  },
  price: {
    type: Number,
    "default": 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'Categories',
    required: true
  },
  countInStock: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  rating: {
    type: Number,
    "default": 0
  },
  isFeatured: {
    type: Boolean,
    "default": false
  },
  numReviews: {
    type: Number
  },
  dateCreated: {
    type: Date,
    "default": Date.now
  }
});
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
productSchema.set('toJSON', {
  virtuals: true
});
module.exports = mongoose.model('Products', productSchema);