let express=require('express')
const rateLimit = require( 'express-rate-limit');
const loginAdmin =require('../controller/adminController')
const passport = require('passport');

const adminRouter = express.Router()
// admin route
adminRouter.post('/login', loginAdmin)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
})
adminRouter.get(
  "/dashboard",
  passport.authenticate("admin-jwt", { session: false }),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin Dashboard"
    });
  }
);


module.exports = adminRouter