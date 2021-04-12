"use strict";

var expressJwt = require("express-jwt");

function authJwt() {
  secret = "Javad,Asim og Anthon";
  return expressJwt({
    secret: secret,
    algorithms: ['HS256']
  }).unless({
    path: [{
      url: 'http://localhost:3000/api/products',
      methods: ['GET', 'OPTIONS']
    }]
  });
}

module.exports = authJwt;