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
    await user.save();
    res.status(200).json("User created successfully")
    } catch (error) {
      console.log(error)
    }

}
const loginUser=async(req,res)=>{
    try{
      let {email,password}=req.body
      if (!email){
        return res.status(400).json({
            message: "Email is required"
         });
      }
      if (!password){
        return res.status(400).json({
            message: "Password is required"
         });
      }
      let user=await users.findOne({email})
      if (!user){
        return res.status(400).json({
            message: "Invalid email or password"
         });
      }
      let isMatch=await bcrypt.compare(password,user.password)
      if (!isMatch){
        return res.status(400).json({
            message: "Invalid email or password"
         });
      }
      res.status(200).json("Login successful")
    }
    catch(error){
      console.log(error)
    }
}
module.exports={createUser,loginUser}