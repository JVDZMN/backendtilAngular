const express = require('express');
require('dotenv').config()
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs');


const authJwt = require('./helper/jwt')
const errorHandler = require('./helper/error-handler')

app.use(cors())
app.options('*',cors())

//To handle HTTP POST requests(middlewares)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan('tiny'))
//app.use(authJwt())
app.use(errorHandler)

//models
const Post = require('./models/post');
const Product = require('./models/product')
const Category = require('./models/category')
const User = require('./models/user')

//routers
const productsRouter=require('./routers/product')
const categoryRouter = require('./routers/category')
const userRouter = require('./routers/user')
const orderRouter = require('./routers/order')

//mongoDB connection string
const mongoDBuri = process.env.DB_URI

mongoose.connect(mongoDBuri, {useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err)
       console.error(err);
    else
       console.log("Connected to the mongodb"); 
  });

const api = process.env.API_URL
app.use(`${api}/products`,productsRouter)
app.use(`${api}/categories`, categoryRouter)
app.use(`${api}/users`,userRouter)
app.use(`${api}/orders`,orderRouter)

app.use((req,res,next)=>{
       // Website you wish to allow to connect
       res.setHeader('Access-Control-Allow-Origin', '*');

       // Request methods you wish to allow
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   
       // Request headers you wish to allow
       res.setHeader('Access-Control-Allow-Headers',  "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
})


const PORT = process.env.PORT
app.listen(PORT,(err)=>{
    if(err)console.log(err)
    else console.log(`server is liatening to ${PORT}`)
})
module.exports = app;