import fs from "fs";
import file from "@reuc/application/file/index.js";

export async function getPublicAssetHandler(req, res) {
  try {
    const { uuid } = req.params;
    const response = await file.getAsset({ uuidFile: uuid });
    const assetFile = response.file;

    if (!fs.existsSync(assetFile.storedPath)) {
      throw new Error(
        "Lo sentimos, parece que este archivo ya no está disponible."
      );
    }

    res.setHeader("Content-Type", assetFile.mimetype);
    res.setHeader("Content-Length", assetFile.fileSize);

    const stream = fs.createReadStream(assetFile.storedPath);
    stream.on("error", (err) => {
      if (!res.headersSent) res.status(500).end();
    });

    stream.pipe(res);
  } catch (err) {
    return res.status(404).json({ success: false, err: err.message });
  }
}
