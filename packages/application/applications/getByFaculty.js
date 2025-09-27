import { getApplicationsByFaculty } from "@reuc/domain/application/getApplicationsByFaculty.js";
import { ValidationError } from "../errors/ValidationError.js";

export async function getByFaculty({ faculty = "", page = 1, perPage = 50 }) {
  if (page < 1 || perPage < 0) {
    throw new ValidationError("Numero de pagina o items por pagina invalidos.");
  }

  const applications = await getApplicationsByFaculty(faculty, page, perPage);

  return { applications };
}
