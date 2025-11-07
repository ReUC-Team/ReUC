/**
 * Constructs the standard URL path for a given file link object.
 * This is a business rule that enforces a file URL structure.
 *
 * Business Rules:
 * - Assets predefinidos (isAsset = true) → /file/public/:uuid
 * - Archivos públicos (BANNER, ATTACHMENT, etc.) → /file/public/:model/:purpose/:uuid
 * - Archivos protegidos (CV, PRIVATE_DOCUMENT) → /file/protected/:model/:purpose/:uuid
 *
 * @param {object} link - The file link data object
 * @param {string} link.modelTarget - The model type (e.g., "APPLICATION")
 * @param {string} link.purpose - The file purpose (e.g., "BANNER", "ATTACHMENT", "CV")
 * @param {string} link.uuidTarget - The UUID of the target entity
 * @param {object} [link.file] - Optional file metadata
 * @param {boolean} [link.file.isAsset] - Whether the file is a predefined asset
 * @param {string} [link.file.uuid_file] - The UUID of the file (for assets)
 *
 * @returns {string|null} The formatted URL path, or null if invalid input.
 */
export function buildFileUrl(link) {
  // Validación de entrada
  if (!link || !link.modelTarget || !link.purpose || !link.uuidTarget) {
    return null;
  }

  const { modelTarget, purpose, uuidTarget, file } = link;

  // Caso 1: Assets predefinidos (banners por defecto, logos, íconos)
  // Estos archivos están marcados como isAsset=true en la DB
  if (file?.isAsset && file?.uuid_file) {
    return `/file/public/${file.uuid_file}`;
  }

  // Caso 2: Archivos protegidos (requieren autenticación)
  // Define qué propósitos necesitan protección
  const PROTECTED_PURPOSES = [
    'CV',                  
    'PRIVATE_DOCUMENT',   
    'PERSONAL',           
    'CONFIDENTIAL'        
  ];

  const purposeUpper = purpose.toUpperCase();
  
  if (PROTECTED_PURPOSES.includes(purposeUpper)) {
    return `/file/protected/${modelTarget}/${purpose}/${uuidTarget}`;
  }

  // Caso 3: Archivos públicos por defecto (BANNER, ATTACHMENT, etc.)
  // Estos archivos son accesibles sin autenticación
  return `/file/public/${modelTarget}/${purpose}/${uuidTarget}`;
}

/**
 * Helper function to check if a file purpose requires authentication.
 * 
 * @param {string} purpose - The file purpose
 * @returns {boolean} True if the file is protected
 */
export function isProtectedPurpose(purpose) {
  const PROTECTED_PURPOSES = ['CV', 'PRIVATE_DOCUMENT', 'PERSONAL', 'CONFIDENTIAL'];
  return PROTECTED_PURPOSES.includes(purpose.toUpperCase());
}

/**
 * Helper function to check if a file is a public asset.
 * 
 * @param {object} file - The file metadata
 * @returns {boolean} True if the file is a public asset
 */
export function isPublicAsset(file) {
  return Boolean(file?.isAsset);
}