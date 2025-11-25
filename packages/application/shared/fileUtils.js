import { generateFileTicket } from "@reuc/domain/user/session/generateFileTicket.js";
import { buildFileUrl } from "@reuc/domain/file/buildFileUrl.js";

/**
 * Maps a raw file link to a normalized DTO with a secure access ticket.
 * Used for attachments and resources across the application.
 * @param {object} link - The file link object from the database/repository.
 * @param {object} link.file
 * @param {string} link.file.uuid_file - The unique identifier of the file.
 * @param {string} link.file.originalName - The original name of the file.
 * @param {number} link.file.fileSize - The size of the file in bytes.
 * @param {string} link.file.mimetype - The MIME type of the file.
 * @param {string} link.modelTarget - The type of model the file is linked to.
 * @param {string} link.uuidTarget - The UUID of the target entity the file is linked to.
 * @param {string} link.purpose - The purpose or category of the file attachment.
 * @param {object} link.author
 * @param {string} link.author.uuid_user - The unique identifier of the file author.
 * @param {string} uuidUser - The UUID of the user requesting access.
 * @param {object} tokenConfig - Token configuration for ticket generation.
 * @param {"viewing"|"download"} audience - The intended use (viewing vs download).
 */
export function mapFileLink(link, uuidUser, tokenConfig, audience) {
  const basePath = buildFileUrl(link);
  if (!basePath) return null;

  const fileIdentifier = basePath.substring(1);
  const ticket = generateFileTicket({
    uuidUser: uuidUser,
    fileIdentifier,
    audience,
    tokenConfig,
  });

  return {
    uuid_file: link.file.uuid_file,
    downloadUrl: `${basePath}?ticket=${ticket}`,
    name: link.file.originalName,
    size: link.file.fileSize,
    type: link.file.mimetype,
  };
}
