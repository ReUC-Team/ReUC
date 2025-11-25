import express from "express";
import csurf from "csurf";
import multer from "multer";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  createProjectHandler,
  getMyProjectsHandler,
  getProjectsHandler,
  createProjectTeamHandler,
  getTeamCreationFormDataHandler,
  getDetailedProjectHandler,
  updateTeamMemberHandler,
  deleteTeamMemberHandler,
  startProjectHandler,
  rollbackProjectHandler,
  updateDeadlineProjectHandler,
  uploadProjectResourceFileHandler,
  editProjectResourceFileHandler,
  deleteProjectResourceFileHandler,
} from "./handlers.js";

export const projectRouter = express.Router();
projectRouter.use(authMiddleware);

const csrfProtection = csurf({ cookie: true });
const upload = multer();

export const fileUploadMiddleware = upload.single("file");

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
  requireRole(["outsider", "professor", "student"]),
  asyncHandler(getMyProjectsHandler)
);
projectRouter.post(
  "/:uuid/team/create",
  csrfProtection,
  requireRole("professor"),
  asyncHandler(createProjectTeamHandler)
);
projectRouter.get(
  "/:uuid/team/metadata",
  requireRole(["outsider", "professor", "student"]),
  asyncHandler(getTeamCreationFormDataHandler)
);
projectRouter.get(
  "/:uuid",
  requireRole(["outsider", "professor", "student"]),
  asyncHandler(getDetailedProjectHandler)
);
projectRouter.patch(
  "/:uuid/team/members/:uuidUser",
  csrfProtection,
  requireRole("professor"),
  asyncHandler(updateTeamMemberHandler)
);
projectRouter.delete(
  "/:uuid/team/members/:uuidUser",
  csrfProtection,
  requireRole("professor"),
  asyncHandler(deleteTeamMemberHandler)
);
projectRouter.post(
  "/:uuid/start",
  csrfProtection,
  requireRole("professor"),
  asyncHandler(startProjectHandler)
);
projectRouter.post(
  "/:uuid/rollback",
  csrfProtection,
  requireRole("professor"),
  asyncHandler(rollbackProjectHandler)
);
projectRouter.patch(
  "/:uuid/deadline",
  csrfProtection,
  requireRole("professor"),
  asyncHandler(updateDeadlineProjectHandler)
);
projectRouter.post(
  "/:uuid/resources/file",
  csrfProtection,
  requireRole(["student", "professor"]),
  fileUploadMiddleware,
  asyncHandler(uploadProjectResourceFileHandler)
);
projectRouter.put(
  "/:uuid/resources/file/:uuidResource",
  csrfProtection,
  requireRole(["student", "professor"]),
  fileUploadMiddleware,
  asyncHandler(editProjectResourceFileHandler)
);
projectRouter.delete(
  "/:uuid/resources/file/:uuidResource",
  csrfProtection,
  requireRole(["student", "professor"]),
  asyncHandler(deleteProjectResourceFileHandler)
);
