import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { getPublicAssetHandler, getFileHandler } from "./handlers.js";

export const fileRouter = express.Router();

// Assets predefinidos (logos, íconos)
fileRouter.get("/public/:uuid", asyncHandler(getPublicAssetHandler));

// Archivos públicos (banners, attachments de proyectos)
fileRouter.get(
  "/public/:model/:purpose/:uuidmodel",
  asyncHandler(getFileHandler)
);

// 🔒 Archivos protegidos (CVs, documentos privados)
fileRouter.get(
  "/protected/:model/:purpose/:uuidmodel",
  authMiddleware,
  asyncHandler(getFileHandler)
);