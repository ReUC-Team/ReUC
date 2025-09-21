import application from "@reuc/application/applications/index.js";

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

export async function getApplicationMetadataHandler(req, res) {
  try {
    const response = await application.getMetadata();

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
