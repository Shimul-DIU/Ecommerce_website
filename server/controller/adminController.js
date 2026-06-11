let Admin=require('../model/adminModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
let createAdmin=async(req,res)=>{

    try {
      let {email,password,confirmPassword}=req.body
      if (!email || !password || !confirmPassword) {
        return res.status(400).json({
          message: "Email, password, and confirmPassword are required"
        });
      }
      if (password !== confirmPassword){
        return res.status(400).json({
            message: "Password and Confirm Password do not match"
         });
      }

      let existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          message: "Email is already registered"
        });
      }

      let hashpassword=await bcrypt.hash(password, saltRounds);
      let admin=new Admin({
        email,
        password:hashpassword
      })
      await admin.save();
      return res.status(200).json({ message: "Admin created successfully" });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }

}
const loginAdmin=async(req,res)=>{
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
      let admin=await Admin.findOne({email})
      if (!admin){
        return res.status(400).json({
            message: "Invalid email or password"
         });
      }
      let isMatch=await bcrypt.compare(password,admin.password)
      if (!isMatch){
        return res.status(400).json({
            message: "Invalid email or password"
         });

      }
      const token=jwt.sign({email:admin.email,id:admin._id}, process.env.JWT_SECRET, { expiresIn: '2d' })
      return res.status(200).json({

         message: "Login successful",
         token:"Bearer " + token
        });
    }
    catch(error){
      if (process.env.NODE_ENV === 'development') console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
}
module.exports={createAdmin,loginAdmin}