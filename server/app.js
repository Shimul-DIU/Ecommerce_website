import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import cors from 'cors';
import passport from 'passport';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import './config/passport/userJwtStrategy.js';
import './config/passport/adminJwtStrategy.js';

import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import productRouter from './routes/product.route.js';
import orderRouter from './routes/orderRoute/clientOrderRoute.js';
import authRouter from './routes/authRoute.js';


const app = express();


app.use(
  cors({
    origin: ["http://localhost:4173", process.env.CLIENT_URL],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(passport.initialize());

/* ================= ROUTES ================= */
app.get('/', (req, res) => {
  res.json({ message: 'wellcome to the server' });
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;