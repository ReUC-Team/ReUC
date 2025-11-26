import { useState, useEffect } from 'react';
import { getMyProjects } from '@/features/projects/projectsService';

export function useDashboardStats() {
  const [stats, setStats] = useState({
    projects: [],
    totalProjects: 0,
    byStatus: {
      approved: 0,
      inProgress: 0,
      completed: 0,
    },
    totalTeamMembers: 0,
    nearestDeadline: null,
    resourcesCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        // Obtener TODOS los proyectos del estudiante (sin paginación)
        const { projects } = await getMyProjects(1, 100);

        // Calcular estadísticas reales
        const byStatus = {
          approved: projects.filter(p => p.status?.slug === 'project_approved').length,
          inProgress: projects.filter(p => p.status?.slug === 'project_in_progress').length,
          completed: projects.filter(p => p.status?.slug === 'completed').length,
        };

        // Encontrar deadline más cercano
        const projectsWithDeadlines = projects
          .map(p => ({
            ...p,
            deadlineDate: p.estimatedDate ? new Date(p.estimatedDate) : null
          }))
          .filter(p => p.deadlineDate && p.deadlineDate > new Date())
          .sort((a, b) => a.deadlineDate - b.deadlineDate);

        const nearestDeadline = projectsWithDeadlines[0] || null;

        // Calcular total de miembros (requeriría obtener detalles de cada proyecto)
        // Por ahora usamos un estimado
        const totalTeamMembers = projects.length * 4; // Placeholder

        setStats({
          projects,
          totalProjects: projects.length,
          byStatus,
          totalTeamMembers,
          nearestDeadline,
          resourcesCount: 0, // Se calcularía obteniendo detalles de cada proyecto
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading, error };
}
