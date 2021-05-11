"use strict";

var express = require('express');

var fs = require('fs');

var Category = require('../models/category');

var Product = require('../models/product');

var router = express.Router();

var mongoose = require('mongoose');

var multer = require('multer');

var path = require('path');

var fileTypes = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

var fileFilter = function fileFilter(req, file, cb) {
  var isValid = fileTypes[file.mimetype];

  if (isValid) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function filename(req, file, cb) {
    var filename = file.originalname.split(' ').join('-');
    var extension = fileTypes[file.mimetype];
    var now = Date.now().toString();
    cb(null, "".concat(filename, "-").concat(now.replace(/:/g, '-'), ".").concat(extension));
  }
});
var upload = multer({
  storage: storage,
  fileFilter: fileFilter
}); //add a product

router.post('/', upload.single('image'), function _callee(req, res, next) {
  var filename, originalPath, category, proAdded;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.file) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", res.status(400).send('insert an image for product'));

        case 2:
          //make a path for public path for image from root
          filename = req.file.filename;
          originalPath = "".concat(req.protocol, "://").concat(req.get('host'), "/uploads");
          console.log("req.file : ");
          console.log(req.file);
          _context.next = 8;
          return regeneratorRuntime.awrap(Category.findById(req.body.category).then(function (category) {
            if (!category) {
              return res.status(500).json({
                msg: 'invalid category '
              });
            }
          })["catch"](function (err) {
            console.log(err);
          }));

        case 8:
          category = _context.sent;
          proAdded = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: "".concat(originalPath, "/").concat(filename),
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
          });
          proAdded.save().then(function (user) {
            res.status(201).json({
              message: 'product added sucessfully',
              email: user.email
            });
          })["catch"](function (err) {
            res.status(500).json({
              error: err,
              success: false
            });
            console.log(err);
          });

        case 11:
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
          console.log(" req : ");
          console.log(req.body);
          _context2.next = 4;
          return regeneratorRuntime.awrap(Product.find().populate('category'));

        case 4:
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

        case 6:
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

router.put('/:id', upload.single('image'), function _callee4(req, res) {
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
          return regeneratorRuntime.awrap(Product.findById(req.params.id));

        case 7:
          pro = _context4.sent;

          if (pro) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(400).send('not a valid product'));

        case 10:
          _context4.next = 12;
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

        case 12:
          product = _context4.sent;

        case 13:
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
router.put('/images-list/:id', upload.array('images', 7), function _callee7(req, res) {
  var originalPath, imgPaths, product;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (mongoose.isValidObjectId(req.params.id)) {
            _context7.next = 2;
            break;
          }

          return _context7.abrupt("return", res.status(500).send('invalid productId '));

        case 2:
          files = req.files;

          if (!files) {
            res.status(400).send('insert the images');
          }

          originalPath = "".concat(req.protocol, "://").concat(req.get('host'), "/uploads");
          imgPaths = [];
          files.map(function (file) {
            imgPaths.push("".concat(originalPath, "/").concat(file.filename));
          });
          _context7.next = 9;
          return regeneratorRuntime.awrap(Product.findOneAndUpdate(req.params.id, {
            images: imgPaths
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

        case 9:
          product = _context7.sent;

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  });
});
module.exports = router;