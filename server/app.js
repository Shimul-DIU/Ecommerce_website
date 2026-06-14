let express=require('express')
require('dotenv').config();
const  xssClean = require("xss-clean") ;

let cors=require('cors')
let mongoose=require('mongoose');
const passport = require('passport');
const rateLimit =require('express-rate-limit');
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 4, // Limit each IP to 4 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56,
	message: {
		message: 'Too many requests, please try again after 15 minutes.',
		success: false,
	},
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.

require('./config/passport/userJwtStrategy');
require('./config/passport/adminJwtStrategy');
let app=express();
app.use(limiter)

mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/ecommerce")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(xssClean());
app.use(passport.initialize());


app.use('/user',userRouter)
app.use('/admin',adminRouter)


app.use((req,res,next)=>{
      res.status(404).json({message:'invalid request'})
})
app.use((err,req,res,next)=>{
      res.status(500).json({message:err.message})
})




module.exports=app