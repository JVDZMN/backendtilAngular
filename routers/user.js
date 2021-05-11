const express = require('express')
const User = require('../models/user')
const router=express.Router()
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt =require('jsonwebtoken')

async function verifyUser(req, res, next) {
    
        User.findOne({email : req.body.email}).then(user =>{
            return res.status(400).send('The user is allready exists')
         }).catch(err=>{
            return res.status(500).send({error:err})
         })
         next()
}

//add new user
//http://localhost:3000/api/users/register POST
router.post('/',async(req,res,next)=>{
    console.log(req.body)


    const newUser= new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username:req.body.username,
        token:req.body.token,
        email:req.body.email, 
        passwordHash:bcryptjs.hashSync(req.body.passwordHash,10),
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country,
        phone:req.body.phone,
    })
    res =await User.findOne({email : req.body.email}).then(user =>{
        return res.status(400).send({msg : req.body.email + ' is allready exists'})
     }).catch(err=>{
        return res.status(400).send({error:err})
     }) 

     resUser = newUser.save((err, doc) => {
        if (err) return console.error(err);
       else console.log("user inserted succussfully!");
      })
        /* if(!resUser){
            return res.status(500).send('user cannot be added')
        }else {
            return res.status(200).send({user : resUser})
              }  */
})

//get all users
//http://localhost:3000/api/users GET
router.get('/',async (req,res)=>{
    const userList= await User.find().select('-passwordHash')
    if(!userList){
        res.status(500).json({success:false})
    }
    else{
        res.status(200).json({
            message:'users fetched succesfully',
            users:userList
        })
    }
});
//get User by id 
//http://localhost:3000/api/users/id GET
router.get('/:id',async (req,res)=>{
    const userById= await User.findById(req.params.id)
    if(!userById){
        res.status(500).json({success:false,message:'not user with this id'})
    }
    else{
        res.status(200).json({
            message:'products fetched succesfully',
            user:userById
        })
    }
});

//delete a user 
//http://localhost:3000/api/users DELETE
router.delete('/:id',(req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user){
            return res.status(200).json({
                success: true,
                message:'the user removed'
            })
        }else{
            return res.status(404).json({
                success:false,
                message:'the user not removed'
            })
        }
    }).catch(err =>{
        return res.status(400).json({
            success: false,
            error:err
        })
    })
})
//LOGIN
// http://localhost:3000/api/users/login POST
router.post('/login',async (req,res)=>{
   const user = await User.findOne({email : req.body.email})
   const secret = process.env.SECRET
   if(!user){
       return res.status(200).send({message:'The user not found'})
   }
   if(user && bcryptjs.compareSync(req.body.password,user.passwordHash)){

     const token = jwt.sign(
           {
               userId : user.id,
               isAdmin : user.isAdmin
           },secret,
           { algorithm: 'HS256'},
           {
               expiresIn:'1d'
           }
       )
       res.status(200).send({message:'token',user:user.email,token : token})
   } else{
       res.status(200).send({message:'pass is wrong'})
   }
})

module.exports= router