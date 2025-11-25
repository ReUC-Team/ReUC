import config from "../../config/index.js";
import project from "@reuc/application/project/index.js";

/**
 * Handles the creation/aprove of a project/application
 */
export async function createProjectHandler(req, res) {
  const user = req.user;

  const { project: applicationData } = await project.create({
    uuidRequestingUser: user.uuid_user,
    body: req.body,
  });

  return res.status(201).json({
    success: true,
    data: { project: applicationData },
  });
}

/**
 * Handles fetching a paginated list of projects.
 */
export async function getProjectsHandler(req, res) {
  const user = req.user;
  const { page, perPage } = req.query;

  const projects = await project.getProjects(user.uuid_user, config.jwt, {
    page,
    perPage,
  });

  return res.status(200).json({
    success: true,
    data: {
      projects,
    },
  });
}

/**
 * Handles fetching a paginated list of user-requesting projects.
 */
export async function getMyProjectsHandler(req, res) {
  const user = req.user;
  const { page, perPage } = req.query;

  const projects = await project.myProjects(user.uuid_user, config.jwt, {
    page,
    perPage,
  });

  return res.status(200).json({
    success: true,
    data: {
      projects,
    },
  });
}

/**
 * Handles the creation/aprove of a project/application
 */
export async function createProjectTeamHandler(req, res) {
  const { uuid } = req.params;

  const result = await project.createTeam({
    uuidProject: uuid,
    body: req.body,
  });

  return res.status(201).json({
    success: true,
    data: result,
  });
}

/**
 * Handles fetching the metadata required for the team creation form.
 */
export async function getTeamCreationFormDataHandler(req, res) {
  const { uuid } = req.params;

  const result = await project.getTeamCreationFormData(uuid);

  return res.status(200).json({
    success: true,
    data: result,
  });
}

/**
 * Handles fetching a single, detailed project by its UUID.
 */
export async function getDetailedProjectHandler(req, res) {
  const user = req.user;
  const { uuid } = req.params;

  const detailedProject = await project.getDetailedProject(
    user.uuid_user,
    config.jwt,
    uuid
  );

  return res.status(200).json({
    success: true,
    data: {
      project: detailedProject,
    },
  });
}

/**
 * Handles the update of a team member
 */
export async function updateTeamMemberHandler(req, res) {
  const { uuid: uuidProject, uuidUser } = req.params;

  const { teamMember } = await project.updateTeamMember(
    uuidProject,
    uuidUser,
    req.body
  );

  return res.status(200).json({
    success: true,
    data: { teamMember },
  });
}

/**
 * Handles the removal of a team member.
 */
export async function deleteTeamMemberHandler(req, res) {
  const { uuid: uuidProject, uuidUser } = req.params;

  await project.deleteTeamMember(uuidProject, uuidUser);

  return res.status(200).json({
    success: true,
    data: {},
    message: "Team member removed successfully.",
  });
}

/**
 * Handles the starting of the project.
 */
export async function startProjectHandler(req, res) {
  const user = req.user;
  const { uuid: uuidProject } = req.params;

  const { project: projectData } = await project.start(
    uuidProject,
    user.uuid_user
  );

  return res.status(201).json({
    success: true,
    data: { project: projectData },
  });
}

/**
 * Handles the rollback of a project to application status.
 */
export async function rollbackProjectHandler(req, res) {
  const user = req.user;
  const { uuid: uuidProject } = req.params;

  await project.rollback(uuidProject, user.uuid_user);

  return res.status(200).json({
    success: true,
    data: {},
    message: "Project successfully rolled back to Application.",
  });
}

/**
 * Handles the update of the deadline of a project.
 */
export async function updateDeadlineProjectHandler(req, res) {
  const { uuid: uuidProject } = req.params;

  const { project: projectData } = await project.updateDeadline({
    uuidProject,
    body: req.body,
  });

  return res.status(200).json({
    success: true,
    data: { project: projectData },
  });
}

/**
 * Handles the upload of a file for a project.
 */
export async function uploadProjectResourceFileHandler(req, res) {
  const { uuid: uuidProject } = req.params;

  const { resource } = await project.uploadFile({
    uuidProject,
    uuidRequestingUser: req.user.uuid_user,
    file: req.file || undefined,
  });

  return res.status(201).json({
    success: true,
    data: { resource },
  });
}

/**
 * Handles the edit of a project file.
 */
export async function editProjectResourceFileHandler(req, res) {
  const { uuid: uuidProject, uuidResource } = req.params;

  const { resource } = await project.editFile({
    uuidProject,
    uuidRequestingUser: req.user.uuid_user,
    uuidResource,
    file: req.file || undefined,
  });

  return res.status(200).json({
    success: true,
    data: { resource },
  });
}

/**
 * Handles the delete of a project file.
 */
export async function deleteProjectResourceFileHandler(req, res) {
  const { uuid: uuidProject, uuidResource } = req.params;

  await project.deleteFile({
    uuidProject,
    uuidRequestingUser: req.user.uuid_user,
    uuidResource,
  });

  return res.status(200).json({
    success: true,
    data: {},
    message: "Project resource deleted successfully.",
  });
}
