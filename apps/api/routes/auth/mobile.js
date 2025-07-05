import express from "express";
import rateLimit from "express-rate-limit";
import { loginHandler, refreshHandler, registerHandler } from "./handlers.js";
import { requireMobileClient } from "../../middleware/auth.js";

export const mobileAuthRouter = express.Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });

mobileAuthRouter.use(authLimiter);
mobileAuthRouter.use(requireMobileClient);

mobileAuthRouter.post("/refresh", (req, res) =>
  refreshHandler(req, res, false)
);
mobileAuthRouter.post("/register", (req, res) =>
  registerHandler(req, res, false)
);
mobileAuthRouter.post("/login", (req, res) => loginHandler(req, res, false));
