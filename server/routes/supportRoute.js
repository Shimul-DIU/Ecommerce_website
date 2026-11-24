import express from "express";
import rateLimit from "express-rate-limit";
import { sendSupportMessage } from "../controller/supportController.js";

const supportRouter = express.Router();

const supportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many messages. Please try again after 15 minutes.",
});

supportRouter.post("/", supportLimiter, sendSupportMessage);

export default supportRouter;
