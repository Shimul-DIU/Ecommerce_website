import authMiddleware from "../middleware/authMiddleware"
import express from express()
import { getProfile } from "../controller/userController"
const userRouter=express.Router()
userRouter.get('/profile',authMiddleware,getProfile)

export default userRouter