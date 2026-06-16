import express from 'express';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { loginAdmin } from '../controller/adminController.js';

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

export default adminRouter;