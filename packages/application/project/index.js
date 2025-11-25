import { create } from "./create.js";
import { myProjects } from "./myProjects.js";
import { getProjects } from "./getProjects.js";
import { createTeam } from "./createTeam.js";
import { getTeamCreationFormData } from "./getTeamCreationFormData.js";
import { getDetailedProject } from "./getDetailedProject.js";
import { updateTeamMember } from "./updateTeamMember.js";
import { deleteTeamMember } from "./deleteTeamMember.js";
import { start } from "./start.js";
import { rollback } from "./rollback.js";
import { updateDeadline } from "./updateDeadline.js";
import { uploadFile } from "./uploadFile.js";
import { editFile } from "./editFile.js";
import { deleteFile } from "./deleteFile.js";

/**
 * The 'project' entity in the application layer, grouping all project
 * file handling and data agregation.
 */
const project = {
  create,
  start,
  rollback,
  myProjects,
  getProjects,
  createTeam,
  getTeamCreationFormData,
  getDetailedProject,
  updateTeamMember,
  deleteTeamMember,
  updateDeadline,
  uploadFile,
  editFile,
  deleteFile,
};

export default project;
