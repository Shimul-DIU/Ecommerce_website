import {DisplayProducts} from "../controller/productController.js";
import express from 'express'
const productRouter=express.Router();
productRouter.get('/',DisplayProducts)


export default productRouter;