import { getAsset } from "./getAsset.js";
import { getFile } from "./getFile.js";

/**
 * The 'file' entity in the application layer, grouping all use cases
 * related to file retrieval.
 */
const file = {
  getAsset,
  getFile,
};

export default file;
