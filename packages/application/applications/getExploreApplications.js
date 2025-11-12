import * as ApplicationError from "../errors/index.js";
import { validateExploreQuery } from "./validators.js";
import { generateFileTicket } from "@reuc/domain/user/session/generateFileTicket.js";
import { getApplicationsByFaculty } from "@reuc/domain/application/getApplicationsByFaculty.js";
import { getLinksByTargets } from "@reuc/domain/file/getLinksByTargets.js";
import { buildFileUrl } from "@reuc/domain/file/buildFileUrl.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves a paginated list of applications for the "Explore" page,
 * optionally filtered by faculty.
 *
 * @param {string} uuidRequestingUser - The unique identifier for the user requesting the applications.
 * @param {object} tokenConfig - Configuration for tokens.
 * @param {string} tokenConfig.ticketSecret - The secret for the ticket token.
 * @param {object} tokenConfig.ticketExpiresIn - The expiration for the new ticket token.
 * @param {string} tokenConfig.ticketExpiresIn.viewing
 * @param {string} tokenConfig.ticketExpiresIn.download
 * @param {object} options
 * @param {string} [options.faculty] - The faculty name to filter by.
 * @param {number} [options.page] - The page number for pagination.
 * @param {number} [options.perPage] - The number of items per page.
 *
 * @throws {ApplicationError.ValidationError} If query parameters are invalid.
 * @throws {ApplicationError.ApplicationError} For any unexpected errors.
 */
export async function getExploreApplications(
  uuidRequestingUser,
  tokenConfig,
  { faculty, page, perPage }
) {
  validateExploreQuery({ uuidRequestingUser, faculty, page, perPage });

  try {
    // Step 1: Get the primary data from the application domain
    const { records: applications, metadata } = await getApplicationsByFaculty({
      faculty,
      page,
      perPage,
    });

    // Return early on empty set
    if (applications.length === 0) {
      return { records: [], metadata };
    }

    // Step 2: Get the related data from the file domain
    const applicationIds = applications.map((app) => app.uuid_application);
    const bannerLinks = await getLinksByTargets(
      "APPLICATION",
      applicationIds,
      "BANNER"
    );

    // Step 3: Stitch data and create ticketed URLs
    const bannerMap = new Map();
    for (const link of bannerLinks) {
      if (!bannerMap.has(link.uuidTarget)) {
        // 1. Build the base path
        const basePath = buildFileUrl(link);
        if (!basePath) continue;

        // 2. Define the resource identifier from the path
        const fileIdentifier = basePath.substring(1);

        // 3. Generate the ticket
        const ticket = generateFileTicket({
          uuidUser: uuidRequestingUser,
          fileIdentifier,
          audience: "viewing",
          tokenConfig,
        });

        // 4. Set the final URL in the map
        bannerMap.set(link.uuidTarget, `${basePath}?ticket=${ticket}`);
      }
    }

    // Step 4: Stitch the data together
    const applicationsWithBanners = applications.map((app) => ({
      ...app,
      bannerUrl: bannerMap.get(app.uuid_application) || null,
    }));

    return { records: applicationsWithBanners, metadata };
  } catch (err) {
    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(
      `Application Error (application.getExploreApplications):`,
      err
    );
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching applications.",
      { cause: err }
    );
  }
}
