import express from "express";
import csurf from "csurf";
import { authMiddleware, requireOutsider } from "../../middleware/auth.js";
import {
  editProfileHandler,
  getProfileHandler,
  getProfileStatusHandler,
} from "./handlers.js";

export const profileRouter = express.Router();
const csrfProtection = csurf({ cookie: true });

profileRouter.get("/get", authMiddleware, requireOutsider, getProfileHandler);
profileRouter.patch(
  "/edit",
  authMiddleware,
  csrfProtection,
  requireOutsider,
  editProfileHandler
);
profileRouter.get(
  "/status",
  authMiddleware,
  requireOutsider,
  getProfileStatusHandler
);
