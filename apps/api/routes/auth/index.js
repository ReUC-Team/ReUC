import express from "express";
import csurf from "csurf";
import rateLimit from "express-rate-limit";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  loginHandler,
  registerHandler,
  logoutHandler,
  refreshHandler,
  roleStatusHandler,
} from "./handlers.js";

export const authRouter = express.Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });
authRouter.use(authLimiter);

const csrfProtection = csurf({ cookie: true });

authRouter.post("/refresh", asyncHandler(refreshHandler()));
authRouter.post("/register", csrfProtection, asyncHandler(registerHandler()));
authRouter.post("/login", csrfProtection, asyncHandler(loginHandler()));
authRouter.delete("/logout", logoutHandler);
authRouter.get(
  "/me",
  authMiddleware,
  requireRole(["outsider", "student", "professor", "admin"]),
  roleStatusHandler
);
