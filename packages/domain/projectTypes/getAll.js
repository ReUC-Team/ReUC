import { projectTypeRepo } from "@reuc/infrastructure/projectTypeRepo.js";

export async function getAll() {
  return await projectTypeRepo.getAll();
}
