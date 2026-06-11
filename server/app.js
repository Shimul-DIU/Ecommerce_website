let express=require('express')
let {userRoute,adminRoute }= require('./routes')
require('dotenv').config();
let cors=require('cors')
let mongoose=require('mongoose');
const passport = require('passport');

require('./config/passport');
let app=express();


mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/ecommerce")
.then(() => {
    if (process.env.NODE_ENV === 'development') console.log("MongoDB connected");
})
   .catch(err => console.log("MongoDB connection error:", err));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(passport.initialize());

app.use('/user',userRoute)
app.use('/api',adminRoute)


app.use((req,res,next)=>{
      res.status(404).json({message:'invalid request'})
})
app.use((err,req,res,next)=>{
      res.status(500).json({message:err.message})
})




module.exports=app