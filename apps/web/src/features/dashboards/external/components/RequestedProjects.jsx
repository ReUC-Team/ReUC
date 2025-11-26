import { useExternalDashboardStats } from '../hooks/useExternalDashboardStats';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const RequestedProjects = () => {
  const { stats, isLoading } = useExternalDashboardStats();
  const navigate = useNavigate();

  const getStatusColor = (statusSlug) => {
    switch(statusSlug) {
      case 'approved': return 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400';
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'in_review': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (statusSlug) => {
    switch(statusSlug) {
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      case 'in_review': return 'En Revisión';
      default: return 'Desconocido';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Mis Solicitudes</h3>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-3 bg-gray-200 dark:bg-slate-700 rounded-lg h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Mis Solicitudes
        </h3>
        <span className="px-2 py-1 bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 text-xs font-semibold rounded-full">
          {stats.totalApplications}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {stats.applications.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No has enviado solicitudes aún</p>
            <button
              onClick={() => navigate('/request-project')}
              className="px-4 py-2 bg-lime-600 dark:bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition text-sm font-medium"
            >
              Solicitar Proyecto
            </button>
          </div>
        ) : (
          stats.applications.map((app) => (
            <div
              key={app.uuid_application}
              onClick={() => navigate(`/my-applications/${app.uuid_application}`)}
              className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors cursor-pointer border border-transparent hover:border-lime-200 dark:hover:border-lime-700"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-1 flex-1">
                  {app.title || 'Sin título'}
                </h4>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status?.slug)}`}>
                  {getStatusLabel(app.status?.slug)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                {app.shortDescription || 'Sin descripción'}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  {app.createdAt ? formatDistanceToNow(new Date(app.createdAt), { 
                    addSuffix: true, 
                    locale: es 
                  }) : 'Fecha desconocida'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {stats.applications.length > 0 && (
        <button
          onClick={() => navigate('/my-applications')}
          className="w-full mt-4 py-2 text-sm text-lime-600 dark:text-lime-400 hover:bg-gray-50 dark:hover:bg-lime-900/20 rounded-lg transition-colors font-medium"
        >
          Ver todas mis solicitudes
        </button>
      )}
    </div>
  );
};

export default RequestedProjects;