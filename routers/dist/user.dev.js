"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var express = require('express');

var User = require('../models/user');

var router = express.Router();

var mongoose = require('mongoose');

var bcryptjs = require('bcryptjs');

var jwt = require('jsonwebtoken'); //add new user
//http://localhost:3000/api/users/register POST


router.post('/', function _callee(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(req.body);
          user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            token: req.body.token,
            email: req.body.email,
            passwordHash: bcryptjs.hashSync(req.body.password, 10),
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin
          });
          User.findOne({
            email: req.body.email
          }).then(function (user) {
            return res.status(400).send('The user is allready exists');
          })["catch"](function (err) {
            return res.status(500).send({
              error: err
            });
          });

          _readOnlyError("user");

          _context.next = 6;
          return regeneratorRuntime.awrap(user.save().then(function (resUser) {
            if (!resUser) {
              return res.status(500).send('user cannot be added');
            } else {
              return res.status(200).send({
                user: resUser
              });
            }
          })["catch"](function (err) {
            res.status(500).json({
              error: err
            });
          }));

        case 6:
          user = _context.sent;

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}); //get all users
//http://localhost:3000/api/users GET

router.get('/', function _callee2(req, res) {
  var userList;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.find().select('-passwordHash'));

        case 2:
          userList = _context2.sent;

          if (!userList) {
            res.status(500).json({
              success: false
            });
          } else {
            res.status(200).json({
              message: 'users fetched succesfully',
              users: userList
            });
          }

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //get User by id 
//http://localhost:3000/api/users/id GET

router.get('/:id', function _callee3(req, res) {
  var userById;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 2:
          userById = _context3.sent;

          if (!userById) {
            res.status(500).json({
              success: false,
              message: 'not user with this id'
            });
          } else {
            res.status(200).json({
              message: 'products fetched succesfully',
              user: userById
            });
          }

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}); //delete a user 
//http://localhost:3000/api/users DELETE

router["delete"]('/:id', function (req, res) {
  User.findByIdAndRemove(req.params.id).then(function (user) {
    if (user) {
      return res.status(200).json({
        success: true,
        message: 'the user removed'
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'the user not removed'
      });
    }
  })["catch"](function (err) {
    return res.status(400).json({
      success: false,
      error: err
    });
  });
}); //LOGIN
// http://localhost:3000/api/users/login POST

router.post('/login', function _callee4(req, res) {
  var user, secret, token;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context4.sent;
          secret = process.env.SECRET;

          if (user) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(200).send({
            message: 'The user not found'
          }));

        case 6:
          if (user && bcryptjs.compareSync(req.body.password, user.passwordHash)) {
            token = jwt.sign({
              userId: user.id,
              isAdmin: user.isAdmin
            }, secret, {
              algorithm: 'HS256'
            }, {
              expiresIn: '1d'
            });
            res.status(200).send({
              message: 'token',
              user: user.email,
              token: token
            });
          } else {
            res.status(200).send({
              message: 'pass is wrong'
            });
          }

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
});
module.exports = router;