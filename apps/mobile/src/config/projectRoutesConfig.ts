// apps/mobile/src/config/projectRoutesConfig.ts

export interface ProjectRoute {
  screen: string
  label: string
  icon: string
  roles: ('outsider' | 'student' | 'professor' | 'admin')[]
  showInSidebar: boolean
}

export const PROJECT_ROUTES: ProjectRoute[] = [
  {
    screen: 'ExploreProjects',
    label: 'Explorar proyectos',
    icon: 'search-outline',
    roles: ['professor', 'admin'],
    showInSidebar: true,
  },
  {
    screen: 'RequestProject',
    label: 'Solicitar proyecto',
    icon: 'add-circle-outline',
    roles: ['outsider', 'student', 'professor', 'admin'],
    showInSidebar: true,
  },
  {
    screen: 'MyApplications',
    label: 'Mis solicitudes',
    icon: 'document-text-outline',
    roles: ['outsider', 'student', 'professor', 'admin'],
    showInSidebar: true,
  },
  {
    screen: 'MyApplicationDetails',
    label: 'Detalles de solicitud',
    icon: 'document-outline',
    roles: ['outsider', 'student', 'professor', 'admin'],
    showInSidebar: false,
  },
  {
    screen: 'ApplicationDetails',
    label: 'Detalles de aplicación',
    icon: 'information-circle-outline',
    roles: ['professor', 'admin'],
    showInSidebar: false,
  },
  {
    screen: 'MyProjects',
    label: 'Mis proyectos',
    icon: 'briefcase-outline',
    roles: ['outsider', 'student', 'professor', 'admin'],
    showInSidebar: true,
  },
  {
    screen: 'ProjectDetails',
    label: 'Detalles del proyecto',
    icon: 'information-circle-outline',
    roles: ['outsider', 'student', 'professor', 'admin'],
    showInSidebar: false,
  },
  {
    screen: 'FavoriteProjects',
    label: 'Mis favoritos',
    icon: 'star-outline',
    roles: ['outsider', 'student', 'professor', 'admin'], // ✅ AHORA PARA TODOS
    showInSidebar: true,
  },
]

/**
 * Obtiene las rutas de proyectos permitidas según el rol
 */
export const getProjectRoutesByRole = (role: string): ProjectRoute[] => {
  return PROJECT_ROUTES.filter((route) => route.roles.includes(role as any))
}

/**
 * Obtiene las rutas que deben mostrarse en el sidebar según el rol
 */
export const getSidebarProjectRoutes = (role: string): ProjectRoute[] => {
  return PROJECT_ROUTES.filter(
    (route) => route.roles.includes(role as any) && route.showInSidebar
  )
}

/**
 * Verifica si un usuario tiene acceso a una ruta específica
 */
export const hasAccessToRoute = (role: string, screen: string): boolean => {
  const route = PROJECT_ROUTES.find((r) => r.screen === screen)
  return route ? route.roles.includes(role as any) : false
}