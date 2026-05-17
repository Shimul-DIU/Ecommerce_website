let mongoose=require('mongoose')
let userSchema=new mongoose.Schema({
  fullname:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  confirmPassword:{
    type:String,
    required:true
  }
})
module.exports=mongoose.model('users',userSchema)