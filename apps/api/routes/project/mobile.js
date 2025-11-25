import express from "express";
import {
  requireMobileClient,
  authMiddleware,
  requireRole,
} from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  createProjectHandler,
  createProjectTeamHandler,
  updateTeamMemberHandler,
  deleteTeamMemberHandler,
  startProjectHandler,
  rollbackProjectHandler,
  updateDeadlineProjectHandler,
  uploadProjectResourceFileHandler,
  editProjectResourceFileHandler,
  deleteProjectResourceFileHandler,
} from "./handlers.js";
import { fileUploadMiddleware } from "./index.js";

export const mobileProjectRouter = express.Router();

mobileProjectRouter.use(requireMobileClient, authMiddleware);

mobileProjectRouter.post(
  "/create",
  requireRole("professor"),
  asyncHandler(createProjectHandler)
);
mobileProjectRouter.post(
  "/:uuid/team/create",
  requireRole("professor"),
  asyncHandler(createProjectTeamHandler)
);
mobileProjectRouter.patch(
  "/:uuid/team/members/:uuidUser",
  requireRole("professor"),
  asyncHandler(updateTeamMemberHandler)
);
mobileProjectRouter.delete(
  "/:uuid/team/members/:uuidUser",
  requireRole("professor"),
  asyncHandler(deleteTeamMemberHandler)
);
mobileProjectRouter.post(
  "/:uuid/start",
  requireRole("professor"),
  asyncHandler(startProjectHandler)
);
mobileProjectRouter.post(
  "/:uuid/rollback",
  requireRole("professor"),
  asyncHandler(rollbackProjectHandler)
);
mobileProjectRouter.patch(
  "/:uuid/deadline",
  requireRole("professor"),
  asyncHandler(updateDeadlineProjectHandler)
);
mobileProjectRouter.post(
  "/:uuid/resources/file",
  requireRole(["student", "professor"]),
  fileUploadMiddleware,
  asyncHandler(uploadProjectResourceFileHandler)
);
mobileProjectRouter.put(
  "/:uuid/resources/file/:uuidResource",
  requireRole(["student", "professor"]),
  fileUploadMiddleware,
  asyncHandler(editProjectResourceFileHandler)
);
mobileProjectRouter.delete(
  "/:uuid/resources/file/:uuidResource",
  requireRole(["student", "professor"]),
  asyncHandler(deleteProjectResourceFileHandler)
);
