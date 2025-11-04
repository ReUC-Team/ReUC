import * as ApplicationError from "../errors/index.js";
import * as DomainError from "@reuc/domain/errors/index.js";
import { getAllFaculties } from "@reuc/domain/faculty/getAllFaculties.js";

/**
 * Retrieves metadata for the application "Explore" page filters.
 *
 * @throws {ApplicationError.ApplicationError} For any unexpected errors.
 */
export async function getExploreFilters() {
  try {
    const faculties = await getAllFaculties();
    return {
      metadata: {
        faculties,
      },
    };
  } catch (err) {
    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (application.getExploreFilters):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching filter data.",
      { cause: err }
    );
  }
}
