/**
 * Mapeo de nombres a IDs para las categorías del sistema
 * IMPORTANTE: Estos valores deben coincidir EXACTAMENTE con la base de datos
 */

export const PROJECT_TYPE_MAP = {
  'Tesis': 3,
  'Proyectos Integradores': 1,
  'Servicio Social Constitucional': 2,
  'Proyectos de investigación': 4,
  'Prácticas profesionales': 5,
};

export const FACULTY_MAP = {
  'FIE': 1,
  'FACIMAR': 2,
  'FECAM': 3,
};

export const PROBLEM_TYPE_MAP = {
  'Tecnológica': 2,
  'Social': 3,
  'Ambiental': 2,
  'Logistica': 4,
};

/**
 * Mapea un array de nombres a sus IDs correspondientes
 * @param {string[]} names - Array de nombres
 * @param {object} map - Objeto de mapeo (ej: PROJECT_TYPE_MAP)
 * @returns {number[]} Array de IDs
 */
export function mapNamesToIds(names, map) {
  if (!names || !Array.isArray(names)) return [];
  
  return names
    .map(name => {
      // Normalizar el nombre (trim + case-insensitive)
      const normalizedName = name.trim();
      const id = map[normalizedName];
      
      if (id === undefined) {
        console.warn(`⚠️ ID no encontrado para "${normalizedName}" en el mapa:`, Object.keys(map));
      }
      
      return id;
    })
    .filter(id => id !== undefined);  // Filtrar valores undefined
}