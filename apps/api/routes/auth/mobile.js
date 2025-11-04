import express from "express";
import rateLimit from "express-rate-limit";
import { requireMobileClient } from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { loginHandler, refreshHandler, registerHandler } from "./handlers.js";

export const mobileAuthRouter = express.Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });
mobileAuthRouter.use(authLimiter, requireMobileClient);

mobileAuthRouter.post("/refresh", asyncHandler(refreshHandler(false)));
mobileAuthRouter.post("/register", asyncHandler(registerHandler(false)));
mobileAuthRouter.post("/login", asyncHandler(loginHandler(false)));
