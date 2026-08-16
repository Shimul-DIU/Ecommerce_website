
import express from 'express'
import { getProfile } from "../controller/userController.js"
import authMiddleware from '../middleware/authMiddleware.js'
const userRouter=express.Router()
userRouter.get('/profile',authMiddleware,getProfile)

export default userRouter