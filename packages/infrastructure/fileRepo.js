import { db, isPrismaError } from "./db/client.js";
import DatabaseError from "./errors/DatabaseError.js";
import InfrastructureError from "./errors/InfrastructureError.js";

export const fileRepo = {
  /**
   * Gets all asset (public) BANNERS to be used by APPLICATION.
   *
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async getAssetApplicationBanners() {
    try {
      return await db.file.findMany({
        where: {
          storedName: { contains: "application-banner" },
          isAsset: true,
        },
        select: { uuid_file: true, originalName: true },
        orderBy: { originalName: "asc" },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying public asset files: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (fileRepo.getAssetApplicationBanners):`,
        err
      );
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying public asset files",
        { cause: err }
      );
    }
  },
  /**
   * Gets a single asset file by its UUID.
   * @param {string} uuidFile - The UUID of the file to retrieve.
   *
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async getAssetByUuid(uuidFile) {
    try {
      return await db.file.findFirst({
        where: { uuid_file: uuidFile, isAsset: true },
        select: {
          uuid_file: true,
          originalName: true,
          storedPath: true,
          mimetype: true,
          fileSize: true,
        },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying a public asset file: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (fileRepo.getAssetByUuid) with UUID ${uuidFile} :`,
        err
      );
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying a public asset file",
        { cause: err }
      );
    }
  },
  /**
   * Get file for a unique target UUID and specific purpose.
   * The result will be the first record found.
   * @param {string} modelTarget - The name of the model.
   * @param {string} uuidTarget - The UUID of the model related.
   * @param {string} purpose - The purpose of the file linked to the model.
   * @param {string} [uuidFile] - The UUID of the specific file (required for "many" cardinality).
   *
   * @throws {DatabaseError} For other unexpected errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async getFileByTarget(
    modelTarget,
    uuidTarget,
    purpose,
    uuidFile = undefined
  ) {
    const whereClause = {
      modelTarget,
      uuidTarget,
      purpose,
      deletedAt: null,
    };

    if (uuidFile) {
      whereClause.file = {
        uuid_file: uuidFile,
      };
    }

    try {
      const link = await db.file_Link.findFirst({
        where: whereClause,
        select: {
          file: {
            select: {
              uuid_file: true,
              originalName: true,
              storedPath: true,
              mimetype: true,
              fileSize: true,
            },
          },
        },
      });

      return link?.file || null;
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying file link: ${err.message}`,
          { cause: err }
        );

      const context = JSON.stringify({ modelTarget, uuidTarget, purpose });
      console.error(
        `Infrastructure error (fileRepo.getFileByTarget) with CONTEXT ${context} :`,
        err
      );
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying file link",
        { cause: err }
      );
    }
  },
  /**
   * Gets file links for a list of target UUIDs and a specific purpose.
   * @param {string} modelTarget - The model name (e.g., "APPLICATION").
   * @param {string[]} targetUuids - An array of UUIDs (e.g., application UUIDs).
   * @param {string} purpose - The purpose (e.g., "BANNER").
   */
  async getLinksByTargets(modelTarget, targetUuids, purpose) {
    try {
      return await db.file_Link.findMany({
        where: {
          modelTarget,
          purpose,
          uuidTarget: { in: targetUuids },
          deletedAt: null,
        },
        select: { uuidTarget: true, modelTarget: true, purpose: true },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying file links: ${err.message}`,
          { cause: err }
        );

      const context = JSON.stringify({ modelTarget, targetUuids, purpose });
      console.error(
        `Infrastructure error (fileRepo.getLinksByTargets) with CONTEXT ${context} :`,
        err
      );
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying file links",
        { cause: err }
      );
    }
  },
  /**
   * Gets all file links, including nested file metadata (name, size, type),
   * for a single target UUID.
   * This is used to build the JSON response for a detailed view.
   *
   * @param {string} targetUuid - The UUID of the target (e.g., an application UUID).
   *
   * @throws {DatabaseError} For unexpected prisma errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async getLinksAndMetadataByTarget(targetUuid) {
    try {
      return await db.file_Link.findMany({
        where: { uuidTarget: targetUuid, deletedAt: null },
        select: {
          modelTarget: true,
          purpose: true,
          uuidTarget: true,
          author: {
            select: {
              uuid_user: true,
            },
          },
          file: {
            select: {
              uuid_file: true,
              originalName: true,
              fileSize: true,
              mimetype: true,
            },
          },
        },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying file links with metadata: ${err.message}`,
          { cause: err }
        );

      const context = JSON.stringify({ targetUuid });
      console.error(
        `Infrastructure error (fileRepo.getLinksAndMetadataByTarget) with CONTEXT ${context} :`,
        err
      );
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying file links",
        { cause: err }
      );
    }
  },
};
