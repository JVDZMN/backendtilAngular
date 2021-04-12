const Order = require('../models/order')
const orderItemModel = require('../models/orderItem')
const express = require('express')
const router = express.Router()

//get all order
router.get('/',async(req, res)=>{
   const orderList = await Order.find()
    .populate('user','name country')
    .populate({
        path:'orderItems', populate:{
            path:'product', populate:'category'}})
    if(!orderList){
        res.status(500).json({success : false})
    }
    res.send(orderList)
}) 

//get a specific user orders
router.get('/get/userorders/:userid',async(req, res)=>{
    const orderList = await Order.find({user : req.params.userid})
     .populate({
         path:'orderItems', populate:{
             path:'product', populate:'category'}})
     if(!orderList){
         res.status(500).json({success : false})
     }
     res.send(orderList)
 })
//get order by id
router.get('/:id',async(req, res)=>{
    const order = await Order.findById(req.params.id).populate('user','name country')
    if(!order){
        res.status(500).json({success : false})
    }
    res.send(order)
})

//create an order
router.post('/',async(req, res)=>{
    const orderItemIds =Promise.all( req.body.orderItems.map(async orderItem =>{
        let newOrderItem = new orderItemModel({
            quantity : orderItem.quantity,
            product:orderItem.product
        })
        newOrderItem = await newOrderItem.save()
        return newOrderItem._id
    }))

    const orderItemIdsResolved = await orderItemIds
    
    //console.log(orderItemIdsResolved) 


    const arrayOfPrices =await Promise.all(orderItemIdsResolved.map(async (orderItemId) =>{
        const orderItem = await orderItemModel.findById(orderItemId).populate('product','price')
        const totalPriceFromOrderItem = orderItem.product.price * orderItem.quantity
        return totalPriceFromOrderItem
    }))

    const totalPrice = arrayOfPrices.reduce((a,b)=>a+b ,0)
    console.log(totalPrice)
    let order = new Order({
        orderItems : orderItemIdsResolved,
        shippingAddress1 :req.body.shippingAddress1,
        shippingAddress2 :req.body.shippingAddress2,
        city : req.body.city,
        zip : req.body.zip,
        country : req.body.country,
        phone:req.body.phone,
        status : req.body.status,
        totalPrice:totalPrice,
        user :req.body.user
    })
    order = await order.save()

    if(!order)
    return res.status(400).json('the order cannot be created')

    res.send(order)
})

router.put('/:id',async(req, res)=>{
    const order=await Order.findByIdAndUpdate(
        req.params.id,
        {
            status : req.body.status
        },{new:true})
    .then(order =>{
        if(order){
            return res.status(200).json({
                success: true,
                message:'the category updated',
                order:order
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

router.delete('/:id',(req,res)=>{
    Order.findById(req.params.id).then(async orderItem =>{
        if(order){
            await order.orderItem.map(async orderItem =>{
                await orderItem.findByIdAndRemove(orderItem)
            })
             return res.status(200).json({
                success: true,message:'the Item is removed'
            })
        }else{
            return res.status(404).json({success : false , message:'the Item is not removed'})
        }
    }).catch(err =>{
        return res.status(500).json({success : false , error : err})
    })
})

router.get('/get/totalsales',async(req,res)=>{
    const totalsales = await orderItemModel.aggregate([{
        $group:{_id: null,totalsales : {$sum : '$totalPrice'}}
    }])

    if(!totalsales){
        return res.status(500).json('the order sales can not be ganarated')
    }
    res.send({totalsales : totalsales})
})



module.exports=router