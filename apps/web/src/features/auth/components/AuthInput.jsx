import React from 'react';

/**
 * Input con soporte para mostrar errores específicos por campo
 * 
 * @param {string} label - Etiqueta del campo
 * @param {string} name - Nombre del campo (debe coincidir con el backend)
 * @param {object} error - Objeto de error con { message, rule, expected }
 * @param {function} onChange - Handler del cambio
 * @param {object} props - Otras props HTML del input
 */
const AuthInput = ({ label, name, error, onChange, ...props }) => {
  const hasError = !!error;

  return (
    <div className="flex flex-col">
      <label 
        htmlFor={name}
        className="text-base sm:text-lg font-bold mb-1 ml-2 text-gray-700"
      >
        {label}
      </label>
      
      <input
        id={name}
        name={name}
        onChange={onChange}
        className={`rounded-xl px-3 py-2 transition-colors ${
          hasError 
            ? 'bg-red-50 border-2 border-red-500 focus:outline-none focus:ring-2 focus:ring-red-300' 
            : 'bg-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-600'
        }`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        {...props}
      />

      {/* ✅ NUEVO: Mostrar mensaje de error específico del campo */}
      {hasError && (
        <p 
          id={`${name}-error`}
          className="mt-1 text-sm text-red-600 flex items-center gap-1 ml-2"
        >
          <svg 
            className="w-4 h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default AuthInput;