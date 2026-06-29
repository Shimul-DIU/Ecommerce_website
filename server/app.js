import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';

import './config/passport/userJwtStrategy.js';
import './config/passport/adminJwtStrategy.js';

import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

/* ================= ROUTES ================= */
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

export default app;