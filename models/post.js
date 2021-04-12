const mongoose = require('mongoose')
const postSchema=mongoose.Schema({
    title:{type:String , required:true,default:'hello'},
    content:{type:String , required:true,default:'my content is: '}
})

module.exports = mongoose.model('Post',postSchema)

