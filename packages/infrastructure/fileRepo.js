import { db } from "./db/client.js";

export const fileRepo = {
  async getAll() {
    return await db.file_Link.findMany();
  },
  async getAssetApplicationBanners() {
    return await db.file.findMany({
      where: {
        storedName: {
          contains: "application-banner",
        },
      },
      select: {
        uuid_file: true,
        originalName: true,
      },
    });
  },
  async getAssetByUuid(uuidFile) {
    return await db.file.findUnique({
      where: {
        uuid_file: uuidFile,
        isAsset: true,
      },
      select: {
        uuid_file: true,
        storedName: true,
        originalName: true,
        storedPath: true,
        fileSize: true,
        mimetype: true,
      },
    });
  },
  async getFileLinkByModelTargetANDUuidTargetANDPurpose(
    modelTarget,
    uuidTarget,
    purpose
  ) {
    return await db.file_Link.findUnique({
      where: {
        modelTarget_uuidTarget_purpose: {
          modelTarget,
          uuidTarget,
          purpose,
        },
      },
      include: {
        file: true,
      },
    });
  },
};
