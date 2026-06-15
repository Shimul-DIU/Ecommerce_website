let express=require('express')
require('dotenv').config();
// const xssClean = require('xss-clean')
require('./config/passport/userJwtStrategy');
require('./config/passport/adminJwtStrategy');
let cors=require('cors')
let mongoose=require('mongoose');
const passport = require('passport');
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');

let app=express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(xssClean());
app.use(passport.initialize());
app.use('/user',userRouter)
app.post('/admin/login',(req,res)=>{
	console.log('login route called')
	res.send('login route')
})
// app.use((req,res,next)=>{
// 	console.log('client site errors ')
//       res.status(404).json({message:'invalid request'})
// })
// app.use((err,req,res,next)=>{
// 	console.log('server site errorsss')
//       res.status(500).json({message:err.message})
// })

mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/ecommerceDB").then(()=>{
	console.log('connected to database')
})
.catch((error)=>{
	console.log(error)
})




module.exports=app