import { create } from "./create.js";
import { update } from "./update.js";
import { deleteApplication } from "./deleteApplication.js";
import { getCreationFormData } from "./getCreationFormData.js";
import { getExploreApplications } from "./getExploreApplications.js";
import { getExploreFilters } from "./getExploreFilters.js";
import { getDetailedApplication } from "./getDetailedApplication.js";
import { myApplications } from "./myApplications.js";

/**
 * The 'applications' entity in the application layer, grouping all applications
 * file handling and data agregation.
 */
const applications = {
  create,
  update,
  delete: deleteApplication,
  getCreationFormData,
  getExploreApplications,
  getExploreFilters,
  getDetailedApplication,
  myApplications,
};

export default applications;
