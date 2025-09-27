import { fileRepo } from "@reuc/infrastructure/fileRepo.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export async function getFileByModelTargetUuidTargetPurpose(
  modelTarget,
  uuidTarget,
  purpose
) {
  const file = await fileRepo.getFileByModelTargetUuidTargetPurpose(
    modelTarget,
    uuidTarget,
    purpose
  );

  if (!file) throw new NotFoundError("No file found.");

  return file.file;
}
