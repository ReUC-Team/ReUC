import express from "express";
import {
  requireMobileClient,
  authMiddleware,
  requireRole,
} from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { createProjectHandler } from "./handlers.js";

export const mobileProjectRouter = express.Router();

mobileProjectRouter.use(
  requireMobileClient,
  authMiddleware,
  requireRole("professor")
);

mobileProjectRouter.post("/create", asyncHandler(createProjectHandler));
