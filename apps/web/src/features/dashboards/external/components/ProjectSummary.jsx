import { useExternalDashboardStats } from '../hooks/useExternalDashboardStats';

const ProjectSummary = () => {
  const { stats, isLoading } = useExternalDashboardStats();

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

  const totalProjects = stats.projects.length;
  const activeProjects = stats.projects.filter(p => 
    p.status?.slug === 'project_in_progress' || p.status?.slug === 'project_approved'
  ).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        Resumen de Proyectos
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-lime-100 dark:bg-lime-900/20 rounded-lg">
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Proyectos Aprobados</p>
            <p className="text-2xl font-bold text-lime-600 dark:text-lime-400">{totalProjects}</p>
          </div>
          <div className="w-12 h-12 bg-lime-100 dark:bg-lime-900/40 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <div className="flex justify-between items-center p-3 bg-lime-600 dark:bg-lime-900/20 rounded-lg">
          <div>
            <p className="text-xs font-medium text-white dark:text-gray-400 mb-1">Proyectos Activos</p>
            <p className="text-2xl font-bold text-white dark:text-lime-400">{activeProjects}</p>
          </div>
          <div className="w-12 h-12 bg-lime-600 dark:bg-lime-900/40 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tasa de Aprobación</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">{stats.approvalRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-2">
            <div 
              className="h-full bg-gradient-to-r from-lime-400 to-lime-600 rounded-full transition-all duration-500"
              style={{ width: `${stats.approvalRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;
