// apps/mobile/src/utils/statusUtils.ts

/**
 * Mapeo de slugs a nombres legibles en español
 */
export const STATUS_NAMES: Record<string, string> = {
  // Estados de aplicaciones
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  // Estados de proyectos
  in_review: 'En Revisión',
  project_approved: 'Aprobado',
  project_in_progress: 'En Progreso',
  completed: 'Completado',
}

/**
 * Configuración de colores para badges en Mobile
 * Retorna colores hexadecimales que se pueden usar directamente
 */
export const STATUS_CONFIG: Record<string, {
  bg: string
  text: string
  iconColor: string
}> = {
  // Estados de aplicaciones
  pending: {
    bg: '#FEF3C7',      
    text: '#92400E',   
    iconColor: '#F59E0B',
  },
  approved: {
    bg: '#ECFCCB',      
    text: '#365314',    
    iconColor: '#84CC16', 
  },
  rejected: {
    bg: '#FEE2E2',      
    text: '#991B1B',   
    iconColor: '#EF4444', 
  },
  // Estados de proyectos
  in_review: {
    bg: '#FEF3C7',      
    text: '#92400E',    
    iconColor: '#F59E0B', 
  },
  project_approved: {
    bg: '#ECFCCB',      
    text: '#365314',    
    iconColor: '#84CC16',
  },
  project_in_progress: {
    bg: '#84CC16',     
    text: '#FFFFFF',    
    iconColor: '#FFFFFF', 
  },
  completed: {
    bg: '#F3E8FF',     
    text: '#581C87',    
    iconColor: '#A855F7', 
  },
}

/**
 * Obtiene el nombre legible del estado
 */
export function getStatusName(slug: string | undefined): string {
  if (!slug) return 'Desconocido'
  return STATUS_NAMES[slug] || slug
}

/**
 * Obtiene la configuración visual del estado
 */
export function getStatusConfig(slug: string | undefined) {
  if (!slug) return STATUS_CONFIG.in_review
  return STATUS_CONFIG[slug] || STATUS_CONFIG.in_review
}

/**
 * Obtiene el ícono apropiado según el estado
 */
export function getStatusIcon(slug: string | undefined): string {
  const iconMap: Record<string, string> = {
    pending: 'time-outline',
    approved: 'checkmark-circle',
    rejected: 'close-circle',
    in_review: 'time-outline',
    project_approved: 'checkmark-circle',
    project_in_progress: 'rocket-outline',
    completed: 'trophy-outline',
  }
  
  if (!slug) return 'help-circle-outline'
  return iconMap[slug] || 'help-circle-outline'
}