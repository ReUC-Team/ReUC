import { useDashboardStats } from '../hooks/useDashboardStats';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ActiveProjects = () => {
  const { stats, isLoading, error } = useDashboardStats();
  const navigate = useNavigate();

  const getStatusColor = (statusSlug) => {
    switch(statusSlug) {
      case 'project_in_progress': return 'bg-slate-200 text-slate-700 dark:bg-slate-200 dark:text-slate-400 border border-sky-800 dark:border-sky-700';
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'project_approved': return 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (statusSlug) => {
    switch(statusSlug) {
      case 'project_in_progress': return 'En Progreso';
      case 'completed': return 'Completado';
      case 'project_approved': return 'Aprobado';
      default: return 'Desconocido';
    }
  };

  const calculateDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (isLoading) {
    return (
      <div className="pt-2 rounded-xl">
        <div className="mx-auto">
          <div className="mb-8 ml-3 mt-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Panel de Estudiante</h1>
            <p className="text-gray-600 dark:text-gray-400">Consulta tus proyectos, revisa avances y mantente al día con tus asignaciones</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-2 rounded-xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
          <p className="text-red-600 dark:text-red-400">Error al cargar estadísticas: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 rounded-xl">
      <div className="mx-auto">
        <div className="mb-8 ml-3 mt-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Panel de Estudiante</h1>
          <p className="text-gray-600 dark:text-gray-400">Consulta tus proyectos, revisa avances y mantente al día con tus asignaciones</p>
        </div>

        {/* Tarjetas de Proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.projects.slice(0, 4).map((project, index) => {
            const daysRemaining = calculateDaysRemaining(project.estimatedDate);
            return (
              <div 
                key={project.uuid_project || index}
                onClick={() => navigate(`/my-projects/${project.uuid_project}`)}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-lime-300 to-lime-600 opacity-5 rounded-full -translate-y-8 translate-x-8"></div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-lime-50 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status?.slug)}`}>
                    {getStatusLabel(project.status?.slug)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-2">
                      {project.title || 'Sin título'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {project.shortDescription || 'Sin descripción'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {daysRemaining !== null ? `${daysRemaining} días` : 'Sin deadline'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-lime-300 to-lime-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            );
          })}
        </div>

        {/* Estadísticas Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Proyectos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalProjects}</p>
              </div>
              <div className="w-12 h-12 bg-lime-50 dark:bg-lime-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Progreso</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.byStatus.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.byStatus.completed}</p>
              </div>
              <div className="w-12 h-12 bg-lime-50 dark:bg-lime-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-lime-700 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveProjects;