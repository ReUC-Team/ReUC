import { useState, useEffect } from 'react';
import { exploreApplications } from '@/features/projects/projectsService';
import { getMyProjects } from '@/features/projects/projectsService';

export function useFacultyDashboardStats() {
  const [stats, setStats] = useState({
    pendingApplications: 0,
    totalProjects: 0,
    byStatus: {
      approved: 0,
      inProgress: 0,
      completed: 0,
    },
    applications: [],
    projects: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        
        // Obtener solicitudes pendientes
        const { applications } = await exploreApplications(null, 1, 100);
        const pendingApps = applications.filter(app => app.status?.slug === 'in_review');

        // Obtener proyectos del profesor
        const { projects } = await getMyProjects(1, 100);

        // Calcular estadísticas por estado
        const byStatus = {
          approved: projects.filter(p => p.status?.slug === 'project_approved').length,
          inProgress: projects.filter(p => p.status?.slug === 'project_in_progress').length,
          completed: projects.filter(p => p.status?.slug === 'completed').length,
        };

        setStats({
          pendingApplications: pendingApps.length,
          totalProjects: projects.length,
          byStatus,
          applications: pendingApps.slice(0, 10), // Top 10 pendientes
          projects,
        });
      } catch (err) {
        console.error('Error fetching faculty dashboard stats:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading, error };
}
