import profile from "@reuc/application/profile/index.js";
import { ValidationError } from "@reuc/application/errors/ValidationError.js";

export async function editProfileHandler(req, res) {
  try {
    const user = req.user;
    const outsider = req.outsider;

    const response = await profile.update({
      uuidOutsider: outsider.uuid_outsider,
      uuidUser: user.uuid_user,
      body: req.body,
    });

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    const code = err instanceof ValidationError ? 422 : 400;

    return res.status(code).json({ success: false, err: err.message });
  }
}

export async function getProfileHandler(req, res) {
  try {
    const user = req.user;
    const outsider = req.outsider;

    const response = await profile.getByUuids({
      uuidOutsider: outsider.uuid_outsider,
      uuidUser: user.uuid_user,
    });

    return res.status(200).json({
      success: true,
      data: response.profile,
    });
  } catch (err) {
    const code = err instanceof ValidationError ? 422 : 400;

    return res.status(code).json({ success: false, err: err.message });
  }
}

export async function getProfileStatusHandler(req, res) {
  try {
    const outsider = req.outsider;

    const status = await profile.checkProfileStatus({
      uuidOutsider: outsider.uuid_outsider,
    });

    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (err) {
    const code = err instanceof ValidationError ? 404 : 400;

    return res.status(code).json({ success: false, err: err.message });
  }
}
