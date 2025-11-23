/**
 * Helper to flatten the nested project object.
 * Merges 'application' properties into the root project object.
 * @param {object} rawProject
 * @param {string} rawProject.uuid_project
 * @param {string} rawProject.uuidApplication
 * @param {object} rawProject.projectStatus
 * @param {string} rawProject.projectStatus.name
 * @param {string} rawProject.projectStatus.slug
 * @param {object} rawProject.application
 * @param {string} rawProject.application.title
 * @param {string} rawProject.application.shortDescription
 */
export function flattenProjectData(rawProject) {
  if (!rawProject) return null;
  const { application, ...projectData } = rawProject;

  return {
    ...projectData,
    title: application?.title,
    shortDescription: application?.shortDescription,
  };
}
