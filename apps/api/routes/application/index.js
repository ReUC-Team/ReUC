import express from "express";
import csurf from "csurf";
import multer from "multer";
import { authMiddleware, requireOutsider } from "../../middleware/auth.js";
import {
  createApplicationHandler,
  getApplicationMetadataHandler,
} from "./handlers.js";

export const applicationRouter = express.Router();
const csrfProtection = csurf({ cookie: true });
/**
 * This will wrap all the files if multiple where added
 * I could use the `dest` to directly store the file
 * e.g const upload = multer({ dest: 'path/to/save/file/' });
 */
const upload = multer();

applicationRouter.get("/metadata", getApplicationMetadataHandler);

applicationRouter.post(
  "/create",
  authMiddleware,
  csrfProtection,
  requireOutsider,
  /**
   * This enable me the file on the `req` object
   * req.file // THIS HOLD THE IMAGE ON `file` FIELD
   *
   * If I upload more than 1 file to the form then I use array method
   * e.g. upload.array('fieldName', 5 ) // 5 stand for the number of expected images
   * req.files // HOLD THE IMAGES ON THE 'fieldName` FIELD AS AN ARRAY
   *
   * If there is more than one file field on the form use the fields method
   * e.g. upload.fields([{ name: 'fieldName1', maxCount: 1 }, { name: 'fieldName2', maxCount: 8 }])
   * req.files['fieldName1'] // HOLD THE `1` IMAGE ON THE `fieldName1` FIELD AS AN ARRAY
   * req.files['fieldName2'] // HOLD THE `8` IMAGES ON THE `fieldName2` FIELD AS AN ARRAY
   */
  upload.single("file"),
  /**
   * What contains in the `req.file`, `req.files[0]` or `req.files['fieldName'][0]`
   * Is an object with the following attributes
   * - fieldname: Field name specified in the form
   * - originalname: Name of the file on the user's computer
   * - encoding: Encoding type of the file
   * - mimetype: Mime type of the file
   * - size: Size of the file in bytes
   * - destination: The folder to which the file has been saved
   * - filename: The name of the file within the destination
   * - path: The full path to the uploaded file
   * - buffer: A Buffer of the entire file
   */
  createApplicationHandler
);
