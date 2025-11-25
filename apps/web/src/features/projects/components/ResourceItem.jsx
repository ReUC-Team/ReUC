import { formatISODateSpanish } from '@/utils/dateUtils';

export default function ResourceItem({ resource, onDownload, onEdit, onDelete, canManage, teamMembers = [] }) {
  const isDeleted = resource.deletedAt;
  
  // Encontrar el autor del recurso en teamMembers usando uuidAuthor
  const author = teamMembers.find(member => member.uuid_user === resource.uuidAuthor);
  const authorName = author?.fullName || 'Desconocido';

  return (
    <div className={`flex items-center justify-between p-4 bg-white dark:bg-slate-800 border rounded-lg ${isDeleted ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-slate-700'}`}>
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 bg-lime-100 dark:bg-lime-900/30 rounded-lg text-lime-600 dark:text-lime-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="min-w-0">
          <h4 className={`font-medium truncate ${isDeleted ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
            {resource.name}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatISODateSpanish(resource.createdAt)}</span>
            <span>•</span>
            <span>{authorName}</span>
            {isDeleted && <span className="text-red-500 font-medium">• Eliminado</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onDownload(resource)}
          className="p-2 text-gray-500 hover:text-lime-600 dark:text-gray-400 dark:hover:text-lime-400 transition rounded-full hover:bg-lime-50 dark:hover:bg-lime-900/20"
          title="Descargar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>

        {canManage && !isDeleted && (
          <>
            <button
              onClick={() => onEdit(resource)}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title="Reemplazar archivo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(resource)}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Eliminar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
