/**
 * Mapeo de nombres a IDs para las categorías del sistema
 * IMPORTANTE: Estos valores deben coincidir EXACTAMENTE con la base de datos
 */

export const PROJECT_TYPE_MAP = {
  'Tesis': 48,
  'Proyectos Integradores': 46,
  'Servicio Social Constitucional': 47,
  'Proyectos de investigación': 49,
  'Prácticas profesionales': 50,
};

export const FACULTY_MAP = {
  'FIE': 28,
  'FACIMAR': 29,
  'FECAM': 30,
};

export const PROBLEM_TYPE_MAP = {
  'Tecnológica': 34,
  'Social': 35,
  'Ambiental': 33,
  'Logistica': 36,
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