let mongoose=require('mongoose')
let adminSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  }
})
module.exports=mongoose.model('admins',adminSchema)