import { problemTypeRepo } from "@reuc/infrastructure/problemTypeRepo.js";

export async function getDefaultApplicationMeta() {
  return await problemTypeRepo.getLimited(0, 4);
}
