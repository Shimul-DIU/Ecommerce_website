import express from 'express';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import  {ResetPassword, ForgotPassword, loginAdmin } from '../controller/adminController.js';
import {productController} from '../controller/productController.js';
import { upload } from '../middleware/upload.js';

const adminRouter = express.Router();

// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
});

// admin login route
adminRouter.post('/login', loginAdmin);
adminRouter.post('/forgot-password',ForgotPassword)
adminRouter.post("/reset-password", ResetPassword);
// admin dashboard (protected route)
adminRouter.get(
  '/dashboard',
  passport.authenticate('admin-jwt', { session: false }),
  (req, res) => {
    res.json({
      success: true,
      message: 'Welcome Admin Dashboard',
    });
  }
);

// add product
adminRouter.post('/add-product',upload.single("image"),productController)


export default adminRouter;