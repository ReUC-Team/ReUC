import React from 'react';
import { useAccessibility } from '@/context/AccesibilityContext';

const Overview = ({ profile }) => {
  const { isDark, largeText, dyslexiaFont } = useAccessibility();
  
  const firstName = profile.firstName || "Sin nombre";
  const middleName = profile.middleName || "";
  const lastName = profile.lastName || "";
  const location = profile.location || "Sin ubicación";
  const organizationName = profile.organizationName || "Sin organización";
  const phoneNumber = profile.phoneNumber || "Sin teléfono";
  const description = profile.description || "Sin descripción";
  const email = profile.email || "Sin correo";
  
  const fullName = `${firstName} ${middleName} ${lastName}`.trim();
  
  return (
    <div className={`
      p-6 rounded-xl shadow-lg space-y-6
      ${isDark ? 'bg-gray-800' : 'bg-white'}
      ${largeText ? 'text-lg' : 'text-base'}
      ${dyslexiaFont ? 'font-dyslexia' : ''}
    `}>
      {/* Información Personal */}
      <div>
        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Información Personal
        </h3>
        
        <div className="space-y-4">
          {/* Nombre Completo */}
          <div className="flex items-start gap-3">
            <svg 
              className="w-5 h-5 text-lime-600 mt-1 flex-shrink-0" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Nombre completo
              </p>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {fullName}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <svg 
              className="w-5 h-5 text-lime-600 mt-1 flex-shrink-0" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Correo electrónico
              </p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                {email}
              </p>
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex items-start gap-3">
            <svg 
              className="w-5 h-5 text-lime-600 mt-1 flex-shrink-0" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Teléfono de contacto
              </p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                {phoneNumber}
              </p>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex items-start gap-3">
            <svg 
              className="w-5 h-5 text-lime-600 mt-1 flex-shrink-0" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Ubicación
              </p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                {location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Información Organizacional */}
      <div className={`border-t pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Información Organizacional
        </h3>
        
        <div className="flex items-start gap-3">
          <svg 
            className="w-5 h-5 text-lime-600 mt-1 flex-shrink-0" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
          </svg>
          <div className="flex-1">
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Organización
            </p>
            <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
              {organizationName}
            </p>
          </div>
        </div>
      </div>
      
      {/* Sobre mí */}
      <div className={`border-t pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Sobre mí
        </h3>
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`leading-relaxed whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;