import config from "../../config/index.js";
import project from "@reuc/application/project/index.js";

/**
 * Handles the creation/aprove of a project/application
 */
export async function createProjectHandler(req, res) {
  const { project: applicationData } = await project.create({ body: req.body });

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
