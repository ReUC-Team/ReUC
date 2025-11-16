import express from "express";
import csurf from "csurf";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  createProjectHandler,
  getMyProjectsHandler,
  getProjectsHandler,
  createProjectTeamHandler,
} from "./handlers.js";

export const projectRouter = express.Router();
projectRouter.use(authMiddleware);

const csrfProtection = csurf({ cookie: true });

projectRouter.post(
  "/create",
  csrfProtection,
  requireRole("professor"),
  asyncHandler(createProjectHandler)
);
projectRouter.get(
  "/all",
  requireRole("professor"),
  asyncHandler(getProjectsHandler)
);
projectRouter.get(
  "/my-projects",
  requireRole(["outsider", "professor"]),
  asyncHandler(getMyProjectsHandler)
);
projectRouter.post(
  "/:uuid/team/create",
  csrfProtection,
  requireRole("professor"),
  asyncHandler(createProjectTeamHandler)
);
