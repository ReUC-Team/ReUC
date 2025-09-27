import { getByUuidOutsider } from "@reuc/domain/outsider/getByUuidOutsider.js";
import { NotFoundError } from "@reuc/domain/errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";

export async function getByUuid({ uuidOutsider }) {
  try {
    const outsider = await getByUuidOutsider({ uuidOutsider });

    return { outsider };
  } catch (err) {
    if (err instanceof NotFoundError)
      throw new ValidationError("El rol asignado al usuario no existe");
    throw err;
  }
}
