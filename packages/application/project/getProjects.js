import * as ApplicationError from "../errors/index.js";
import { validateGetProjectsQuery } from "./validators.js";
import { flattenProjectData } from "./utils.js";
import { generateFileTicket } from "@reuc/domain/user/session/generateFileTicket.js";
import { getProjects as getProjectsDomain } from "@reuc/domain/project/getProjects.js";
import { getLinksByTargets } from "@reuc/domain/file/getLinksByTargets.js";
import { buildFileUrl } from "@reuc/domain/file/buildFileUrl.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves a paginated list of all projects.
 * @param {string} uuidRequestingUser - The unique identifier for the user making the request.
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
export async function getProjects(
  uuidRequestingUser,
  tokenConfig,
  { page, perPage }
) {
  validateGetProjectsQuery({ uuidRequestingUser, page, perPage });

  try {
    // Step 1: Get the primary data from the project domain
    const { records: rawProjects, metadata } = await getProjectsDomain({
      page,
      perPage,
    });

    // Return early on empty set
    if (rawProjects.length === 0) {
      return { records: [], metadata };
    }

    // Step 1.5: Flatten the data
    const projects = rawProjects.map(flattenProjectData);

    // Step 2: Get related file data
    const applicationIds = projects.map((p) => p.uuidApplication);
    const bannerLinks = await getLinksByTargets(
      "APPLICATION",
      applicationIds,
      "BANNER"
    );

    // Step 3: Stitch data and create ticketed URLs
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

    // Step 4: Combine the data
    const projectsWithBanners = projects.map((project) => ({
      uuid_project: project.uuid_project,
      uuid_application: project.uuidApplication,
      title: project.title,
      shortDescription: project.shortDescription,
      status: project.projectStatus,
      bannerUrl: bannerMap.get(project.uuidApplication) || null,
    }));

    return { records: projectsWithBanners, metadata };
  } catch (err) {
    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (project.getProjects):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching projects.",
      { cause: err }
    );
  }
}
