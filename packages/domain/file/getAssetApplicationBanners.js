import { fileRepo } from "@reuc/infrastructure/fileRepo.js";

export async function getAssetApplicationBanners() {
  return await fileRepo.getAssetApplicationBanners();
}
