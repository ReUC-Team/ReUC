import express from "express";
import { getPublicAssetHandler } from "./handlers.js";

export const fileRouter = express.Router();

fileRouter.get("/public/:uuid", getPublicAssetHandler);
