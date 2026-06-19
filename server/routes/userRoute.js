import express from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import { createUser, loginUser } from '../controller/userController.js';

const userRouter = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 4,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: 'Too many requests. Please try again after 15 minutes.',
  ipv6Subnet: 56,
});

userRouter.post('/register', createUser);

userRouter.post('/login', limiter, loginUser);

userRouter.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({
      id: req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
      role: req.user.role,

    })
    res.end();
  }
);

export default userRouter;