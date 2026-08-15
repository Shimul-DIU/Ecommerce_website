import express from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import { createUser,logout, loginUser ,forgotPassword,resetPassword, GoogleLogin, refreshAccessToken} from '../controller/authController.js';
import { ForgotPassword, loginAdmin, ResetPassword } from '../controller/adminController.js';

const authRouter = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 4,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: 'Too many requests. Please try again after 15 minutes.',
  ipv6Subnet: 56,
});

authRouter.post('/user/register', createUser);
authRouter.post('/user/login', limiter, loginUser);
authRouter.post('/user/refresh', refreshAccessToken);
authRouter.post('/user/logout', logout);
authRouter.post("/user/forgot-password", forgotPassword);
authRouter.post(
  "/user/reset-password/:token",
  resetPassword
);

// Firebase-routing
authRouter.post('/user/google-login',GoogleLogin)

// ========================




// ====adminRoute================
authRouter.post('/admin/login', loginAdmin);
authRouter.post('/admin/forgot-password',ForgotPassword)
authRouter.post("/admin/reset-password", ResetPassword);

export default authRouter;