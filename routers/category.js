const Category = require('../models/category')
const express = require('express')
const router = express.Router()

//get all categories
router.get('/',async(req, res) =>{
    const categoryList = await Category.find()
    if(!categoryList){
        res.status(500).json({success : false})
    }
    else{
        res.status(200).send(categoryList)
    }
})

//get category by id
router.get('/:id',async(req, res)=>{
    const category = await Category.findById(req.params.id).then(category =>{
        if(!category){
            res.status(500).json({success : false , message:'no category'})
        }
        else{
            res.status(200).send(category)
        }
    }).catch(err => {
        res.status(500).json({
            success : false,
            error : err
        })
    })

    })

//create a category
router.post('/', async(req, res)=>{
    const categoryAdded= new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })

    categoryAdded.save().then(cat =>{
        res.status(201).json({
            message:'category added sucessfully from res',
            categoryId:cat._id
        })
    }).catch(err =>{
        res.status(500).json({
            error:err,
            success:false
        })
        console.log(err)
    })
})

//delete a category
router.delete('/:id',(req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category){
            return res.status(200).json({
                success: true,
                message:'the category removed'
            })
        }else{
            return res.status(404).json({
                success:false,
                message:'the category not removed'
            })
        }
    }).catch(err =>{
        return res.status(400).json({
            success: false,
            error:err
        })
    })
})

//updating the category
router.put('/:id',async(req, res)=>{
    const category=await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            color:req.body.color
        },{new:true})
    .then(category =>{
        if(category){
            return res.status(200).json({
                success: true,
                message:'the category updated',
                category:category
            })
        }else{
            return res.status(404).json({
                success:false,
                message:'the category not updated'
            })
        }
    }).catch(err =>{
        res.status(500).json({
            error: err
        })
    })
})

module.exports=router