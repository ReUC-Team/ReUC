// apps/mobile/src/config/projectRoutesConfig.ts

export interface ProjectRoute {
  screen: string
  label: string
  icon: string
  roles: ('outsider' | 'student' | 'professor' | 'admin')[]
  showInSidebar: boolean
}

export const PROJECT_ROUTES: ProjectRoute[] = [
  // ==================== RUTAS GENERALES ====================
  {
    screen: 'Dashboard',
    label: 'Home',
    icon: 'home-outline',
    roles: ['outsider', 'student', 'professor', 'admin'],
    showInSidebar: true,
  },

  // ==================== RUTAS DE PROYECTOS ====================
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
]

/**
 * Helper para normalizar el role a string
 * Acepta tanto string como objeto {slug, name}
 */
const normalizeRole = (role: string | { slug: string; name: string } | undefined): string => {
  if (!role) return 'outsider'
  if (typeof role === 'string') return role
  return role.slug || 'outsider'
}

/**
 * Obtiene las rutas de proyectos permitidas según el rol
 */
export const getProjectRoutesByRole = (role: string | { slug: string; name: string } | undefined): ProjectRoute[] => {
  const normalizedRole = normalizeRole(role)
  return PROJECT_ROUTES.filter((route) => route.roles.includes(normalizedRole as any))
}

/**
 * Obtiene las rutas que deben mostrarse en el sidebar según el rol
 */
export const getSidebarProjectRoutes = (role: string | { slug: string; name: string } | undefined): ProjectRoute[] => {
  const normalizedRole = normalizeRole(role)
  return PROJECT_ROUTES.filter(
    (route) => route.roles.includes(normalizedRole as any) && route.showInSidebar
  )
}

/**
 * Obtiene las rutas que deben mostrarse en la búsqueda según el rol
 * (Solo rutas con showInSidebar: true para que no salgan rutas de detalles)
 */
export const getSearchRoutesByRole = (role: string | { slug: string; name: string } | undefined): ProjectRoute[] => {
  const normalizedRole = normalizeRole(role)
  return PROJECT_ROUTES.filter(
    (route) => route.roles.includes(normalizedRole as any) && route.showInSidebar
  )
}

/**
 * Verifica si un usuario tiene acceso a una ruta específica
 */
export const hasAccessToRoute = (role: string | { slug: string; name: string } | undefined, screen: string): boolean => {
  const normalizedRole = normalizeRole(role)
  const route = PROJECT_ROUTES.find((r) => r.screen === screen)
  return route ? route.roles.includes(normalizedRole as any) : false
}