import { getAll as getAllFaculties } from "@reuc/domain/faculty/getAll.js";

export async function exploreMetadata() {
  const faculties = await getAllFaculties();

  return {
    metadata: {
      faculties,
    },
  };
}
