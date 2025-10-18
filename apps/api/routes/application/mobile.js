import express from "express";
import multer from "multer";
import {
  requireMobileClient,
  authMiddleware,
  requireRole,
} from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { createApplicationHandler } from "./handlers.js";

export const mobileApplicationRouter = express.Router();
mobileApplicationRouter.use(
  requireMobileClient,
  authMiddleware,
  requireRole("outsider")
);

const upload = multer();

mobileApplicationRouter.post(
  "/create",
  upload.single("file"),
  asyncHandler(createApplicationHandler)
);
