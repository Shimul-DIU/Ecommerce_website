import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';

import './config/passport/userJwtStrategy.js';
import './config/passport/adminJwtStrategy.js';

import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/user', userRouter);
app.use('/admin', adminRouter);

mongoose
  .connect(process.env.DB_URL || 'mongodb://localhost:27017/ecommerceDB')
  .then(() => {
    console.log('connected to database');
  })
  .catch((error) => {
    console.log(error);
  });

export default app;