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
} from "./handlers.js";

export const mobileProjectRouter = express.Router();

mobileProjectRouter.use(
  requireMobileClient,
  authMiddleware,
  requireRole("professor")
);

mobileProjectRouter.post("/create", asyncHandler(createProjectHandler));
mobileProjectRouter.post(
  "/:uuid/team/create",
  asyncHandler(createProjectTeamHandler)
);
mobileProjectRouter.patch(
  "/:uuid/team/members/:uuidUser",
  asyncHandler(updateTeamMemberHandler)
);
mobileProjectRouter.delete(
  "/:uuid/team/members/:uuidUser",
  asyncHandler(deleteTeamMemberHandler)
);
