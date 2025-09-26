import { NotFoundError } from "@reuc/domain/errors/NotFoundError.js";
import { getFileByModelTargetUuidTargetPurpose } from "@reuc/domain/file/getFileByModelTargetUuidTargetPurpose.js";
import { ValidationError } from "../errors/ValidationError.js";

export async function getFile({
  modelTarget = "",
  uuidTarget = "",
  purpose = "",
}) {
  try {
    if (!modelTarget || !uuidTarget || !purpose) {
      throw ValidationError(
        "Lo sentimos, no pudimos procesar la solicitud. El enlace que intentas usar parece estar incompleto o roto. Por favor, vuelve a la página anterior e inténtalo de nuevo."
      );
    }

    const file = await getFileByModelTargetUuidTargetPurpose(
      modelTarget,
      uuidTarget,
      purpose
    );

    return { file };
  } catch (err) {
    if (err instanceof NotFoundError)
      throw new ValidationError(
        "Lo sentimos, parece que hay un problema para cargar este contenido. Por favor, inténtalo de nuevo en unos momentos." +
          err.stack
      );

    throw err;
  }
}
