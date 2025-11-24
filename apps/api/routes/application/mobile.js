import express from "express";
import {
  requireMobileClient,
  authMiddleware,
  requireRole,
} from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  createApplicationHandler,
  updateApplicationHandler,
  deleteApplicationHandler,
} from "./handlers.js";
import { fileUploadMiddleware } from "./index.js";

export const mobileApplicationRouter = express.Router();

mobileApplicationRouter.use(requireMobileClient, authMiddleware);

mobileApplicationRouter.post(
  "/create",
  requireRole("outsider"),
  fileUploadMiddleware,
  asyncHandler(createApplicationHandler)
);
mobileApplicationRouter.put(
  "/:uuid",
  requireRole("professor"),
  asyncHandler(updateApplicationHandler)
);
mobileApplicationRouter.delete(
  "/:uuid",
  requireRole(["outsider", "professor"]),
  asyncHandler(deleteApplicationHandler)
);
