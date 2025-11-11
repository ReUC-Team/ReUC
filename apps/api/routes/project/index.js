import express from "express";
import csurf from "csurf";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { createProjectHandler } from "./handlers.js";
import { applicationRouter } from "../application/index.js";

export const projectRouter = express.Router();
projectRouter.use(authMiddleware);

const csrfProtection = csurf({ cookie: true });

projectRouter.post(
  "/create",
  csrfProtection,
  requireRole("professor"),
  asyncHandler(createProjectHandler)
);
