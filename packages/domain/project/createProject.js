import { Project } from "./Project.js";
import * as DomainError from "../errors/index.js";
import { projectRepo } from "@reuc/infrastructure/projectRepo.js";
import { projectTypeRepo } from "@reuc/infrastructure/projectTypeRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Creates a new project
 * @param {object} params
 * @param {string} params.uuidApplication - The UUID of the application being approved.
 * @param {number} params.projectTypeId - Project Type ID. Needed to determine the correct Role for the advisor.
 * @param {string} params.uuidAdvisor - The professor's UUID.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.ConflictError} If a project already exists/is approved.
 * @throws {DomainError.BusinessRuleError} If a invalid business rule.
 * @throws {DomainError.NotFoundError} If related resource does not exist or is
 * deleted (race conditions between the find and update calls).
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function createProject({
  uuidApplication,
  projectTypeId,
  uuidAdvisor,
}) {
  try {
    const newProject = new Project({ uuidApplication });

    const roles = await projectTypeRepo.getProfessorRolesForProjectType(
      Number(projectTypeId) ? Number(projectTypeId) : 0
    );
    if (!roles)
      throw new DomainError.NotFoundError(
        `Project Type with ID ${projectTypeId} could not be found.`,
        { details: { resource: "projectType", identifier: projectTypeId } }
      );

    const hasResearcher = roles.some((c) => c.teamRole.slug === "researcher");
    const advisorRole = hasResearcher ? "researcher" : "advisor";

    return await projectRepo.save(
      newProject.toPrimitives(),
      uuidAdvisor,
      advisorRole
    );
  } catch (err) {
    // 1. Handle Missing Resources (Bubbled up from P2025)
    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        "Related relation (Advisor Role or User) could not be found to create the project.",
        {
          details: {
            resource: "team_role",
            uuidAdvisor,
            slug: advisorRole | "Unknow",
          },
          cause: err,
        }
      );

    // 2. Handle Application already approved (Unique Constraint)
    if (err instanceof InfrastructureError.UniqueConstraintError) {
      const field = err.details?.field || "resource";

      throw new DomainError.ConflictError(
        `A project with this ${field} already exists.`,
        { details: err.details, cause: err }
      );
    }

    // 3. Handle Invalid Application Link (Foreign Key)
    if (err instanceof InfrastructureError.ForeignKeyConstraintError) {
      const field = err.details?.field || "related resource";

      throw new DomainError.BusinessRuleError(
        `The creation of the project failed because the provided '${field}' doest not exist.`,
        { cause: err, details: err.details }
      );
    }

    // 4. Bubble up existing Domain Errors
    if (err instanceof DomainError.DomainError) throw err;

    // 5. Handle Generic Infrastructure Errors
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The creation of the project could not be completed due to a system error.",
        { cause: err }
      );

    // 6. Safety Net
    console.error(`Domain error (createProject):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while creating the project.",
      { cause: err }
    );
  }
}
