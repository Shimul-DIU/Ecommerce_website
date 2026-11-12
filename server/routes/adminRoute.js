import express from 'express';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { ResetPassword, ForgotPassword, loginAdmin } from '../controller/adminController.js';
import {
  deleteProduct,
  getAdminProduct,
  productController,
  updateProduct,
} from '../controller/productController.js';
import {
  getAdminOrders,
  updateOrderStatus,
} from '../controller/orderController.js';
import { getAdminDashboardSummary } from '../controller/dashboardController.js';
import { upload } from '../middleware/upload.js';

const adminRouter = express.Router();
const adminAuth = passport.authenticate('admin-jwt', { session: false });

const uploadProductImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        error: { image: error.message || "Image upload failed" },
      });
    }

    next();
  });
};

// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
});

// admin login route

// admin dashboard (protected route)
adminRouter.get('/dashboard/summary', adminAuth, getAdminDashboardSummary);
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

adminRouter.get(
  '/orders',
  passport.authenticate('admin-jwt', { session: false }),
  getAdminOrders
);
adminRouter.patch(
  '/orders/:orderId/status',
  passport.authenticate('admin-jwt', { session: false }),
  updateOrderStatus
);

adminRouter.get('/products/:productId', adminAuth, getAdminProduct);
adminRouter.patch(
  '/products/:productId',
  adminAuth,
  uploadProductImage,
  updateProduct
);
adminRouter.delete('/products/:productId', adminAuth, deleteProduct);
adminRouter.post('/add-product', adminAuth, uploadProductImage, productController);


export default adminRouter;