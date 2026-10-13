import express from "express";
import { DisplayProducts, getDeals } from "../controller/productController.js";

const productRouter = express.Router();


productRouter.get("/", DisplayProducts);


productRouter.get("/deals", getDeals);

export default productRouter;