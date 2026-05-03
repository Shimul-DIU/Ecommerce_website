let express=require('express');
let router=express.Router();
let {getProducts}=require('../Controller/productController');

router.get('/',getProducts);

module.exports=router;