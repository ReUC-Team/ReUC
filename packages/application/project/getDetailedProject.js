import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { generateFileTicket } from "@reuc/domain/user/session/generateFileTicket.js";
import { getDetailedProject as getProjectDomain } from "@reuc/domain/project/getDetailedProject.js";
import { getLinksByTarget } from "@reuc/domain/file/getLinksByTarget.js";
import { buildFileUrl } from "@reuc/domain/file/buildFileUrl.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves a fully detailed project, including author details, banner,
 * and attachments, formatted for the client.
 *
 * @param {string} uuidRequestingUser - The unique identifier for the user requesting the project.
 * @param {object} tokenConfig - Configuration for tokens.
 * @param {string} tokenConfig.ticketSecret - The secret for the ticket token.
 * @param {object} tokenConfig.ticketExpiresIn - The expiration for the new ticket token.
 * @param {string} tokenConfig.ticketExpiresIn.viewing
 * @param {string} tokenConfig.ticketExpiresIn.download
 * @param {string} projectUuid - The UUID of the project to retrieve.
 *
 * @throws {ApplicationError.ValidationError} If the data fails validations.
 * @throws {ApplicationError.NotFoundError} If the project cannot be found.
 * @throws {ApplicationError.ApplicationError} - For other unexpected domain errors.
 */
export async function getDetailedProject(
  uuidRequestingUser,
  tokenConfig,
  projectUuid
) {
  const allErrors = validateUuid(projectUuid, "projectUuid");
  if (allErrors.length > 0)
    throw new ApplicationError.ValidationError("Input validation failed.", {
      details: allErrors,
    });

  try {
    // Step 1: Fetch Project Data first
    const projectData = await getProjectDomain(projectUuid);

    // Step 2: Fetch Files using the related application UUID
    const appUuid = projectData.uuidApplication;
    const fileLinks = await getLinksByTarget(appUuid);

    // Step 3: Normalize and separate the data.
    const author = _normalizeAuthor(projectData.application.author);
    const details = _normalizeDetails(projectData);
    const { bannerUrl, attachments } = _normalizeFiles(
      uuidRequestingUser,
      tokenConfig,
      fileLinks
    );

    // Step 4: Stitch the final DTO.
    return {
      author,
      details,
      bannerUrl,
      appAttachments: attachments,
      // TODO: In the future, merge with project.attachments here
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

    console.error(`Application Error (project.getDetailedProject):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching the project.",
      { cause: err }
    );
  }
}

/**
 * @private
 * Normalize the author data from the domain model.
 * @param {object} author - The 'user' object from the domain.
 */
function _normalizeAuthor(author) {
  if (!author) return null;

  const { uuid_user, email, firstName, middleName, lastName } = author;
  const { professor, outsider } = author;

  const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");

  let universityId = null;
  let roleName = null;
  if (professor) {
    universityId = professor.universityId;
    roleName = professor.professorRole?.name || "professor";
  } else if (outsider) {
    roleName = "outsider";
  }

  return {
    uuid_user: uuid_user,
    fullName,
    email,
    universityId,
    roleName,
    outsider: outsider
      ? {
          organizationName: outsider?.organizationName,
          phoneNumber: outsider?.phoneNumber,
          location: outsider?.location,
        }
      : null,
  };
}

/**
 * @private
 * Normalize the main project details.
 * @param {object} appData - The full project data from the domain.
 */
function _normalizeDetails(projectData) {
  // Define source of truth for "Definition" data
  const appSource = projectData.application || {};

  // Flatten the many-to-many relationships
  const faculties = (appSource?.applicationFaculty || []).map((f) => ({
    id: f.facultyTypeId.faculty_id,
    name: f.facultyTypeId.name,
  }));
  const problemTypes = (appSource?.applicationProblemType || []).map((pt) => ({
    id: pt.problemTypeId.problem_type_id,
    name: pt.problemTypeId.name,
  }));
  const projectTypes = (appSource?.applicationProjectType || []).map((pt) => ({
    id: pt.projectTypeId.project_type_id,
    name: pt.projectTypeId.name,
    minEstimatedMonths: pt.projectTypeId.minEstimatedMonths,
    maxEstimatedMonths: pt.projectTypeId.maxEstimatedMonths,
    requiredHours: pt.projectTypeId.requiredHours,
  }));
  const teamMembers = (projectData?.teamMembers || []).map((tm) => {
    const user = tm.user;

    return {
      uuid_user: user.uuid_user,
      fullName: [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(" "),
      email: user.email,
      universityId:
        user.student?.universityId || user.professor?.universityId || null,
      role: tm.role.name,
    };
  });

  return {
    title: appSource.title,
    shortDescription: appSource.shortDescription,
    description: appSource.description,
    deadline: appSource.deadline,
    uuidCreator: projectData.uuidCreator,
    status: projectData.projectStatus,
    createdAt: appSource.createdAt,
    approvedAt: projectData.createdAt,
    projectTypes,
    faculties,
    problemTypes,
    teamMembers,
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
