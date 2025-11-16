import { create } from "./create.js";
import { myProjects } from "./myProjects.js";
import { getProjects } from "./getProjects.js";
import { createTeam } from "./createTeam.js";

/**
 * The 'project' entity in the application layer, grouping all project
 * file handling and data agregation.
 */
const project = {
  create,
  myProjects,
  getProjects,
  createTeam,
};

export default project;
