import outsider from "../outsider/index.js";
import { validateUuid } from "../shared/validators.js";
import { ValidationError } from "../errors/ValidationError.js";
import { isProfileComplete } from "@reuc/domain/outsider/isProfileComplete.js";

export async function checkProfileStatus({ uuidOutsider }) {
  const uuidError = validateUuid(uuidOutsider);
  if (uuidError) throw new ValidationError(uuidError);

  const outsiderData = await outsider.getByUuid({ uuidOutsider });
  if (!outsiderData)
    throw new ValidationError("Rol del usuario no encontrado.");

  return isProfileComplete(outsiderData);
}
