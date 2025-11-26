import { useProjects } from '../hooks/useProjects';
import { statusConfig, projectUtils } from '../utils/ProjectsUtils';

const Projects = ({ 
  dashboardType,
  onProjectClick,
  onViewTeam,
  onUploadComment,
  onCheckDeliverables,
  className = ''
}) => {
  const { projects, loading, error, refreshProjects } = useProjects(dashboardType);
  const config = projectUtils.getDashboardConfig(dashboardType);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-slate-700 w-full ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-l-4 border-gray-200 dark:border-slate-600 rounded-r-lg p-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 dark:bg-slate-600 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-100 dark:bg-slate-600 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-slate-700 w-full ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-semibold text-lg sm:text-xl text-gray-800 dark:text-gray-100">{config.title}</h2>
        </div>
        
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
          <button 
            onClick={refreshProjects}
            className="text-sm text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 font-medium transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-slate-700 w-full ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex gap-3 mb-2 items-center">
              <svg className='text-3xl text-lime-600 dark:text-lime-400' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19v-6.25h7V21zm7 0v-8.25h9V19q0 .825-.587 1.413T19 21zM3 10.75V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v5.75z"/>
              </svg>
              <h2 className="font-semibold text-lg sm:text-xl text-gray-800 dark:text-gray-100">{config.title}</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {projectUtils.getProjectCountText(projects.length, dashboardType)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: config.maxHeight }}>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">No hay proyectos disponibles</p>
          </div>
        ) : (
          projects.map((project) => (
            <div 
              key={project.id} 
              className="border-l-4 rounded-r-lg border-lime-600 dark:border-lime-500 p-4 hover:shadow-md transition-all duration-200 shadow-sm bg-gray-50 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Students information - Solo si está habilitado y hay estudiantes */}
                {config.showStudents && project.students.length > 0 && (
                  <div className="flex-shrink-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex flex-col gap-2">
                        {project.students.slice(0, 3).map((student, idx) => (
                          <div key={idx} className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {projectUtils.getInitials(student.name)}
                          </div>
                        ))}
                      </div>
                      <div className="min-w-0 flex-1">
                        {project.students.slice(0, 3).map((student, idx) => (
                          <div key={idx} className={`${idx > 0 ? 'mt-2 pt-2 border-t border-gray-200 dark:border-slate-600' : ''}`}>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                              {student.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {student.email}
                            </p>
                          </div>
                        ))}
                        {project.students.length > 1 && (
                          <div className="mt-2">
                            <span className="text-xs bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-400 px-2 py-1 rounded-full">
                              {project.students.length} miembros
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-1 truncate">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      {config.showCompany && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Autor:</span> {project.company}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusConfig[project.status]?.color || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      } flex items-center gap-1`}>
                        <span className={`w-2 h-2 rounded-full ${
                          statusConfig[project.status]?.dot || 'bg-gray-400'
                        }`}></span>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Removido progress porque no está disponible en backend */}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className='flex items-center gap-2'> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#65a30d" d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2M9 18H7v-2h2zm0-4H7v-2h2zm4 4h-2v-2h2zm0-4h-2v-2h2zm4 4h-2v-2h2zm0-4h-2v-2h2zm2-5H5V7h14z"/></svg> {projectUtils.formatDate(project.assigmentDate)}</span>
                    <span className='flex items-center gap-2'><svg className="text-lime-600" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z"/></svg>{projectUtils.calculateDaysElapsed(project.lastActivity)}</span>
                    {config.showDeliverables && project.deliverables > 0 && (
                      <span className='flex items-center gap-2'> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#65a30d" fill-rule="evenodd" d="M12 2H6a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-8h-6a3 3 0 0 1-3-3zm9 7v-.172a3 3 0 0 0-.879-2.12l-3.828-3.83A3 3 0 0 0 14.172 2H14v6a1 1 0 0 0 1 1z" clip-rule="evenodd"/></svg>{project.deliverables} recursos</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {config.showDetailsButton && (
                      <button 
                        onClick={() => {
                          console.log("🔍 Projects Component - Proyecto clickeado:", project);
                          onProjectClick?.(project);
                        }}
                        className="px-3 py-1 bg-lime-600 dark:bg-lime-900/30 text-white dark:text-lime-400 rounded-lg text-xs font-medium hover:bg-lime-200 dark:hover:bg-lime-900/50 transition-colors"
                      >
                        Ver detalles
                      </button>
                    )}
                    {config.showTeamButton && project.students.length > 0 && (
                      <button 
                        onClick={() => onViewTeam?.(project)}
                        className="px-3 py-1 bg-gray-600 dark:bg-blue-900/30 text-white dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Ver equipo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;