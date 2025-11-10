import fs from "fs";
import { promises as fsPromises } from "fs";
import file from "@reuc/application/file/index.js";
import * as ApplicationError from "@reuc/application/errors/index.js";

/**
 * Handles serving a public asset file by its UUID.
 */
export async function getPublicAssetHandler(req, res) {
  const { uuid } = req.params;

  const { file: assetFile } = await file.getAsset({
    uuidFile: uuid,
  });

  await ensureFileExists(assetFile.storedPath);

  await streamFile(
    res,
    assetFile.storedPath,
    assetFile.mimetype,
    assetFile.fileSize
  );
}

/**
 * Handles serving a protected file based on its model relationship.
 */
export async function getFileHandler(req, res) {
  const { model, uuidmodel, purpose, uuidfile } = req.params;

  const { rule, data: fileData } = await file.getFile({
    modelTarget: model,
    uuidTarget: uuidmodel,
    purpose,
    uuidFile: uuidfile,
  });

  // Set the 'Content-Disposition' header based on the rule.
  if (rule.context === "download") {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileData.originalName}"`
    );
  } else {
    // "viewing" context
    res.setHeader("Content-Disposition", "inline");
  }

  await ensureFileExists(fileData.storedPath);

  await streamFile(
    res,
    fileData.storedPath,
    fileData.mimetype,
    fileData.fileSize
  );
}

/**
 * A private helper to safely stream a file to the response, wrapping the operation
 * in a Promise to ensure stream errors are caught by the asyncHandler.
 * @private
 */
function streamFile(res, filePath, mimetype, fileSize) {
  return new Promise((resolve, reject) => {
    res.setHeader("Content-Type", mimetype);
    res.setHeader("Content-Length", fileSize);

    const stream = fs.createReadStream(filePath);

    stream.on("error", (err) => {
      console.error("File stream error:", err);
      // Reject with a standard ApplicationError so the centralized handler can process it.
      reject(
        new ApplicationError.ApplicationError(
          "An error occurred while streaming the file."
        )
      );
    });

    stream.pipe(res);

    // Resolve the promise when the response is finished or the client closes the connection.
    res.on("finish", resolve);
    res.on("close", resolve);
  });
}

/**
 * Checks if a file exists on disk and throws a NotFoundError if not.
 * This handles server inconsistencies where a DB record exists but the file is gone.
 * @private
 */
async function ensureFileExists(filePath) {
  try {
    await fsPromises.access(filePath);
  } catch (error) {
    console.error(`File not found on disk at path: ${filePath}`);
    throw new ApplicationError.NotFoundError(
      "The requested file asset is no longer available."
    );
  }
}
