"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var express = require('express');

var Category = require('../models/category');

var Product = require('../models/product');

var router = express.Router();

var mongoose = require('mongoose'); //add a product


router.post('/', function _callee(req, res, next) {
  var category, product;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Category.findById(req.body.category).then(function (category) {
            if (!category) {
              return res.status(500).send('invalid category ');
            }
          })["catch"](function (err) {
            res.status(500).json({
              error: err
            });
          }));

        case 2:
          category = _context.sent;
          product = new Product({
            name: req.body.name,
            description: req.body.description,
            ricDescription: req.body.ricDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
          });

          _readOnlyError("product");

          _context.next = 7;
          return regeneratorRuntime.awrap(product.save().then(function (product) {
            if (!product) {
              return res.status(500).send('product cannot be added');
            } else {
              return res.send(product);
            }
          })["catch"](function (err) {
            res.status(500).json({
              error: err
            });
          }));

        case 7:
          product = _context.sent;

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}); //get all products

router.get('/', function _callee2(req, res) {
  var productList;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Product.find().populate('category'));

        case 2:
          productList = _context2.sent;

          if (!productList) {
            res.status(500).json({
              success: false
            });
          } else {
            res.status(200).json({
              message: 'products fetched succesfully',
              products: productList
            });
          }

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //get product by id

router.get('/:id', function _callee3(req, res) {
  var productList;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Product.findById(req.params.id).populate('category'));

        case 2:
          productList = _context3.sent;

          if (!productList) {
            res.status(500).json({
              success: false
            });
          } else {
            res.status(200).json({
              message: 'products fetched succesfully',
              products: productList
            });
          }

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}); //updating product

router.put('/:id', function _callee4(req, res) {
  var category, product;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (mongoose.isValidObjectId(req.params.id)) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return", res.status(500).send('invalid productId '));

        case 2:
          _context4.next = 4;
          return regeneratorRuntime.awrap(Category.findById(req.body.category).then(function (category) {
            if (!category) {
              return res.status(500).send('invalid category ');
            }
          })["catch"](function (err) {
            res.status(500).json({
              error: err
            });
          }));

        case 4:
          category = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            ricDescription: req.body.ricDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
          }, {
            "new": true
          }).then(function (product) {
            if (product) {
              return res.status(200).json({
                success: true,
                message: 'the product updated',
                product: product
              });
            } else {
              return res.status(404).json({
                success: false,
                message: 'the product not updated'
              });
            }
          })["catch"](function (err) {
            res.status(500).json({
              error: err
            });
          }));

        case 7:
          product = _context4.sent;

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
}); //delete a product

router["delete"]('/:id', function (req, res) {
  Product.findByIdAndRemove(req.params.id).then(function (product) {
    if (product) {
      return res.status(200).json({
        success: true,
        message: 'the product removed'
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'the product not removed'
      });
    }
  })["catch"](function (err) {
    return res.status(400).json({
      success: false,
      error: err
    });
  });
});
router.get('/get/count', function _callee5(req, res) {
  var productCount;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Product.countDocuments(function (count) {
            return count;
          }));

        case 2:
          productCount = _context5.sent;

          if (!productCount) {
            res.status(500).json({
              success: false
            });
          } else {
            res.send({
              count: productCount
            });
          }

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
});
router.get('/', function _callee6(req, res) {
  var filter, productList;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          filter = {};

          if (req.query.category) {
            filter = {
              category: req.query.category.split(',')
            };
          }

          console.log('filter:' + filter);
          _context6.next = 5;
          return regeneratorRuntime.awrap(Product.find(filter).populate('category'));

        case 5:
          productList = _context6.sent;

          if (!productList) {
            res.status(500).json({
              success: false
            });
          } else {
            res.send({
              prodocts: productList
            });
          }

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
});
module.exports = router;