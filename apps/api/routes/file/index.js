import express from "express";
import { fileAuthMiddleware } from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { getPublicAssetHandler, getFileHandler } from "./handlers.js";

export const fileRouter = express.Router();

fileRouter.get("/public/:uuid", asyncHandler(getPublicAssetHandler));

fileRouter.get(
  "/:model/:purpose/:uuidmodel",
  fileAuthMiddleware,
  asyncHandler(getFileHandler)
);
