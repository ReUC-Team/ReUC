import application from "@reuc/application/applications/index.js";
import { ValidationError } from "@reuc/application/errors/ValidationError.js";

/** TODO: if outsider session expires, then save the form data and the
 * URL action that tried to achieve, in order to use after confirm login.
 * Give much thought about it like how to manage if the user dont try to
 * login after receive error for a while.
 */
export async function createApplicationHandler(req, res) {
  try {
    const response = await application.create({
      uuidAuthor: req.outsider.uuid_outsider,
      body: req.body,
      file: req.file, // checkout index.js for more details
    });

    return res.status(201).json({
      success: true,
      data: {
        application: response.application,
      },
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, err: `${err.message} ${err.stack}` });
  }
}

export async function getCreateApplicationMetadataHandler(req, res) {
  try {
    const response = await application.createMetadata();

    return res.status(200).json({
      success: true,
      data: {
        metadata: response.metadata,
      },
    });
  } catch (err) {
    return res.status(404).json({ success: false, err: err.message });
  }
}

export async function getApplicationsByFacultyHandler(req, res) {
  try {
    const { faculty } = req.params;
    const { page, perPage } = req.query;

    const { applications } = await application.getByFaculty({
      faculty: faculty || "",
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 25,
    });

    return res.status(201).json({
      success: true,
      data: {
        applications,
      },
    });
  } catch (err) {
    const code = err instanceof ValidationError ? 400 : 500;

    return res.status(code).json({ success: false, err: err.message });
  }
}

export async function getExploreApplicationsMetadataHandler(req, res) {
  try {
    const { metadata } = await application.exploreMetadata();

    return res.status(200).json({
      success: true,
      data: {
        metadata,
      },
    });
  } catch (err) {
    return res.status(404).json({ success: false, err: err.message });
  }
}
