const express = require('express')
const fs = require('fs')
const Category = require('../models/category')
const Product=require('../models/product')
const router=express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const path=require('path')

const fileTypes = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = fileTypes[file.mimetype]
        let uploadError = new Error('invalid image type')
        if(isValid){
            uploadError = null
        }
      cb(uploadError, path.join(__dirname, '/uploads/imgs/') )
    },
    filename: function (req, file, cb) {

      const filename = file.originalname.split(' ').join('-')  
      const extension = fileTypes[file.mimetype]
      const now = Date.now().toString()
      
      cb(null, `${filename}-${now.replace(/:/g, '-')}.${extension}`)
    }
})

const uploadOptions = multer({storage : storage})



//add a product
router.post('/',async(req,res,next)=>{
    const category = await Category.findById(req.body.category).then(category =>{
        if(!category){
            return res.status(500).send('invalid category ')
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
    //const fileName = req.file.filename
    //console.log(fileName)
    
    //const basePath = `${req.protocol}://${req.get('host')}/uploads/imgs/`
    //console.log(basePath)
    const product= new Product({
        name:req.body.name,
        description : req.body.description,
        ricDescription : req.body.ricDescription,
        image: req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured
    })
    product = await product.save().then(product =>{
        if(!product){
            return res.status(500).send('product cannot be added')
        }else {
            return res.send(product)
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
    
})
//get all products
router.get('/',async (req,res)=>{
        const productList= await Product.find().populate('category')
    if(!productList){
        res.status(500).json({success:false})
    }
    else{
        res.status(200).json({
            message:'products fetched succesfully',
            products:productList
        })
    }
});
//get product by id
router.get('/:id',async (req,res)=>{
    const productList= await Product.findById(req.params.id).populate('category')
    if(!productList){
        res.status(500).json({success:false})
    }
    else{
        res.status(200).json({
            message:'products fetched succesfully',
            products:productList
        })
    }
});
//updating product
router.put('/:id',async(req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(500).send('invalid productId ')
    }
    const category = await Category.findById(req.body.category).then(category =>{
        if(!category){
            return res.status(500).send('invalid category ')
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
    const product=await Product.findByIdAndUpdate(
        req.params.id,
        {
        name:req.body.name,
        description : req.body.description,
        ricDescription : req.body.ricDescription,
        image:req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured
        },{new:true})
    .then(product =>{
        if(product){
            return res.status(200).json({
                success: true,
                message:'the product updated',
                product:product
            })
        }else{
            return res.status(404).json({
                success:false,
                message:'the product not updated'
            })
        }
    }).catch(err =>{
        res.status(500).json({
            error: err
        })
    })
})

//delete a product
router.delete('/:id',(req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product){
            return res.status(200).json({
                success: true,
                message:'the product removed'
            })
        }else{
            return res.status(404).json({
                success:false,
                message:'the product not removed'
            })
        }
    }).catch(err =>{
        return res.status(400).json({
            success: false,
            error:err
        })
    })
})

router.get('/get/count',async (req,res)=>{
    const productCount= await Product.countDocuments((count)=>count)
    if(!productCount){
        res.status(500).json({success:false})
    }
    else{
        res.send({count:productCount})
    }
});

router.get('/',async (req,res)=>{
    let filter={}
    if(req.query.category){
         filter={category:req.query.category.split(',')}
    }
    console.log('filter:' + filter)
    const productList= await Product.find(filter).populate('category')
    if(!productList){
        res.status(500).json({success:false})
    }
    else{
        res.send({prodocts:productList})
    }
});
module.exports= router