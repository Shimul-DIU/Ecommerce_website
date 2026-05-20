let users=require('../model/userModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
let createUser=async(req,res)=>{

    try {
      let {fullname,email,password,confirmPassword}=req.body
      if (password !== confirmPassword){
        return res.status(400).json({
            message: "Password and Confirm Password do not match"
         });
      }

      let existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "Email is already registered"
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
    } catch (error) {
      console.log(error)
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
      const token=jwt.sign({email:user.email,id:user._id}, process.env.JWT_SECRET,'{expiresIn: 2d}' )
      return res.status(200).json({

         message: "Login successful",
         token:"Bearer " + token
        });
    }
    catch(error){
      console.log(error)
      return res.status(500).json({ message: "Internal server error" });
    }
}
module.exports={createUser,loginUser}