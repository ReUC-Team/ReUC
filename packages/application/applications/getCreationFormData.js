import * as ApplicationError from "../errors/index.js";
import * as DomainError from "@reuc/domain/errors/index.js";
import { getAllFaculties } from "@reuc/domain/faculty/getAllFaculties.js";
import { getAllProjectTypes } from "@reuc/domain/projectType/getAllProjectTypes.js";
import { getPredefinedProblemTypes } from "@reuc/domain/problemType/getPredefinedProblemTypes.js";
import { getAssetApplicationBanners } from "@reuc/domain/file/getAssetApplicationBanners.js";

/**
 * Retrieves all metadata required to populate the "Create Application" form.
 *
 * @throws {ApplicationError.ApplicationError} For any unexpected errors during data fetching.
 */
export async function getCreationFormData() {
  try {
    const [projectTypes, faculties, problemTypes, defaultBanners] =
      await Promise.all([
        getAllProjectTypes(),
        getAllFaculties(),
        getPredefinedProblemTypes(),
        getAssetApplicationBanners(),
      ]);

    const defaultBannerURLs = defaultBanners.map((b) => {
      return {
        name: b.originalName,
        uuid: b.uuid_file,
        url: `/file/public/${b.uuid_file}`,
      };
    });

    return {
      metadata: {
        faculties,
        projectTypes,
        problemTypes,
        defaultBanners: defaultBannerURLs,
      },
    };
  } catch (err) {
    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (application.getCreationFormData):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching form data.",
      { cause: err }
    );
  }
}
