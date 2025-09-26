import { STORAGE_CONFIG } from "@reuc/file-storage/constants/paths.js";

const path = STORAGE_CONFIG.local.basePath;

export const fileSeedData = [
  {
    storedPath: `${path}/application-bannerTecnologia.jpg`,
    storedName: "application-bannerTecnologia.jpg",
    originalName: "Tecnologia.jpg",
    mimetype: "image/jpg",
    fileSize: 57166,
    fileKind: "image",
    isAsset: true,
  },
  {
    storedPath: `${path}/application-bannerMedio-ambiente.png`,
    storedName: "application-bannerMedio-ambiente.png",
    originalName: "Medio-ambiente.png",
    mimetype: "image/png",
    fileSize: 284892,
    fileKind: "image",
    isAsset: true,
  },
  {
    storedPath: `${path}/application-bannerVida-marina.jpg`,
    storedName: "application-bannerVida-marina.jpg",
    originalName: "Vida-marina.jpg",
    mimetype: "image/jpg",
    fileSize: 71626,
    fileKind: "image",
    isAsset: true,
  },
];
