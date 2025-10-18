import express from "express";
import {
  requireMobileClient,
  authMiddleware,
  requireRole,
} from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { editProfileHandler } from "./handlers.js";

export const mobileProfileRouter = express.Router();

mobileProfileRouter.use(
  requireMobileClient,
  authMiddleware,
  requireRole("outsider")
);

mobileProfileRouter.patch("/edit", asyncHandler(editProfileHandler));
