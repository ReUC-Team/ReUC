import { update } from "./update.js";
import { getByUuids } from "./getByUuids.js";
import { checkStatus } from "./checkStatus.js";
import { searchProfiles } from "./searchProfiles.js";

/**
 * The 'profile' entity in the application layer, which groups all the
 * use cases related to outsider `feature`.
 */
const profile = {
  update,
  getByUuids,
  checkStatus,
  searchProfiles,
};

export default profile;
