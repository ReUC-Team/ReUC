import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/context/AccesibilityContext';
import useMyProjects from '../../projects/hooks/useMyProjects';
import ProjectCard from '../../projects/components/ProjectCard';

const ProjectsTab = () => {
  const navigate = useNavigate();
  const { isDark, largeText, dyslexiaFont } = useAccessibility();
  const { projects, pagination, isLoading, error, handlePageChange } = useMyProjects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`rounded-xl shadow-md p-2 animate-pulse ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className={`w-full h-48 rounded-lg mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className="p-3 space-y-2">
              <div className={`h-5 rounded w-3/4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded w-5/6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`
        border rounded-lg p-6 mt-6
        ${isDark 
          ? 'bg-red-900/20 border-red-800' 
          : 'bg-red-50 border-red-200'
        }
      `}>
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-800'}`}>
            Error al cargar proyectos
          </h3>
        </div>
        <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>
          {error}
        </p>
      </div>
    );
  }

  // 📭 Empty state
  if (projects.length === 0) {
    return (
      <div className={`
        rounded-xl p-12 text-center mt-6
        ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
      `}>
        <svg 
          className={`w-20 h-20 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className={`
          text-xl font-semibold mb-2
          ${largeText ? 'text-2xl' : 'text-xl'}
          ${dyslexiaFont ? 'font-dyslexia' : ''}
          ${isDark ? 'text-white' : 'text-gray-700'}
        `}>
          Aún no tienes proyectos aprobados
        </h3>
        <p className={`
          mb-6
          ${largeText ? 'text-base' : 'text-sm'}
          ${dyslexiaFont ? 'font-dyslexia' : ''}
          ${isDark ? 'text-gray-400' : 'text-gray-500'}
        `}>
          Tus solicitudes aprobadas aparecerán aquí como proyectos activos
        </p>
        <button
          onClick={() => navigate('/my-applications')}
          className="bg-lime-600 text-white px-6 py-3 rounded-lg hover:bg-lime-700 transition-all font-medium"
        >
          Ver mis solicitudes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <ProjectCard
            key={proj.uuid_project}
            uuid={proj.uuid_project}
            image={proj.bannerUrl}
            title={proj.title}
            description={proj.shortDescription}
            onDetailsClick={() => navigate(`/my-projects/${proj.uuidApplication}`)}
          />
        ))}
      </div>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className={`
          flex items-center justify-center gap-4 pt-6
          ${largeText ? 'text-base' : 'text-sm'}
          ${dyslexiaFont ? 'font-dyslexia' : ''}
        `}>
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-lime-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-700 transition-all font-medium"
          >
            Anterior
          </button>

          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
            Página {pagination.page} de {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 bg-lime-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-700 transition-all font-medium"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Contador */}
      <p className={`
        text-sm text-center
        ${isDark ? 'text-gray-400' : 'text-gray-500'}
      `}>
        Mostrando {projects.length} de {pagination.filteredItems} proyectos
      </p>
    </div>
  );
};

export default ProjectsTab;