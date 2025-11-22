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
