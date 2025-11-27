// apps/mobile/src/features/dashboards/shared/utils/ProjectsUtils.ts

export type ProjectStatus = 
  | 'Aprobado'
  | 'En Progreso' 
  | 'Completado'
  | 'Rechazado'
  | 'Desconocido'

export type DashboardType = 'faculty' | 'student' | 'external'

interface StatusConfig {
  color: string
  bgColor: string
  textColor: string
}

export const statusConfig: Record<string, StatusConfig> = {
  'Aprobado': {
    color: '#84CC16',
    bgColor: '#D1FAE5',
    textColor: '#065F46'
  },
  'En Progreso': {
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    textColor: '#1E40AF'
  },
  'Completado': {
    color: '#10B981',
    bgColor: '#D1FAE5',
    textColor: '#065F46'
  },
  'Rechazado': {
    color: '#EF4444',
    bgColor: '#FEE2E2',
    textColor: '#991B1B'
  },
  'Desconocido': {
    color: '#6B7280',
    bgColor: '#F3F4F6',
    textColor: '#374151'
  }
}

interface DashboardConfig {
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
  maxHeight: string
}

const dashboardConfig: Record<DashboardType, DashboardConfig> = {
  faculty: {
    title: 'Proyectos asignados',
    subtitle: 'proyectos asignados',
    showStudents: true,
    showCompany: true,
    showProgress: false,
    showComments: false,
    showDeliverables: true,
    showContactButton: true,
    showDetailsButton: true,
    showCommentButton: false,
    showDeliverablesButton: false,
    maxHeight: '500px'
  },
  student: {
    title: 'Mis proyectos',
    subtitle: 'proyectos en curso',
    showStudents: true,
    showCompany: true,
    showProgress: false,
    showComments: false,
    showDeliverables: true,
    showContactButton: true,
    showDetailsButton: true,
    showCommentButton: false,
    showDeliverablesButton: false,
    maxHeight: '400px'
  },
  external: {
    title: 'Proyectos asignados',
    subtitle: 'proyectos de la empresa',
    showStudents: true,
    showCompany: false,
    showProgress: false,
    showComments: false,
    showDeliverables: true,
    showContactButton: true,
    showDetailsButton: true,
    showCommentButton: false,
    showDeliverablesButton: false,
    maxHeight: '500px'
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

  getDashboardConfig: (dashboardType: DashboardType): DashboardConfig => {
    return dashboardConfig[dashboardType] || dashboardConfig.faculty
  }
}