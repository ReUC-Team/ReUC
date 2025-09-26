import user from "../user/index.js";
import outsider from "../outsider/index.js";
import { validateUuid } from "../shared/validators.js";
import { ValidationError } from "../errors/ValidationError.js";

export async function getByUuids({ uuidUser, uuidOutsider }) {
  const uuidError = validateUuid(uuidUser) || validateUuid(uuidOutsider);
  if (uuidError) throw new ValidationError(uuidError);

  const userData = await user.getByUuid({ uuidUser });
  const outsiderData = await outsider.getByUuid({ uuidOutsider });

  return {
    profile: {
      email: userData.user.email,
      firstName: userData.user.firstName,
      middleName: userData.user.middleName,
      lastName: userData.user.lastName,
      phoneNumber: outsiderData.outsider.phoneNumber,
      location: outsiderData.outsider.location,
    },
  };
}
