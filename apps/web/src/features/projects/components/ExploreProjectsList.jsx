import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import useExploreApplications from '../hooks/useExploreApplications';

const ExploreProjectsList = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  
  const {
    applications,
    faculties,
    selectedFacultyId,
    pagination,
    isLoading,
    error,
    handleFacultyFilter,
    handlePageChange,
  } = useExploreApplications();

  // Filtrar por búsqueda local (título o descripción)
  const filteredApplications = applications.filter((app) => {
    const searchLower = search.toLowerCase();
    return (
      app.title.toLowerCase().includes(searchLower) ||
      app.shortDescription.toLowerCase().includes(searchLower)
    );
  });

  const handleProjectClick = (uuid) => {
    navigate(`/project/${uuid}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-96 h-12 bg-gray-200 rounded-full mb-6 animate-pulse"></div>
        <div className="flex gap-4 flex-wrap justify-center mb-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-11/12 mb-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl shadow-md p-2 animate-pulse">
              <div className="w-full h-52 bg-gray-200 rounded-xl mb-4"></div>
              <div className="p-3 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h3 className="font-semibold text-red-800">Error al cargar proyectos</h3>
          </div>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar proyectos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-96 px-5 py-3 rounded-full border border-gray-300 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
      />

      {/* Filtros por facultad */}
      <div className="flex gap-4 flex-wrap justify-center mb-10">
        {faculties.map(({ faculty_id, name, abbreviation }) => (
          <button
            key={faculty_id}
            onClick={() => handleFacultyFilter(faculty_id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
              selectedFacultyId === faculty_id
                ? 'bg-lime-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {abbreviation || name}
          </button>
        ))}
      </div>

      {/* Lista de proyectos */}
      {filteredApplications.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron proyectos
            </h3>
            <p className="text-gray-500">
              {search
                ? "Intenta con otros términos de búsqueda"
                : selectedFacultyId
                ? "No hay proyectos disponibles para esta facultad"
                : "Aún no hay proyectos publicados"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-11/12 mb-10">
            {filteredApplications.map((app) => (
              <ProjectCard
                key={app.uuid_application}
                uuid={app.uuid_application}
                image={app.bannerUrl}
                title={app.title}
                description={app.shortDescription}
                onDetailsClick={() => handleProjectClick(app.uuid_application)}
              />
            ))}
          </div>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center gap-4 mb-10">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-lime-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-700 transition"
              >
                Anterior
              </button>

              <span className="text-gray-700 font-medium">
                Página {pagination.page} de {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 bg-lime-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-700 transition"
              >
                Siguiente
              </button>
            </div>
          )}

          {/* Contador de resultados */}
          <p className="text-sm text-gray-500 mb-10">
            Mostrando {filteredApplications.length} de {pagination.filteredItems} proyectos
          </p>
        </>
      )}
    </div>
  );
};

export default ExploreProjectsList;