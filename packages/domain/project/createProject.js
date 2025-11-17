import { Project } from "./Project.js";
import * as DomainError from "../errors/index.js";
import { projectRepo } from "@reuc/infrastructure/projectRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Creates a new project
 * @param {object} params
 * @param {string} params.uuidApplication - The UUID of the application being approved.
 * @param {object} params.project - The core data for the project.
 * @param {string} params.project.title - The main title of the project.
 * @param {string} params.project.shortDescription - A brief, one-sentence summary.
 * @param {string} params.project.description - A detailed description of the project's problem and solution.
 * @param {string|number} [params.project.estimatedEffortHours] - The project estimated hours to be complete.
 * @param {string|Date} params.project.estimatedDate - The project estimated date in 'YYYY-MM-DD' format.
 * @param {string|number} params.project.projectTypeId - A single ID for associated project type.
 * @param {string|number|Array<string|number>} [params.project.problemType] - A single ID or array of IDs for associated problem types.
 * @param {string|number|Array<string|number>} [params.project.faculty] - A single ID or array of IDs for associated faculties.
 * @param {string} [params.project.problemTypeOther] - A user-defined problem type if 'other' is selected.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.BusinessRuleError} If a invalid business rule.
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function createProject({ uuidApplication, project }) {
  try {
    const newProject = new Project({
      ...project,
      uuidApplication: uuidApplication,
      projectFaculty: project.faculty,
      projectProblemType: project.problemType,
      projectCustomProblemType: project.problemTypeOther,
    });

    return await projectRepo.save(newProject.toPrimitives());
  } catch (err) {
    if (err instanceof InfrastructureError.ForeignKeyConstraintError) {
      const field = err.details?.field || "related resource";

      throw new DomainError.BusinessRuleError(
        `The creation of the project failed because the provided '${field}' doest not exist.`,
        { cause: err, details: err.details }
      );
    }

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The creation of the project could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (createProject):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while creating the project.",
      { cause: err }
    );
  }
}
