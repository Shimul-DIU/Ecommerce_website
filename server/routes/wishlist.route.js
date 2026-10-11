import express from "express";
import passport from "passport";
import {
  getWishlist,
  toggleWishlist,
  mergeWishlist,
} from "../controller/wishlist.controller.js";

const router = express.Router();
const auth = passport.authenticate("user-jwt", { session: false });

router.get("/", auth, getWishlist);
router.post("/toggle", auth, toggleWishlist);
router.post("/merge", auth, mergeWishlist);

export default router;