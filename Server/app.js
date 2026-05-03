let express=require('express');
let path=require('path')

let app=express();
let cors=require('cors');
require('dotenv').config();
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./view/Home.html'));
});
app.use('/products',require('./routes/productRoute'));

module.exports=app;
