import profile from "@reuc/application/profile/index.js";

/**
 * Handles updating the user's and outsider's profile information.
 */
export async function editProfileHandler(req, res) {
  const user = req.user;
  const outsider = req.role;

  const { profile: updatedProfile } = await profile.update({
    uuidUser: user.uuid_user,
    uuidOutsider: outsider.uuid,
    body: req.body,
  });

  return res.status(200).json({
    success: true,
    data: { profile: updatedProfile },
  });
}

/**
 * Handles fetching the combined user and outsider profile.
 */
export async function getProfileHandler(req, res) {
  const user = req.user;
  const outsider = req.role;

  const { profile: profileData } = await profile.getByUuids({
    uuidUser: user.uuid_user,
    uuidOutsider: outsider.uuid,
  });

  return res.status(200).json({
    success: true,
    data: { profile: profileData },
  });
}

/**
 * Handles checking the completion status of an outsider's profile.
 */
export async function getProfileStatusHandler(req, res) {
  const outsider = req.role;

  const { status } = await profile.checkStatus({
    uuidOutsider: outsider.uuid,
  });

  return res.status(200).json({
    success: true,
    data: status,
  });
}
