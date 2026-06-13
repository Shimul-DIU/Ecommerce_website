let express=require('express')
const limiter= require( 'express-rate-limit');

const passport = require('passport');
const { loginAdmin, createAdmin } = require('../controller/adminController');

const adminRouter = express.Router()
// admin route



adminRouter.post('/createAdmin', createAdmin)
adminRouter.post('/loginAdmin',limiter, loginAdmin)

module.exports = adminRouter