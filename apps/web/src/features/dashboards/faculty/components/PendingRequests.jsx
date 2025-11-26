import { useFacultyDashboardStats } from '../hooks/useFacultyDashboardStats';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const PendingRequests = () => {
  const { stats, isLoading } = useFacultyDashboardStats();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Solicitudes Pendientes</h3>
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
          <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Solicitudes Pendientes
        </h3>
        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full">
          {stats.pendingApplications}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {stats.applications.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay solicitudes pendientes</p>
          </div>
        ) : (
          stats.applications.map((app) => (
            <div
              key={app.uuid_application}
              onClick={() => navigate(`/applications/${app.uuid_application}`)}
              className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer border border-transparent hover:border-orange-200 dark:hover:border-orange-700"
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-1">
                  {app.title || 'Sin título'}
                </h4>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                {app.shortDescription || 'Sin descripción'}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  {app.createdAt ? formatDistanceToNow(new Date(app.createdAt), { 
                    addSuffix: true, 
                    locale: es 
                  }) : 'Fecha desconocida'}
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  Revisar →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {stats.applications.length > 0 && (
        <button
          onClick={() => navigate('/applications')}
          className="w-full mt-4 py-2 text-sm text-lime-600 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20 rounded-lg transition-colors font-medium"
        >
          Ver todas las solicitudes
        </button>
      )}
    </div>
  );
};

export default PendingRequests;