import { getAll as getAllProjectTypes } from "@reuc/domain/projectTypes/getAll.js";
import { getAll as getAllFaculties } from "@reuc/domain/faculty/getAll.js";
import { getDefaultApplicationMeta } from "@reuc/domain/problemTypes/getDefaultApplicationMeta.js";
import { getAssetApplicationBanners } from "@reuc/domain/file/getAssetApplicationBanners.js";

export async function createMetadata() {
  const [projectTypes, problemTypes, faculties, defaultBanners] =
    await Promise.all([
      getAllProjectTypes(),
      getAllFaculties(),
      getDefaultApplicationMeta(),
      getAssetApplicationBanners(),
    ]);

  const defaultBannerURLs = defaultBanners.map((b) => {
    return {
      name: b.originalName,
      uuid: b.uuid_file,
      url: `/file/public/${b.uuid_file}`,
    };
  });

  return {
    metadata: {
      faculties,
      projectTypes,
      problemTypes,
      defaultBanners: defaultBannerURLs,
    },
  };
}
