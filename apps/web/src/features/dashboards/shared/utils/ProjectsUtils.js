export const statusConfig = {
  // Estados traducidos del backend
  'Aprobado': {
    color: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400',
    dot: 'bg-lime-500 dark:bg-lime-400'
  },
  'En Progreso': {
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500 dark:bg-blue-400'
  },
  'Completado': {
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    dot: 'bg-green-500 dark:bg-green-400'
  },
  'Rechazado': {
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    dot: 'bg-red-500 dark:bg-red-400'
  },
  // Estados legacy
  'En progreso': {
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500 dark:bg-blue-400'
  },
  'Revision': {
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    dot: 'bg-yellow-500 dark:bg-yellow-400'
  },
  'Pausado': {
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    dot: 'bg-red-500 dark:bg-red-400'
  }
};

// Configuración de campos por tipo de dashboard
export const dashboardConfig = {
  faculty: {
    title: 'Proyectos activos',
    subtitle: 'proyectos activos',
    showStudents: true,
    showCompany: true,
    showProgress: false,
    showComments: false,
    showDeliverables: true,
    showTeamButton: true, // Cambio: de showContactButton a showTeamButton
    showDetailsButton: true,
    showCommentButton: false,
    showDeliverablesButton: false,
    maxHeight: '500px'
  },
  student: {
    title: 'Mis proyectos',
    subtitle: 'proyectos en curso',
    showStudents: false,
    showCompany: true,
    showProgress: false,
    showComments: false,
    showDeliverables: true,
    showTeamButton: false, // Estudiantes no ven botón de equipo
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
    showTeamButton: true, // Externos sí ven botón de equipo
    showDetailsButton: true,
    showCommentButton: false,
    showDeliverablesButton: false,
    maxHeight: '500px'
  }
};

export const projectUtils = {
  formatDate: (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  },

  calculateDaysElapsed: (date) => {
    const today = new Date();
    const activityDate = new Date(date);
    const difference = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
    
    if (difference === 0) return 'Hoy';
    if (difference === 1) return 'Ayer';
    return `Hace ${difference} días`;
  },

  getInitials: (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  },

  getProjectCountText: (count, dashboardType) => {
    const config = dashboardConfig[dashboardType];
    return `${count} ${config.subtitle}`;
  },

  // Función para determinar si mostrar un campo específico
  shouldShowField: (fieldName, dashboardType) => {
    const config = dashboardConfig[dashboardType];
    return config[fieldName] !== false;
  },

  // Función para obtener la configuración completa del dashboard
  getDashboardConfig: (dashboardType) => {
    return dashboardConfig[dashboardType] || dashboardConfig.faculty;
  }
};