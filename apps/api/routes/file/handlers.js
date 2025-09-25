import fs from "fs";
import path from "path";
import file from "@reuc/application/file/index.js";

export async function getPublicAssetHandler(req, res) {
  try {
    const { uuid } = req.params;
    const response = await file.getAsset({ uuidFile: uuid });
    const assetFile = response.file;

    if (!fs.existsSync(assetFile.storedPath)) {
      throw new Error("Lo sentimos, parece que este archivo ya no está disponible.");
    }

    const stat = fs.statSync(assetFile.storedPath);
    res.setHeader("Content-Type", assetFile.mimetype || "application/octet-stream");
    res.setHeader("Content-Length", stat.size);

    const stream = fs.createReadStream(assetFile.storedPath);
    stream.on("error", (err) => {
      console.error("file stream error:", err);
      if (!res.headersSent) res.status(500).end();
    });

    stream.pipe(res);
  } catch (err) {
    console.error("getPublicAssetHandler error:", err);
    return res.status(404).json({ success: false, err: err.message });
  }
}
