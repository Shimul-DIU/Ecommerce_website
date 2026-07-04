import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';

import './config/passport/userJwtStrategy.js';
import './config/passport/adminJwtStrategy.js';

import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import productRouter from './routes/product.route.js';

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(passport.initialize());

/* ================= ROUTES ================= */
app.get('/',(req,res)=>{
  res.json({message:'wellcome to the server'})
})
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products',productRouter)

export default app;