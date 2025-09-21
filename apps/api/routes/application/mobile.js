import express from "express";
import multer from "multer";
import {
  authMiddleware,
  requireOutsider,
  requireMobileClient,
} from "../../middleware/auth.js";
import { createApplicationHandler } from "./handlers.js";

export const mobileApplicationRouter = express.Router();
const upload = multer();
mobileApplicationRouter.use(requireMobileClient);

mobileApplicationRouter.post(
  "/create",
  authMiddleware,
  requireOutsider,
  upload.single("file"), // checkout index.js for more details
  createApplicationHandler
);
