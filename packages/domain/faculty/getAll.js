import { facultyRepo } from "@reuc/infrastructure/facultyRepo.js";

export async function getAll() {
  return await facultyRepo.getAll();
}
