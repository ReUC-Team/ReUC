import React, { useState } from 'react';
import { downloadFile } from '../projectsService';
import pdfIcon from '@/assets/icons/pdf.svg';
import docIcon from '@/assets/icons/doc.svg';
import zipIcon from '@/assets/icons/zip.svg';
import excelIcon from '@/assets/icons/excel.svg';
import powerpointIcon from '@/assets/icons/powerpoint.svg';
import imageIcon from '@/assets/icons/image.svg';
import videoIcon from '@/assets/icons/video.svg';
import audioIcon from '@/assets/icons/audio.svg';
import textIcon from '@/assets/icons/text.svg';
import fileIcon from '@/assets/icons/file.svg';

const AttachmentCard = ({ file }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  // Formatear tamaño del archivo
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return null;
    
    if (mimeType.includes('pdf')) return pdfIcon;
    if (mimeType.includes('word') || mimeType.includes('document')) return docIcon;
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) return zipIcon;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return excelIcon;
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return powerpointIcon;
    if (mimeType.includes('image')) return imageIcon;
    if (mimeType.includes('video')) return videoIcon;
    if (mimeType.includes('audio')) return audioIcon;
    if (mimeType.includes('text')) return textIcon;

    return fileIcon;
  };

  // Manejar click en la card (abrir o descargar según tipo)
  const handleCardClick = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setError(null);
    
    try {

      if (file.type === 'application/pdf') {
        await downloadFile(file.downloadUrl, file.name, file.type, false);
      } else {
        await downloadFile(file.downloadUrl, file.name, file.type, true);
      }
    } catch (err) {
      setError(err.message || 'Error al procesar el archivo');
    } finally {
      setIsDownloading(false);
    }
  };

  // Manejar descarga forzada (para PDFs)
  const handleDownload = async (e) => {
    e.stopPropagation();
    
    if (isDownloading) return;
    
    setIsDownloading(true);
    setError(null);
    
    try {
      await downloadFile(file.downloadUrl, file.name, file.type, true);
    } catch (err) {
      setError(err.message || 'Error al descargar');
    } finally {
      setIsDownloading(false);
    }
  };

  // OBTENER ICONO
  const iconSrc = getFileIcon(file.type);

  return (
    <div 
      onClick={handleCardClick}
      className={`
        bg-white dark:bg-slate-800 rounded-lg shadow-md p-3 sm:p-4 
        transition-all duration-200
        ${isDownloading ? 'opacity-50 cursor-wait' : 'hover:shadow-lg cursor-pointer hover:scale-[1.02]'}
        border border-gray-200 dark:border-slate-700
      `}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icono y nombre */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            {iconSrc ? (
              <img 
                src={iconSrc} 
                alt="File icon" 
                className="w-8 h-8 object-contain"
              />
            ) : (
              // ICONO SVG POR DEFECTO
              <svg 
                className="w-10 h-10 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base" title={file.name}>
              {file.name}
            </h3>
            
            <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {file.size && (
                <span className="text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</span>
              )}
              
              {file.type === 'application/pdf' && (
                <span className="text-lime-600 dark:text-lime-400 font-medium">
                  • Click para vista previa
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Botón de descarga */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-shrink-0 p-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          title="Descargar archivo"
        >
          {isDownloading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-xs sm:text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default AttachmentCard;