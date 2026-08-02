import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
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

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
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
app.use('/api/admin', adminRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;