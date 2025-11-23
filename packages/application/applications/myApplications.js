import * as ApplicationError from "../errors/index.js";
import { validateGetApplicationsQuery } from "./validators.js";
import { generateFileTicket } from "@reuc/domain/user/session/generateFileTicket.js";
import { getApplicationsByAuthor } from "@reuc/domain/application/getApplicationsByAuthor.js";
import { getLinksByTargets } from "@reuc/domain/file/getLinksByTargets.js";
import { buildFileUrl } from "@reuc/domain/file/buildFileUrl.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves a paginated list of applications created by the requesting user.
 * @param {string} uuidRequestingUser - The unique identifier for the user.
 * @param {object} tokenConfig - Configuration for tokens.
 * @param {string} tokenConfig.ticketSecret
 * @param {object} tokenConfig.ticketExpiresIn
 * @param {string} tokenConfig.ticketExpiresIn.viewing
 * @param {object} options
 * @param {number} [options.page] - The page number for pagination.
 * @param {number} [options.perPage] - The number of items per page.
 *
 * @throws {ApplicationError.ValidationError} If query parameters are invalid.
 * @throws {ApplicationError.ApplicationError} For any unexpected errors.
 */
export async function myApplications(
  uuidRequestingUser,
  tokenConfig,
  { page, perPage }
) {
  validateGetApplicationsQuery({ uuidRequestingUser, page, perPage });

  try {
    // Step 1: Get the primary data from the project domain
    const { records: applications, metadata } = await getApplicationsByAuthor({
      uuidAuthor: uuidRequestingUser,
      page,
      perPage,
    });

    if (applications.length === 0) {
      return { records: [], metadata };
    }

    // Step 2: Get related file data (identical logic to getProjects)
    const applicationIds = applications.map((p) => p.uuid_application);
    const bannerLinks = await getLinksByTargets(
      "APPLICATION",
      applicationIds,
      "BANNER"
    );

    // Step 3: Stitch data and create ticketed URLs (identical logic)
    const bannerMap = new Map();
    for (const link of bannerLinks) {
      if (!bannerMap.has(link.uuidTarget)) {
        const basePath = buildFileUrl(link);
        if (!basePath) continue;

        const fileIdentifier = basePath.substring(1);
        const ticket = generateFileTicket({
          uuidUser: uuidRequestingUser,
          fileIdentifier,
          audience: "viewing",
          tokenConfig,
        });

        bannerMap.set(link.uuidTarget, `${basePath}?ticket=${ticket}`);
      }
    }

    // Step 4: Combine the data (identical logic)
    const applicationsWithBanners = applications.map((project) => ({
      uuid_application: project.uuid_application,
      title: project.title,
      shortDescription: project.shortDescription,
      status: project.applicationStatus,
      bannerUrl: bannerMap.get(project.uuid_application) || null,
    }));

    return { records: applicationsWithBanners, metadata };
  } catch (err) {
    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (application.myApplications):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching your applications.",
      { cause: err }
    );
  }
}
