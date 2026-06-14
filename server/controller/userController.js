let users=require('../model/userModel')
require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
let createUser=async(req,res)=>{

    try {
      let {fullname,email,password,confirmPassword}=req.body
      const fields = { fullname, email, password, confirmPassword };
        for (let [key, value] of Object.entries(fields)) {
            if (!value) {
                return res.status(400).json({
                    error: { [key]: `${key} is required` }
                });
            }
        }

      if (password !== confirmPassword){
        return res.status(400).json({
            error:{
                confirmPassword:'Password not matched'
            }

         });
      }

      let existingUser = await users.findOne({ email }).select("+password");
      if (existingUser) {
        return res.status(400).json({
          error:{
            email:'Email is already registered'
          }
        });
      }

      let hashpassword=await bcrypt.hash(password, saltRounds);
      let user=new users({
        fullname,
        email,
        password:hashpassword
      })
      await user.save();
      return res.status(200).json({ message: "User created successfully" });
    }
     catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
      const payload={email:user.email,id:user._id}
      const token=jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: '200d'} )
      return res.status(200).json({

         message: "Login successful",
         token:"Bearer " + token
        });
    }
    catch(error){

      return res.status(500).json({ message: "Internal server error" });
    }
}
module.exports={createUser,loginUser}