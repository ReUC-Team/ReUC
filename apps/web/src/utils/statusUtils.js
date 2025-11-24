/**
 * Mapeo de slugs a nombres legibles en español
 */
export const STATUS_NAMES = {
  // Estados de aplicaciones
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  // Estados de proyectos
  in_review: "En Revisión",
  project_approved: "Aprobado",
  project_in_progress: "En Progreso",
  completed: "Completado"
}

/**
 * Configuración de colores para badges
 */
export const STATUS_CONFIG = {
  // Estados de aplicaciones
  pending: {
    bg: "bg-yellow-100 dark:bg-yellow-900/20",
    text: "text-yellow-800 dark:text-yellow-300",
    border: "border-yellow-300 dark:border-yellow-700"
  },
  approved: {
    bg: "bg-lime-100 dark:bg-lime-900/20",
    text: "text-lime-800 dark:text-lime-300",
    border: "border-lime-300 dark:border-lime-700"
  },
  rejected: {
    bg: "bg-red-100 dark:bg-red-900/20",
    text: "text-red-800 dark:text-red-300",
    border: "border-red-300 dark:border-red-700"
  },
  // Estados de proyectos
  in_review: {
    bg: "bg-yellow-100 dark:bg-yellow-900/20",
    text: "text-yellow-800 dark:text-yellow-300",
    border: "border-yellow-300 dark:border-yellow-700"
  },
  project_approved: {
    bg: "bg-lime-100 dark:bg-lime-900/20",
    text: "text-lime-800 dark:text-lime-300",
    border: "border-lime-300 dark:border-lime-700"
  },
  project_in_progress: {
    bg: "bg-lime-700 dark:bg-lime-900/20",
    text: "text-white dark:text-lime-300",
    border: "border-lime-700 dark:border-lime-700"
  },
  completed: {
    bg: "bg-purple-100 dark:bg-purple-900/20",
    text: "text-purple-800 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-700"
  }
}

/**
 * Obtiene el nombre legible del estado
 */
export function getStatusName(slug) {
  return STATUS_NAMES[slug] || slug
}

/**
 * Obtiene la configuración visual del estado
 */
export function getStatusConfig(slug) {
  return STATUS_CONFIG[slug] || STATUS_CONFIG.in_review
}