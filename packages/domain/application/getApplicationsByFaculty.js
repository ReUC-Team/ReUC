import { applicationRepo } from "@reuc/infrastructure/applicationRepo.js";

export async function getApplicationsByFaculty(
  faculty = "",
  page = 1,
  perPage = 50
) {
  return await applicationRepo.getLimitedByFacultyWithoutProjectRelation({
    faculty,
    page,
    perPage,
  });
}
