import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileIncompleteModal({ 
  isOpen, 
  onClose, 
  showCloseButton = true,
  title = "Perfil Incompleto",
  message = "Para poder solicitar proyectos, necesitas completar tu información de perfil.",
  subMessage = "Esto nos ayuda a conectarte mejor con los estudiantes y proyectos adecuados."
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToProfile = () => {
    onClose?.();
    navigate('/profile');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-fade-in z-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            {message}
          </p>
          <p className="text-sm text-gray-500">
            {subMessage}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleGoToProfile}
            className="flex-1 bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-colors font-medium cursor-pointer"
          >
            Completar Perfil
          </button>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Más tarde
            </button>
          )}
        </div>
      </div>
    </div>
  );
}