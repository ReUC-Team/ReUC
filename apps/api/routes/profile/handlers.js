import profile from "@reuc/application/profile/index.js";

/**
 * Handles updating the user's and outsider's profile information.
 */
export async function editProfileHandler(req, res) {
  const user = req.user;
  const role = req.role;

  const { profile: updatedProfile } = await profile.update({
    uuidUser: user.uuid_user,
    role,
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
  const role = req.role;

  const { profile: profileData } = await profile.getByUuids({
    uuidUser: user.uuid_user,
    role,
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
  const user = req.user;
  const role = req.role;

  const { status } = await profile.checkStatus({
    uuidUser: user.uuid_user,
    role,
  });

  return res.status(200).json({
    success: true,
    data: { status },
  });
}

/**
 * Handles searching of an user's profile.
 */
export async function getSearchProfilesHandler(req, res) {
  const { q, limit } = req.query;

  const records = await profile.searchProfiles(q, { limit });

  return res.status(200).json({
    success: true,
    data: { records },
  });
}
