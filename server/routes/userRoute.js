const express=require('express')
const passport=require('passport')
const userRouter=require('express').Router()
const  rateLimit = require( 'express-rate-limit')
const { createUser, loginUser } = require('../controller/userController');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 4,
  standardHeaders: 'draft-8',
  legacyHeaders: false,

    message:'Too many requests . Please try again after 15 minutes.',
  ipv6Subnet: 56,
})
userRouter.post('/register', createUser)
userRouter.post('/login',limiter, loginUser)

userRouter.get('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.status(200).json({
          id:req.user._id,
          fullname:req.user.fullname,
          email:req.user.email,
          role:req.user.role
        })

    }
);

module.exports=userRouter