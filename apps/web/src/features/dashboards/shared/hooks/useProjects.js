import { useState, useEffect } from 'react';
import { getMyProjects, getProjectDetails } from '@/features/projects/projectsService';

export const useProjects = (dashboardType) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener lista de proyectos del usuario
      const { projects: projectsList } = await getMyProjects(1, 100);
      
      // Limitar a los primeros 5 proyectos para el dashboard (para no hacer muchas requests)
      const projectsToFetch = projectsList.slice(0, 5);
      
      // Obtener detalles completos de cada proyecto
      const detailedProjectsPromises = projectsToFetch.map(proj => 
        getProjectDetails(proj.uuid_project).then(details => ({
          ...details,
          uuid_project: proj.uuid_project, // Preservar UUID del listado original
        }))
      );
      
      const detailedProjects = await Promise.all(detailedProjectsPromises);
      
      // Transformar proyectos a formato que espera el componente
      const transformedProjects = detailedProjects.map(project => {
        console.log("🔍 useProjects - Proyecto recibido de getProjectDetails:", project);
        
        return {
          id: project.uuid_project,
          uuid_project: project.uuid_project,
          title: project.title || 'Sin título',
          description: project.shortDescription || project.description || 'Sin descripción',
          // Autor completo del proyecto
          company: project.author?.fullName || project.authorFullName || 'Autor no especificado',
          status: getStatusLabel(project.status?.slug),
          // Miembros del equipo reales
          students: (project.teamMembers || [])
            .filter(m => m.role === 'Miembro')
            .map(member => ({
              name: member.fullName || member.name || 'Sin nombre',
              email: member.email || 'Sin email',
            })),
          progress: 0, // No disponible en backend
          assigmentDate: project.approvedAt || project.createdAt || new Date().toISOString(),
          lastActivity: project.updatedAt || project.createdAt || new Date().toISOString(),
          comments: 0, // No disponible
          // Recursos reales
          deliverables: (project.resources || []).length,
        };
      });

      setProjects(transformedProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [dashboardType]);

  const refreshProjects = () => {
    fetchProjects();
  };

  return { projects, loading, error, refreshProjects };
};

function getStatusLabel(statusSlug) {
  const statusMap = {
    'project_approved': 'Aprobado',
    'project_in_progress': 'En Progreso',
    'completed': 'Completado',
    'rejected': 'Rechazado',
  };
  return statusMap[statusSlug] || 'Desconocido';
}