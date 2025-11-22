import express from "express";
import {
  requireMobileClient,
  authMiddleware,
  requireRole,
} from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { createApplicationHandler } from "./handlers.js";
import { fileUploadMiddleware } from "./index.js";

export const mobileApplicationRouter = express.Router();

mobileApplicationRouter.use(
  requireMobileClient,
  authMiddleware,
  requireRole(["outsider", "professor"])
);

mobileApplicationRouter.post(
  "/create",
  fileUploadMiddleware,
  asyncHandler(createApplicationHandler)
);
