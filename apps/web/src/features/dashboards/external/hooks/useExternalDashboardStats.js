import { useState, useEffect } from 'react';
import { getMyApplications } from '@/features/projects/projectsService';
import { getMyProjects } from '@/features/projects/projectsService';

export function useExternalDashboardStats() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    approvalRate: 0,
    applications: [],
    projects: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        
        // Obtener mis solicitudes
        const { applications } = await getMyApplications(1, 100);
        
        // Obtener mis proyectos aprobados
        const { projects } = await getMyProjects(1, 100);

        const approved = applications.filter(app => app.status?.slug === 'approved').length;
        const rejected = applications.filter(app => app.status?.slug === 'rejected').length;
        const pending = applications.filter(app => app.status?.slug === 'in_review').length;
        
        const approvalRate = applications.length > 0 
          ? ((approved / applications.length) * 100).toFixed(1) 
          : 0;

        setStats({
          totalApplications: applications.length,
          approved,
          rejected,
          pending,
          approvalRate,
          applications: applications.slice(0, 10),
          projects,
        });
      } catch (err) {
        console.error('Error fetching external dashboard stats:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading, error };
}
