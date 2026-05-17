let express=require('express')
let userRoute = require('./routes');
require('dotenv').config();
let cors=require('cors')
let mongoose=require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10;
let app=express();


mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/users")
.then(() => console.log("MongoDB connected"))
   .catch(err => console.log(err));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())


app.use('/user',userRoute)



module.exports=app