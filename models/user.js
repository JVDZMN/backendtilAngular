
const mongoose = require('mongoose')
const userSchema=mongoose.Schema({
    firstname:{type:String , required:true},
    lastname:{type:String , required:true},
    username:{type:String , required:true},
    birthday:{type:Date ,default: () => new Date(+new Date() + 7*24*60*60*1000)},
    email:{type:String,required:true},
    passwordHash:{type:String,required:true},
    street:{type:String , default:''},
    apartment:{type:String,default:'' },
    zip:{type:String,default:'' },
    city:{type:String , default:''},
    country:{type:String,default:'' },
    phone:{type:String,default:''},
    token:{type:String,default : ''},
    isAdmin:{type:Boolean,default:false}
})
userSchema.virtual('id').get(function(){
    return this._id.toHexString()
})
userSchema.set('toJSON',{
    virtuals : true
})
module.exports = mongoose.model('Users',userSchema)
