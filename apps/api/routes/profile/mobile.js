import express from "express";
import {
  authMiddleware,
  requireOutsider,
  requireMobileClient,
} from "../../middleware/auth.js";
import { editProfileHandler, getProfileHandler } from "./handlers.js";

export const mobileProfileRouter = express.Router();

mobileProfileRouter.use(requireMobileClient);

mobileProfileRouter.get(
  "/get",
  authMiddleware,
  requireOutsider,
  getProfileHandler
);
mobileProfileRouter.patch(
  "/edit",
  authMiddleware,
  requireOutsider,
  editProfileHandler
);
