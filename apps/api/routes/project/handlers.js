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
