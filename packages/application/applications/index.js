import { create } from "./create.js";
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
  getCreationFormData,
  getExploreApplications,
  getExploreFilters,
  getDetailedApplication,
  myApplications,
};

export default applications;
