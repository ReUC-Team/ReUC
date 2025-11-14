// apps/mobile/src/features/dashboards/shared/utils/ProjectsUtils.ts

export type ProjectStatus = 'En progreso' | 'Revision' | 'Completado' | 'Pausado'
export type DashboardType = 'faculty' | 'student' | 'external'

export interface StatusConfig {
  color: string
  bgColor: string
  textColor: string
}

export interface DashboardConfig {
  title: string
  subtitle: string
  showStudents: boolean
  showCompany: boolean
  showProgress: boolean
  showComments: boolean
  showDeliverables: boolean
  showContactButton: boolean
  showDetailsButton: boolean
  showCommentButton: boolean
  showDeliverablesButton: boolean
}

// Configuración de colores por estado
export const statusConfig: Record<ProjectStatus, StatusConfig> = {
  'En progreso': {
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    textColor: '#1E40AF'
  },
  'Revision': {
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    textColor: '#92400E'
  },
  'Completado': {
    color: '#10B981',
    bgColor: '#D1FAE5',
    textColor: '#065F46'
  },
  'Pausado': {
    color: '#EF4444',
    bgColor: '#FEE2E2',
    textColor: '#991B1B'
  }
}

// Configuración de campos por tipo de dashboard
export const dashboardConfig: Record<DashboardType, DashboardConfig> = {
  faculty: {
    title: 'Proyectos recientes',
    subtitle: 'proyectos asignados',
    showStudents: true,
    showCompany: true,
    showProgress: true,
    showComments: true,
    showDeliverables: true,
    showContactButton: true,
    showDetailsButton: true,
    showCommentButton: true,
    showDeliverablesButton: true
  },
  student: {
    title: 'Mis proyectos',
    subtitle: 'proyectos en curso',
    showStudents: false,
    showCompany: true,
    showProgress: true,
    showComments: false,
    showDeliverables: true,
    showContactButton: false,
    showDetailsButton: true,
    showCommentButton: false,
    showDeliverablesButton: true
  },
  external: {
    title: 'Proyectos asignados',
    subtitle: 'proyectos de la empresa',
    showStudents: true,
    showCompany: false,
    showProgress: true,
    showComments: true,
    showDeliverables: false,
    showContactButton: true,
    showDetailsButton: true,
    showCommentButton: true,
    showDeliverablesButton: true
  }
}

export const projectUtils = {
  formatDate: (date: string): string => {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    })
  },

  calculateDaysElapsed: (date: string): string => {
    const today = new Date()
    const activityDate = new Date(date)
    const difference = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (difference === 0) return 'Hoy'
    if (difference === 1) return 'Ayer'
    return `Hace ${difference} días`
  },

  getInitials: (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  },

  getProjectCountText: (count: number, dashboardType: DashboardType): string => {
    const config = dashboardConfig[dashboardType]
    return `${count} ${config.subtitle}`
  },

  shouldShowField: (fieldName: keyof DashboardConfig, dashboardType: DashboardType): boolean => {
    const config = dashboardConfig[dashboardType]
    return config[fieldName] !== false
  },

  getDashboardConfig: (dashboardType: DashboardType): DashboardConfig => {
    return dashboardConfig[dashboardType] || dashboardConfig.faculty
  }
}