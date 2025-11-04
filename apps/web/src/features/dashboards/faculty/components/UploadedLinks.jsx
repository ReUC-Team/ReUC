import useUploadedLinks from '../hooks/useUploadedLinks';

const UploadedLinks = () => {
  const {
    linksData,
    selectedLink,
    showReviewModal,
    reviewComment,
    pendingCount,
    setReviewComment,
    openReviewModal,
    closeReviewModal,
    handleReviewSubmit,
    openLink,
    copyLink,
    getLinkIcon
  } = useUploadedLinks();

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-6 gap-2">
        <svg className="text-3xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.99C4.77 7 2.9 8.77 2.9 11c0 2.23 1.87 4 4.09 4h4v-1.9H6.99c-1.71 0-3.09-1.39-3.09-3.1zM8 13h8v-2H8v2zm9.01-6H13v1.9h4.01c1.71 0 3.09 1.39 3.09 3.1s-1.38 3.1-3.09 3.1H13V17h4.01c2.22 0 4.09-1.77 4.09-4s-1.87-4-4.09-4z"/>
        </svg>
        <h2 className="font-semibold text-lg text-gray-800">Enlaces Subidos</h2>
        <span className="ml-auto bg-lime-100 text-lime-800 text-xs font-medium px-3 py-1 rounded-lg">
          {pendingCount} pendientes
        </span>
      </div>

      <div className="space-y-3">
        {linksData.map((link) => (
          <div key={link.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0 mt-1">
                {getLinkIcon(link.linkType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-sm">
                      {link.linkTitle}
                    </h3>
                    <p className="text-xs text-blue-600 truncate hover:text-blue-800 cursor-pointer" 
                       onClick={() => openLink(link)}>
                      {link.url}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-lime-300 to-lime-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {link.studentAvatar}
                      </div>
                      <p className="text-xs text-gray-600">
                        {link.name} • {link.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-xl text-xs font-medium ${link.statusColor}`}>
                      {link.statusText}
                    </span>
                  </div>
                </div>

                {link.description && (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {link.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                  <span>🔗 {link.linkType}</span>
                  <span>🗓️ {link.uploadTime}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openLink(link)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-3 py-1.5 rounded-md transition-colors duration-200"
                  >
                    Abrir enlace
                  </button>
                  
                  <button
                    onClick={() => copyLink(link)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md transition-colors duration-200"
                  >
                    Copiar URL
                  </button>
                  
                  {link.status === 'pending' && (
                    <button
                      onClick={() => openReviewModal(link)}
                      className="bg-lime-600 hover:bg-lime-700 text-white text-xs px-3 py-1.5 rounded-md transition-colors duration-200"
                    >
                      Revisar
                    </button>
                  )}
                  
                  {link.status !== 'pending' && (
                    <button
                      onClick={() => openReviewModal(link)}
                      className="bg-lime-100 hover:bg-lime-200 text-lime-700 text-xs px-3 py-1.5 rounded-md transition-colors duration-200"
                    >
                      Ver comentarios
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showReviewModal && selectedLink && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-2">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Revisar enlace
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                <p><strong>Enlace:</strong> {selectedLink.linkTitle}</p>
                <p><strong>URL:</strong> 
                  <a href={selectedLink.url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 ml-1 break-all">
                    {selectedLink.url}
                  </a>
                </p>
                <p><strong>Estudiante:</strong> {selectedLink.name}</p>
                <p><strong>Proyecto:</strong> {selectedLink.title}</p>
              </div>
            </div>
            
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentarios de revisión
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Escribe tus comentarios sobre el enlace..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <button
                  onClick={closeReviewModal}
                  className="px-4 py-2 bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors rounded-md"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={() => handleReviewSubmit('reject')}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                >
                  Rechazar
                </button>
                
                <button
                  onClick={() => handleReviewSubmit('request-changes')}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
                >
                  Solicitar cambios
                </button>
                
                <button
                  onClick={() => handleReviewSubmit('approve')}
                  className="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-md transition-colors"
                >
                  Aprobar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadedLinks;