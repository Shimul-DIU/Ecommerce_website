import express from "express";
import passport from 'passport'
import { createReview, getProductReviews } from "../controller/reviewController.js";

const reviewRouter = express.Router();


reviewRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createReview
);
reviewRouter.get(
  "/product/:productId",
  getProductReviews
);

export default reviewRouter;