import { useDashboardStats } from '../hooks/useDashboardStats';

const ParticipationSummary = () => {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalProjects = stats.totalProjects;
  const activeProjects = stats.byStatus.approved + stats.byStatus.inProgress;
  const completedProjects = stats.byStatus.completed;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        Resumen de Participación
      </h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Proyectos Activos</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{activeProjects}/{totalProjects}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-lime-400 to-lime-600 rounded-full transition-all duration-500"
              style={{ width: `${totalProjects > 0 ? (activeProjects / totalProjects) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Proyectos Completados</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{completedProjects}/{totalProjects}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {stats.nearestDeadline && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Próximo Deadline</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {stats.nearestDeadline.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(stats.nearestDeadline.deadlineDate).toLocaleDateString('es-MX', { 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipationSummary;
