import React, { useState } from 'react';

const DownloadButton = ({ file }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);
    
    try {
      // 1. Fetch el archivo usando el downloadUrl con ticket
      const response = await fetch(file.downloadUrl);

      if (!response.ok) {
        throw new Error(`Error al descargar: ${response.statusText}`);
      }

      // 2. Convertir a blob
      const blob = await response.blob();

      // 3. Crear enlace temporal
      const link = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);

      // 4. Configurar descarga con nombre original
      link.href = objectUrl;
      link.download = file.name; // ← Mantiene el nombre original del archivo
      
      // 5. Disparar descarga
      document.body.appendChild(link);
      link.click();
      
      // 6. Limpiar
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      
    } catch (err) {
      console.error('Error descargando archivo:', err);
      setError('No se pudo descargar el archivo. Intenta de nuevo.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Formatear tamaño del archivo
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="download-item">
      <button 
        onClick={handleDownload} 
        disabled={isDownloading}
        className="inline-flex items-center px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isDownloading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Descargando...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar {file.name}
          </>
        )}
      </button>
      
      {file.size && (
        <span className="ml-3 text-sm text-gray-600">
          ({formatFileSize(file.size)})
        </span>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default DownloadButton;