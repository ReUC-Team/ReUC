import express from "express";
import csurf from "csurf";
import multer from "multer";
import { authMiddleware, requireRole } from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  createApplicationHandler,
  getCreationFormDataHandler,
  getExploreApplicationsHandler,
  getExploreFiltersHandler,
  getDetailedApplicationHandler,
} from "./handlers.js";

export const applicationRouter = express.Router();
applicationRouter.use(authMiddleware);

const csrfProtection = csurf({ cookie: true });
const upload = multer();

/**
 * This enable the file(s) object on the `req`
 *
 * - If it is uploaded a single 1 file
 * - If there is a single input file on the form
 *
 * Use the `single` method:
 * e.g.:
 * upload.single('fieldName')
 * req.file
 * - Hold the input 'fieldName` as a `MulterObject`. `req.file: Array<MulterObject>`
 *
 *
 * - If it is uploaded more than 1 files
 * - If there is a single input file on the form
 *
 * Use the `array` method:
 * e.g.:
 * upload.array('fieldName', 5 )
 * - The second argument stand for the number of expected images
 * req.files
 * - Hold the input 'fieldName` as an array. `req.files: Array<MulterObject>`
 *
 *
 * - If there is more than one input file on the form
 *
 * Use the `fields` method:
 * e.g.:
 * upload.fields([{ name: 'fieldName1', maxCount: 1 }, { name: 'fieldName2', maxCount: 8 }])
 * req.files['fieldName1']
 * - Hold the `1` file on `fieldName1` input as an array. `req.files['fieldName1'][0]: MulterObject`
 * req.files['fieldName2']
 * - Hold the `8` file on `fieldName2` input as an array. `req.files['fieldName2']: Array<MulterObject>`
 *
 *
 * Defines the structure of a file object processed by Multer when
 * using memoryStorage.
 *
 * @typedef {object} MulterFile
 * @property {string} fieldname - Field name specified in the form (e.g., 'customBannerFile').
 * @property {string} originalname - Original name of the file on the user's computer.
 * @property {string} encoding - Encoding type of the file (e.g., '7bit').
 * @property {string} mimetype - Mime type of the file (e.g., 'image/png').
 * @property {number} size - Size of the file in bytes.
 * @property {Buffer} buffer - A Buffer of the entire file (available with memoryStorage).
 */
export const fileUploadMiddleware = upload.fields([
  { name: "customBannerFile", maxCount: 1 },
  { name: "attachments", maxCount: 5 },
]);

applicationRouter.get(
  "/metadata/create",
  asyncHandler(getCreationFormDataHandler)
);
applicationRouter.post(
  "/create",
  csrfProtection,
  requireRole("outsider"),
  fileUploadMiddleware,
  asyncHandler(createApplicationHandler)
);
applicationRouter.get(
  "/explore{/:faculty}",
  requireRole(["outsider", "professor"]),
  asyncHandler(getExploreApplicationsHandler)
);
applicationRouter.get(
  "/metadata/explore",
  asyncHandler(getExploreFiltersHandler)
);
applicationRouter.get(
  "/:uuid",
  requireRole(["admin", "professor", "outsider"]),
  asyncHandler(getDetailedApplicationHandler)
);
