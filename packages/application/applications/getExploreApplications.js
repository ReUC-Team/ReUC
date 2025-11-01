import * as ApplicationError from "../errors/index.js";
import { validateExploreQuery } from "./validators.js";
import { getApplicationsByFaculty } from "@reuc/domain/application/getApplicationsByFaculty.js";
import { getLinksByTargets } from "@reuc/domain/file/getLinksByTargets.js";
import { buildFileUrl } from "@reuc/domain/file/buildFileUrl.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves a paginated list of applications for the "Explore" page,
 * optionally filtered by faculty.
 *
 * @param {object} params
 * @param {string} [params.faculty] - The faculty name to filter by.
 * @param {number} [params.page] - The page number for pagination.
 * @param {number} [params.perPage] - The number of items per page.
 *
 * @throws {ApplicationError.ValidationError} If query parameters are invalid.
 * @throws {ApplicationError.ApplicationError} For any unexpected errors.
 */
export async function getExploreApplications({ faculty, page, perPage }) {
  validateExploreQuery({ faculty, page, perPage });

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

    // Step 3: Use the domain helper to apply business logic
    const bannerMap = new Map();
    for (const link of bannerLinks) {
      // Only add the banner if this application ID hasn't been seen yet
      if (!bannerMap.has(link.uuidTarget)) {
        bannerMap.set(link.uuidTarget, buildFileUrl(link));
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
