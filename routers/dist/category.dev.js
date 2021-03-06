"use strict";

var Category = require('../models/category');

var express = require('express');

var router = express.Router();

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
}); //get all categories

router.get('/', function _callee(req, res) {
  var categoryList;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Category.find());

        case 2:
          categoryList = _context.sent;

          if (!categoryList) {
            res.status(500).json({
              success: false
            });
          } else {
            res.status(200).send(categoryList);
          }

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}); //get category by id

router.get('/:id', function _callee2(req, res) {
  var category;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Category.findById(req.params.id).then(function (category) {
            if (!category) {
              res.status(500).json({
                success: false,
                message: 'no category'
              });
            } else {
              res.status(200).send(category);
            }
          })["catch"](function (err) {
            res.status(500).json({
              success: false,
              error: err
            });
          }));

        case 2:
          category = _context2.sent;

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //create a category

router.post('/', upload.single('image'), function _callee3(req, res, next) {
  var filename, originalPath, categoryAdded;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          //make a path for public path for image from root
          filename = req.file.filename;
          originalPath = "".concat(req.protocol, "://").concat(req.get('host'), "/uploads");
          console.log("reg.body : ");
          console.log(req.body);
          categoryAdded = new Category({
            name: req.body.name,
            icon: "".concat(originalPath, "/").concat(filename),
            color: req.body.color
          });
          categoryAdded.save().then(function (cat) {
            console.log('added');
            res.status(201).json({
              message: 'category added sucessfully from res',
              success: true,
              category: cat
            });
          })["catch"](function (err) {
            res.status(500).json({
              error: err,
              success: false
            });
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}); //delete a category

router["delete"]('/:id', function (req, res) {
  Category.findByIdAndRemove(req.params.id).then(function (category) {
    if (category) {
      return res.status(200).json({
        success: true,
        message: 'the category removed'
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'the category not removed'
      });
    }
  })["catch"](function (err) {
    return res.status(400).json({
      success: false,
      error: err
    });
  });
}); //updating the category

router.put('/:id', function _callee4(req, res) {
  var category;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Category.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
          }, {
            "new": true
          }).then(function (category) {
            if (category) {
              return res.status(200).json({
                success: true,
                message: 'the category updated',
                category: category
              });
            } else {
              return res.status(404).json({
                success: false,
                message: 'the category not updated'
              });
            }
          })["catch"](function (err) {
            res.status(500).json({
              error: err
            });
          }));

        case 2:
          category = _context4.sent;

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
});
module.exports = router;