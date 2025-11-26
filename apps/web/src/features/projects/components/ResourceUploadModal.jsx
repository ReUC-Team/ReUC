import { useState, useRef } from 'react';
import Modal from '@/features/landing/components/Modal';

export default function ResourceUploadModal({ isOpen, onClose, onConfirm, isLoading, isEditing = false }) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      onConfirm(file);
    }
  };

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? "Reemplazar recurso" : "Subir nuevo recurso"}>
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          {isEditing 
            ? "Selecciona un nuevo archivo para reemplazar el existente. El historial de versiones se mantendrá." 
            : "Selecciona el archivo que deseas subir al proyecto."}
        </p>

        <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-200 cursor-pointer bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800"
             onClick={() => fileInputRef.current?.click()}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          
          {file ? (
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-lime-600 dark:text-lime-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-gray-900 dark:text-white">{file.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-3 p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200 hover:scale-110"
                title="Eliminar archivo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="font-medium text-gray-700 dark:text-gray-300">Haz clic para seleccionar un archivo</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">o arrastra y suelta aquí</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 dark:bg-gray-700"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            className="px-4 py-2 bg-lime-600 dark:bg-lime-600 text-white rounded-lg hover:bg-lime-700 dark:hover:bg-lime-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isEditing ? 'Reemplazar' : 'Subir'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
