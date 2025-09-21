import { NotFoundError } from "@reuc/domain/errors/NotFoundError.js";
import { getAssetByUuid } from "@reuc/domain/file/getAssetByUuid.js";
import { ValidationError } from "../errors/ValidationError.js";

export async function getAsset({ uuidFile = "" }) {
  try {
    const fileAsset = await getAssetByUuid(uuidFile || "");

    return { file: fileAsset };
  } catch (err) {
    if (err instanceof NotFoundError)
      throw new ValidationError(
        "Lo sentimos, parece que hay un problema para cargar este contenido. Por favor, inténtalo de nuevo en unos momentos."
      );

    throw err;
  }
}
