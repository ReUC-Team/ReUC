import application from "@reuc/application/applications/index.js";

// TODO: if outsider session expires, then save the form data and the
// URL action that tried to achieve, in order to use after confirm login.
// Give much thought about it like how to manage if the user dont try to
// login after receive error for a while.

/**
 * Handles the creation of a new application.
 */
export async function createApplicationHandler(req, res) {
  const { application: applicationData } = await application.create({
    uuidAuthor: req.role.uuid,
    body: req.body,
    file: req.file, // checkout index.js for more details
  });

  return res.status(201).json({
    success: true,
    data: { application: applicationData },
  });
}

/**
 * Handles fetching the metadata required for the application creation form.
 */
export async function getCreationFormDataHandler(req, res) {
  const { metadata } = await application.getCreationFormData();

  return res.status(200).json({
    success: true,
    data: {
      metadata,
    },
  });
}

/**
 * Handles fetching a paginated list of applications, optionally filtered by faculty.
 */
export async function getExploreApplicationsHandler(req, res) {
  const { faculty } = req.params;
  const { page, perPage } = req.query;

  const { applications } = await application.getExploreApplications({
    faculty,
    page,
    perPage,
  });

  return res.status(200).json({
    success: true,
    data: {
      applications,
    },
  });
}

/**
 * Handles fetching the metadata required for the application exploration page.
 */
export async function getExploreFiltersHandler(req, res) {
  const { metadata } = await application.getExploreFilters();

  return res.status(200).json({
    success: true,
    data: {
      metadata,
    },
  });
}
