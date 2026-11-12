
import express from 'express'
import {
  addAddress,
  deleteAddress,
  getAddresses,
  getProfile,
  updateAddress,
  updateProfile,
} from "../controller/userController.js"
import authMiddleware from '../middleware/authMiddleware.js'
const userRouter=express.Router()
userRouter.get('/profile', authMiddleware, getProfile)
userRouter.put('/profile', authMiddleware, updateProfile)
userRouter.get('/addresses', authMiddleware, getAddresses)
userRouter.post('/addresses', authMiddleware, addAddress)
userRouter.patch('/addresses/:addressId', authMiddleware, updateAddress)
userRouter.delete('/addresses/:addressId', authMiddleware, deleteAddress)

export default userRouter