import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { getPublicAssetHandler, getFileHandler } from "./handlers.js";

export const fileRouter = express.Router();

fileRouter.get("/public/:uuid", getPublicAssetHandler);
fileRouter.get(
  "/:model/:purpose/:uuidmodel",
  // authMiddleware,
  getFileHandler
);
