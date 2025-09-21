import { fileRepo } from "@reuc/infrastructure/fileRepo.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export async function getAssetByUuid(uuid) {
  const assetFound = await fileRepo.getAssetByUuid(uuid);

  if (!assetFound) throw new NotFoundError("No file found or not accessible.");

  return assetFound;
}
