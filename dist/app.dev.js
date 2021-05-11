"use strict";

var express = require('express');

var path = require('path');

require('dotenv').config();

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var morgan = require('morgan');

var cors = require('cors');

var fs = require('fs');

var authJwt = require('./helper/jwt');

var errorHandler = require('./helper/error-handler');

app.use(cors());
app.options('*', cors()); //To handle HTTP POST requests(middlewares)

app.use(bodyParser());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(morgan('tiny')); //app.use(authJwt())

app.use(errorHandler);
app.use("/uploads", express["static"](path.join(__dirname, "uploads"))); //models

var Post = require('./models/post');

var Product = require('./models/product');

var Category = require('./models/category');

var User = require('./models/user'); //routers


var productsRouter = require('./routers/product');

var categoryRouter = require('./routers/category');

var userRouter = require('./routers/user');

var orderRouter = require('./routers/order'); //mongoDB connection string


var mongoDBuri = process.env.DB_URI;
mongoose.connect(mongoDBuri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {
  if (err) console.error(err);else console.log("Connected to the mongodb");
});
var api = process.env.API_URL;
app.use("".concat(api, "/products"), productsRouter);
app.use("".concat(api, "/categories"), categoryRouter);
app.use("".concat(api, "/users"), userRouter);
app.use("".concat(api, "/orders"), orderRouter);
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*'); // Request methods you wish to allow

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Request headers you wish to allow

  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});
var PORT = process.env.PORT;
app.listen(PORT, function (err) {
  if (err) console.log(err);else console.log("server is liatening to ".concat(PORT));
});
module.exports = app;