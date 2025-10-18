import { update } from "./update.js";
import { getByUuid } from "./getByUuid.js";

/**
 * The 'outsider' entity in the application layer, which groups all the
 * use cases related to outsider `entity`.
 */
const outsider = {
  update,
  getByUuid,
};

export default outsider;
