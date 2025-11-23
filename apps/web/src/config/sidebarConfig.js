/**
 * Configuración centralizada del sidebar por roles
 * Cada rol tiene sus propias rutas permitidas en el sidebar
 */
export const SIDEBAR_ITEMS = {
  // OUTSIDER - Solo puede solicitar proyectos y ver los suyos
  outsider: [
    {
      path: '/dashboard',
      label: 'Home',
      icon: 'home'
    },
    {
      path: '/request-project',
      label: 'Solicitar un proyecto',
      icon: 'request'
    },
    {
      path: '/my-applications',
      label: 'Mis solicitudes',
      icon: 'applications'
    },
    {
      path: '/my-projects',
      label: 'Mis proyectos',
      icon: 'myProjects'
    },
    // {
    //   path: '/favorite-projects',
    //   label: 'Mis favoritos',
    //   icon: 'favorites'
    // }
  ],
  
  // STUDENT - Puede explorar y aplicar a proyectos
  student: [
    {
      path: '/dashboard',
      label: 'Home',
      icon: 'home'
    },
    {
      path: '/request-project',
      label: 'Solicitar un proyecto',
      icon: 'request'
    },
    {
      path: '/my-applications',
      label: 'Mis solicitudes',
      icon: 'applications'
    },
    {
      path: '/my-projects',
      label: 'Mis proyectos',
      icon: 'myProjects'
    },
    // {
    //   path: '/favorite-projects',
    //   label: 'Mis favoritos',
    //   icon: 'favorites'
    // }
  ],
  
  // PROFESSOR - Puede explorar, solicitar y gestionar proyectos
  professor: [
    {
      path: '/dashboard',
      label: 'Home',
      icon: 'home'
    },
    {
      path: '/explore-projects',
      label: 'Explorar proyectos',
      icon: 'explore'
    },
    {
      path: '/request-project',
      label: 'Solicitar un proyecto',
      icon: 'request'
    },
    {
      path: '/my-applications',
      label: 'Mis solicitudes',
      icon: 'applications'
    },
    {
      path: '/my-projects',
      label: 'Mis proyectos',
      icon: 'myProjects'
    },
    // {
    //   path: '/favorite-projects',
    //   label: 'Mis favoritos',
    //   icon: 'favorites'
    // },
    // {
    //   path: '/members',
    //   label: 'Miembros',
    //   icon: 'members'
    // }
  ],
  
  // ADMIN - Acceso completo + panel de administración
//   admin: [
//     {
//       path: '/dashboard',
//       label: 'Home',
//       icon: 'home'
//     },
//     {
//       path: '/admin/students',
//       label: 'Panel de administración',
//       icon: 'admin'
//     },
//     {
//       path: '/explore-projects',
//       label: 'Explorar proyectos',
//       icon: 'explore'
//     },
//     {
//       path: '/my-projects',
//       label: 'Todos los proyectos',
//       icon: 'myProjects'
//     },
//     {
//       path: '/members',
//       label: 'Miembros',
//       icon: 'members'
//     }
//   ]
};

/**
 * Obtiene las rutas del sidebar permitidas según el rol del usuario
 * @param {string} role - El rol del usuario ('outsider', 'student', 'professor', 'admin')
 * @returns {Array} Array de objetos con las rutas permitidas
 */
export const getSidebarItemsByRole = (role) => {
  if (!role) return [];
  return SIDEBAR_ITEMS[role] || [];
};

/**
 * Verifica si un usuario tiene acceso a una ruta específica
 * @param {string} role - El rol del usuario
 * @param {string} path - La ruta a verificar
 * @returns {boolean}
 */
export const hasAccessToRoute = (role, path) => {
  const items = getSidebarItemsByRole(role);
  return items.some(item => item.path === path);
};