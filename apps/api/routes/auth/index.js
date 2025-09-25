import express from "express";
import csurf from "csurf";
import rateLimit from "express-rate-limit";
import { loginHandler, refreshHandler, registerHandler } from "./handlers.js";

export const authRouter = express.Router();

const csrfProtection = csurf({ cookie: true });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 });

authRouter.use(authLimiter);

authRouter.post("/refresh", (req, res) => refreshHandler(req, res, true));
authRouter.post("/register", csrfProtection, (req, res) =>
  registerHandler(req, res, true)
);
authRouter.post("/login", csrfProtection, (req, res) =>
  loginHandler(req, res, true)
);
authRouter.post("/logout", (req, res) => {
  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    })
    .status(200)
    .json({ success: true, message: "Sesión cerrada exitosamente" });
});
