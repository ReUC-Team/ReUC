import fs from "fs";
import file from "@reuc/application/file/index.js";

export async function getPublicAssetHandler(req, res) {
  try {
    const { uuid } = req.params;

    const { file: assetFile } = await file.getAsset({
      uuidFile: uuid,
    });

    if (!fs.existsSync(assetFile.storedPath)) {
      throw new Error(
        "Lo sentimos, parece que este archivo ya no está disponible."
      );
    }

    res.setHeader("Content-Type", assetFile.mimetype);
    res.setHeader("Content-Length", assetFile.fileSize);

    const stream = fs.createReadStream(assetFile.storedPath);
    stream.on("error", (err) => {
      if (!res.headersSent) res.status(500).json({ success: false, err: err });
    });

    stream.pipe(res);
  } catch (err) {
    return res.status(404).json({ success: false, err: err.message });
  }
}

export async function getFileHandler(req, res) {
  try {
    const { model, uuidmodel, purpose } = req.params;

    const { file: fileData } = await file.getFile({
      modelTarget: model,
      uuidTarget: uuidmodel,
      purpose,
    });

    if (!fs.existsSync(fileData.storedPath)) {
      throw new Error(
        "Lo sentimos, parece que este archivo ya no está disponible."
      );
    }

    res.setHeader("Content-Type", fileData.mimetype);
    res.setHeader("Content-Length", fileData.fileSize);

    const stream = fs.createReadStream(fileData.storedPath);
    stream.on("error", (err) => {
      if (!res.headersSent) res.status(500).json({ success: false, err: err });
    });

    stream.pipe(res);
  } catch (err) {
    return res.status(404).json({ success: false, err: err.message });
  }
}
