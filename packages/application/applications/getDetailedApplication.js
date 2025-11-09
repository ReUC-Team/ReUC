import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { generateFileTicket } from "@reuc/domain/user/session/generateFileTicket.js";
import { getDetailedApplication as getAppDomain } from "@reuc/domain/application/getDetailedApplication.js";
import { getLinksByTarget } from "@reuc/domain/file/getLinksByTarget.js";
import { buildFileUrl } from "@reuc/domain/file/buildFileUrl.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves a fully detailed application, including author details, banner,
 * and attachments, formatted for the client.
 *
 * @param {string} uuidUser - The unique identifier for the user requesting the application.
 * @param {object} tokenConfig - Configuration for tokens.
 * @param {string} tokenConfig.ticketSecret - The secret for the ticket token.
 * @param {object} tokenConfig.ticketExpiresIn - The expiration for the new ticket token.
 * @param {string} tokenConfig.ticketExpiresIn.viewing
 * @param {string} tokenConfig.ticketExpiresIn.download
 * @param {string} applicationUuid - The UUID of the application to retrieve.
 *
 * @throws {ApplicationError.ValidationError} If the data fails validations.
 * @throws {ApplicationError.NotFoundError} If the application cannot be found.
 * @throws {ApplicationError.ApplicationError} - For other unexpected domain errors.
 */
export async function getDetailedApplication(
  uuidUser,
  tokenConfig,
  applicationUuid
) {
  const allErrors = validateUuid(applicationUuid, "applicationUuid");
  if (allErrors.length > 0) {
    throw new ApplicationError.ValidationError("Input validation failed.", {
      details: allErrors,
    });
  }

  try {
    // Step 1: Concurrently fetch primary data and related data.
    const [applicationData, fileLinks] = await Promise.all([
      getAppDomain(applicationUuid),
      getLinksByTarget(applicationUuid),
    ]);

    // Step 2: Normalize and separate the data.
    const author = _normalizeAuthor(applicationData.outsider);
    const details = _normalizeDetails(applicationData);
    const { bannerUrl, attachments } = _normalizeFiles(
      uuidUser,
      tokenConfig,
      fileLinks
    );

    // Step 3: Stitch the final DTO (Data Transfer Object).
    return {
      author,
      details,
      bannerUrl,
      attachments,
    };
  } catch (err) {
    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(
      `Application Error (application.getDetailedApplication):`,
      err
    );
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching the application.",
      { cause: err }
    );
  }
}

/**
 * @private
 * Normalize the author data from the domain model.
 * @param {object} outsider - The 'outsider' object from the domain.
 */
function _normalizeAuthor(outsider) {
  if (!outsider) return null; // Or some default author object

  const { user, organizationName, phoneNumber, location } = outsider;
  const fullName = [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ");

  return {
    uuid_user: user.uuid_user,
    fullName,
    organizationName,
    phoneNumber,
    location,
  };
}

/**
 * @private
 * Normalize the main application details.
 * @param {object} appData - The full application data from the domain.
 */
function _normalizeDetails(appData) {
  // Flatten the many-to-many relationships
  const projectTypes = appData.applicationProjectType.map(
    (pt) => pt.projectTypeId.name
  );
  const faculties = appData.applicationFaculty.map((f) => f.facultyTypeId.name);
  const problemTypes = appData.applicationProblemType.map(
    (pt) => pt.problemTypeId.name
  );

  return {
    title: appData.title,
    shortDescription: appData.shortDescription,
    description: appData.description,
    deadline: appData.deadline,
    projectTypes,
    faculties,
    problemTypes,
  };
}

/**
 * @private
 * Normalize file links into a banner URL and attachment list.
 * @param {Array<object>} fileLinks - The list of file links from the domain.
 */
function _normalizeFiles(uuidUser, tokenConfig, fileLinks) {
  let bannerUrl = null;

  // 1. Find the first BANNER link
  const bannerLink = fileLinks.find((link) => link.purpose === "BANNER");

  if (bannerLink) {
    const basePath = buildFileUrl(bannerLink);
    if (basePath) {
      const fileIdentifier = basePath.substring(1);
      const ticket = generateFileTicket({
        uuidUser: uuidUser,
        fileIdentifier,
        audience: "viewing",
        tokenConfig,
      });
      bannerUrl = `${basePath}?ticket=${ticket}`;
    }
  }

  // 2. Map all ATTACHMENT links
  const attachments = fileLinks
    .filter((link) => link.purpose === "ATTACHMENT")
    .map((link) => {
      const basePath = buildFileUrl(link);
      if (!basePath) return null;

      const fileIdentifier = basePath.substring(1);
      const ticket = generateFileTicket({
        uuidUser: uuidUser,
        fileIdentifier,
        audience: "download",
        tokenConfig,
      });

      return {
        downloadUrl: `${basePath}?ticket=${ticket}`,
        name: link.file.originalName,
        size: link.file.fileSize,
        type: link.file.mimetype,
      };
    })
    .filter(Boolean); // Remove any nulls from failed buildFileUrl calls

  return { bannerUrl, attachments };
}
