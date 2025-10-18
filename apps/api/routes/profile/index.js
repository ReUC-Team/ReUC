import express from "express";
import csurf from "csurf";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  editProfileHandler,
  getProfileHandler,
  getProfileStatusHandler,
} from "./handlers.js";

export const profileRouter = express.Router();
profileRouter.use(authMiddleware, requireRole("outsider"));

const csrfProtection = csurf({ cookie: true });

profileRouter.get("/get", asyncHandler(getProfileHandler));
profileRouter.patch("/edit", csrfProtection, asyncHandler(editProfileHandler));
profileRouter.get("/status", asyncHandler(getProfileStatusHandler));
