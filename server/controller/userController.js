let users=require('../model/userModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;
let createUser=async(req,res)=>{

    try {
      let {fullname,email,password,confirmPassword}=req.body
      if (password !==confirmPassword){
        return res.status(400).json({
            message: "Password and Confirm Password do not match"
         });
      }
      let hashpassword=await bcrypt.hash(password, saltRounds);
    let user=new users({
      fullname,
      email,
      password:hashpassword
    })
    await user.save()
    } catch (error) {
      console.log(error)
    }

}
module.exports=createUser