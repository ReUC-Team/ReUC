import { update } from "./update.js";
import { getByUuids } from "./getByUuids.js";
import { checkStatus } from "./checkStatus.js";

/**
 * The 'profile' entity in the application layer, which groups all the
 * use cases related to outsider `feature`.
 */
const profile = {
  update,
  getByUuids,
  checkStatus,
};

export default profile;
