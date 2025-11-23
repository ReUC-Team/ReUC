import { Link, useLocation } from "react-router-dom";
import { useState } from 'react';
import { useAccessibility } from '../context/AccesibilityContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getSidebarItemsByRole } from '../config/sidebarConfig.js';
import useGetProfile from '@/features/profile/hooks/useGetProfile';

// Componente para renderizar los iconos del sidebar
const SidebarIcon = ({ icon, isDark }) => {
  const iconClass = `text-2xl ${isDark ? 'text-white' : 'text-gray-700'}`;
  
  const icons = {
    home: (
      <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 3s-6.186 5.34-9.643 8.232A1.04 1.04 0 0 0 2 12a1 1 0 0 0 1 1h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a1 1 0 0 0 1-1a.98.98 0 0 0-.383-.768C18.184 8.34 12 3 12 3"/>
      </svg>
    ),
    request: (
      <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 28 28">
        <path fill="currentColor" d="M8.5 11.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-1 8a1 1 0 1 1 2 0a1 1 0 0 1-2 0M3 6.75A3.75 3.75 0 0 1 6.75 3h14.5A3.75 3.75 0 0 1 25 6.75v14.5A3.75 3.75 0 0 1 21.25 25H6.75A3.75 3.75 0 0 1 3 21.25zm3 5.75a2.5 2.5 0 1 0 5 0a2.5 2.5 0 0 0-5 0M8.5 17a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5m4.5-4.75c0 .414.336.75.75.75h7.5a.75.75 0 0 0 0-1.5h-7.5a.75.75 0 0 0-.75.75m.75 6.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5zM6 6.75c0 .414.336.75.75.75h14.5a.75.75 0 0 0 0-1.5H6.75a.75.75 0 0 0-.75.75"/>
      </svg>
    ),
    explore: (
      <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
        <defs>
          <mask id="searchIconMask">
            <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
              <path fill="#555" d="M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z"/>
              <path strokeLinecap="round" d="M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485"/>
            </g>
          </mask>
        </defs>
        <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#searchIconMask)"/>
      </svg>
    ),
    applications: (
      <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm4 18H6V4h7v5h5z"/>
        <path fill="currentColor" d="M8 15.5h8v1.5H8zm0-3h8V14H8zm0-3h5v1.5H8z"/>
      </svg>
    ),
    myProjects: (
      <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <rect width="10" height="10" x="12" y="2" fill="currentColor" rx="2"/>
        <path fill="currentColor" d="M12 7h-1c-1.886 0-2.828 0-3.414.586S7 9.114 7 11v2c0 1.886 0 2.828.586 3.414S9.114 17 11 17h2c1.886 0 2.828 0 3.414-.586S17 14.886 17 13v-1h-1c-1.886 0-2.828 0-3.414-.586S12 9.886 12 8z" opacity=".7"/>
        <path fill="currentColor" d="M7 12v1c0 1.886 0 2.828.586 3.414S9.114 17 11 17h1v1c0 1.886 0 2.828-.586 3.414S9.886 22 8 22H6c-1.886 0-2.828 0-3.414-.586S2 19.886 2 18v-2c0-1.886 0-2.828.586-3.414S4.114 12 6 12z" opacity=".4"/>
      </svg>
    ),
    // favorites: (
    //   <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    //     <path fill="currentColor" d="M17.562 21.56a1 1 0 0 1-.465-.115L12 18.765l-5.097 2.68a1 1 0 0 1-1.451-1.054l.973-5.676l-4.123-4.02a1 1 0 0 1 .554-1.705l5.699-.828l2.548-5.164a1.042 1.042 0 0 1 1.794 0l2.548 5.164l5.699.828a1 1 0 0 1 .554 1.706l-4.123 4.019l.973 5.676a1 1 0 0 1-.986 1.169"/>
    //   </svg>
    // ),
    // members: (
    //   <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    //     <path fill="currentColor" fillRule="evenodd" d="M8 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8m-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4zm7.25-2.095c.478-.86.75-1.85.75-2.905a6 6 0 0 0-.75-2.906a4 4 0 1 1 0 5.811M15.466 20c.34-.588.535-1.271.535-2v-1a5.98 5.98 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2z" clipRule="evenodd"/>
    //   </svg>
    // ),
    admin: (
      <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor" d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"/>
      </svg>
    )
  };

  return icons[icon] || icons.home;
};

export default function Sidebar() {
  const { 
    isDark, 
    toggleTheme, 
    largeText, 
    toggleLargeText, 
    highContrast, 
    toggleHighContrast, 
    dyslexiaFont, 
    toggleDyslexiaFont 
  } = useAccessibility();
  
  const { role, isLoading } = useAuth();
  const { profile } = useGetProfile();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openAccesibilidad, setOpenAccesibilidad] = useState(false);

  // Obtener las rutas permitidas según el rol del usuario
  const sidebarItems = getSidebarItemsByRole(role);

  // Verificar si una ruta está activa
  const isActiveRoute = (path) => location.pathname === path;

  // Generar avatar a partir del nombre
  const generateAvatarFromName = (firstName, middleName, lastName) => {
    if (!firstName && !middleName && !lastName) return 'U';
    
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    
    return first + last || first || 'U';
  };

  const avatarInitials = generateAvatarFromName(
    profile.firstName,
    profile.middleName,
    profile.lastName
  );

  const fullName = `${profile.firstName || ''} ${profile.middleName || ''} ${profile.lastName || ''}`.trim() || 'Usuario';

  // Mostrar loading mientras se carga el usuario
  if (isLoading) {
    return (
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${isCollapsed ? 'w-20' : 'w-64'} ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-xl flex items-center justify-center transition-all duration-300 z-30`}>
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
          <p className="text-sm text-gray-500">Cargando...</p>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Sidebar fijo debajo del header */}
      <aside className={`fixed left-0 top-25 h-[calc(100vh-4rem)] ${isCollapsed ? 'w-20' : 'w-64'} ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-xl overflow-y-auto overflow-x-hidden transition-all duration-300 z-30 border-r`}>
        {/* Botón de colapsar */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-6 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-full p-1.5 shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-colors z-50`}
          title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''} ${isDark ? 'text-white' : 'text-gray-700'}`}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Perfil - Área clicable */}
        <Link 
          to="/profile"
          className={`flex items-center gap-3 p-6 border-b ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} transition-colors group`}
          title={isCollapsed ? fullName : ''}
        >
          <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform shadow-md`}>
            {avatarInitials}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden flex-1">
              <h1 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                {fullName}
              </h1>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                {role === 'professor' ? 'Profesor' : role === 'student' ? 'Estudiante' : role === 'outsider' ? 'Externo' : 'Usuario'}
              </span>
            </div>
          )}
          {!isCollapsed && (
            <svg 
              className={`w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          )}
        </Link>

        <nav className="py-4">
          <ul className="flex flex-col gap-1 px-3">
            {/* Renderizar rutas dinámicamente según el rol */}
            {sidebarItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                      isActive 
                        ? isDark 
                          ? 'bg-gradient-to-l from-lime-400 to-lime-600 text-white' 
                          : 'bg-gradient-to-l from-lime-400 to-lime-600 text-white'
                        : isDark 
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                    } ${largeText ? 'text-lg' : 'text-base'} ${dyslexiaFont ? 'font-dyslexia' : ''}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className={`flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                      <SidebarIcon icon={item.icon} isDark={isDark || isActive} />
                    </div>
                    {!isCollapsed && (
                      <span className="truncate font-medium">{item.label}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Separador */}
            <li className={`my-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></li>

            {/* Accesibilidad */}
            <li>
              <button
                onClick={() => setOpenAccesibilidad(!openAccesibilidad)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                } ${largeText ? 'text-lg' : 'text-base'} ${dyslexiaFont ? 'font-dyslexia' : ''}`}
                title={isCollapsed ? 'Accesibilidad' : ''}
              >
                <svg 
                  className={`flex-shrink-0 text-2xl group-hover:scale-110 transition-transform ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-700'}`}
                  xmlns="http://www.w3.org/2000/svg" 
                  width="1em" 
                  height="1em" 
                  viewBox="0 0 512 512"
                >
                  <path fill="currentColor" d="M256 112a56 56 0 1 1 56-56a56.06 56.06 0 0 1-56 56"/>
                  <path fill="currentColor" d="m432 112.8l-.45.12l-.42.13c-1 .28-2 .58-3 .89c-18.61 5.46-108.93 30.92-172.56 30.92c-59.13 0-141.28-22-167.56-29.47a74 74 0 0 0-8-2.58c-19-5-32 14.3-32 31.94c0 17.47 15.7 25.79 31.55 31.76v.28l95.22 29.74c9.73 3.73 12.33 7.54 13.6 10.84c4.13 10.59.83 31.56-.34 38.88l-5.8 45l-32.19 176.19q-.15.72-.27 1.47l-.23 1.27c-2.32 16.15 9.54 31.82 32 31.82c19.6 0 28.25-13.53 32-31.94s28-157.57 42-157.57s42.84 157.57 42.84 157.57c3.75 18.41 12.4 31.94 32 31.94c22.52 0 34.38-15.74 32-31.94a57 57 0 0 0-.76-4.06L329 301.27l-5.79-45c-4.19-26.21-.82-34.87.32-36.9a1 1 0 0 0 .08-.15c1.08-2 6-6.48 17.48-10.79l89.28-31.21a17 17 0 0 0 1.62-.52c16-6 32-14.3 32-31.93S451 107.81 432 112.8"/>
                </svg>
                {!isCollapsed && (
                  <>
                    <span className="truncate font-medium flex-1 text-left">Accesibilidad</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${openAccesibilidad ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </>
                )}
              </button>
              
              {!isCollapsed && openAccesibilidad && (
                <ul className="mt-1 space-y-1 pl-3">
                  <li>
                    <button
                      onClick={toggleTheme}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm`}
                    >
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.353 3C5.849 4.408 3 7.463 3 11.47A9.53 9.53 0 0 0 12.53 21c4.007 0 7.062-2.849 8.47-6.353C8.17 17.065 8.14 8.14 9.353 3"/>
                      </svg>
                      <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={toggleLargeText}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm`}
                    >
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                        <path d="M32 256h192v64h-64v192H96V320H32zm448-128H354.125v384h-68.25V128H160V64h320z"/>
                      </svg>
                      <span>{largeText ? 'Texto normal' : 'Texto grande'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={toggleHighContrast}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm`}
                    >
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5zm12.025-3h-5v-1.5h5zM5.5 9h2v2H9V9h2V7.5H9v-2H7.5v2h-2z"/>
                      </svg>
                      <span>{highContrast ? 'Contraste normal' : 'Alto contraste'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={toggleDyslexiaFont}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } text-sm`}
                    >
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.51 2.6L.25 13.67h1.34l1.49-3.86h4l1.52 3.86h1.34L5.68 2.6a.63.63 0 0 0-1.17 0m-.95 6l1.54-4l1.53 4zm9.35-2.54a2.8 2.8 0 0 0-3 2.08l1.21.31a1.6 1.6 0 0 1 1.78-1.14c.77 0 1.59.26 1.59 1v.75c-.27 0-.63.09-.94.13a9.1 9.1 0 0 0-2.5.52a2.06 2.06 0 0 0-1.41 2.23a1.94 1.94 0 0 0 .88 1.44a3 3 0 0 0 1.62.43a4.4 4.4 0 0 0 1.36-.22a2.9 2.9 0 0 0 1-.52v.61h1.25V8.3c0-1.3-1.14-2.24-2.84-2.24m.22 6.33a2.4 2.4 0 0 1-1.91-.07a.64.64 0 0 1-.32-.52c-.1-.89.82-1.16 2.8-1.38l.76-.1c-.19 1.68-.94 1.94-1.33 2.07"/>
                      </svg>
                      <span>{dyslexiaFont ? 'Fuente normal' : 'Fuente dislexia'}</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Separador */}
            <li className={`my-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></li>

            {/* Ayuda */}
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                } ${largeText ? 'text-lg' : 'text-base'} ${dyslexiaFont ? 'font-dyslexia' : ''}`}
                title={isCollapsed ? 'Ayuda' : ''}
              >
                <svg 
                  className={`flex-shrink-0 text-2xl group-hover:scale-110 transition-transform ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-700'}`}
                  xmlns="http://www.w3.org/2000/svg" 
                  width="1em" 
                  height="1em" 
                  viewBox="0 0 48 48"
                >
                  <defs>
                    <mask id="helpIconMask">
                      <g fill="none">
                        <path fill="#fff" stroke="#fff" strokeLinejoin="round" strokeWidth="4" d="M24 44a19.94 19.94 0 0 0 14.142-5.858A19.94 19.94 0 0 0 44 24a19.94 19.94 0 0 0-5.858-14.142A19.94 19.94 0 0 0 24 4A19.94 19.94 0 0 0 9.858 9.858A19.94 19.94 0 0 0 4 24a19.94 19.94 0 0 0 5.858 14.142A19.94 19.94 0 0 0 24 44Z"/>
                        <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M24 28.625v-4a6 6 0 1 0-6-6"/>
                        <path fill="#000" fillRule="evenodd" d="M24 37.625a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5" clipRule="evenodd"/>
                      </g>
                    </mask>
                  </defs>
                  <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#helpIconMask)"/>
                </svg>
                {!isCollapsed && <span className="truncate font-medium">Ayuda</span>}
              </button>
            </li>
            
            {/* Configuración */}
            <li>
              <Link
                to="/settings"
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActiveRoute('/settings')
                    ? isDark 
                      ? 'bg-gradient-to-l from-lime-400 to-lime-600 text-white' 
                      : 'bg-gradient-to-l from-lime-400 to-lime-600 text-white'
                    : isDark 
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                } ${largeText ? 'text-lg' : 'text-base'} ${dyslexiaFont ? 'font-dyslexia' : ''}`}
                title={isCollapsed ? 'Configuración' : ''}
              >
                <svg 
                  className={`flex-shrink-0 text-2xl ${isActiveRoute('/settings') ? 'scale-110' : 'group-hover:scale-110'} transition-transform ${isDark || isActiveRoute('/settings') ? 'text-current' : 'text-gray-700'}`}
                  xmlns="http://www.w3.org/2000/svg" 
                  width="1em" 
                  height="1em" 
                  viewBox="0 0 24 24"
                >
                  <path fill="currentColor" d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"/>
                </svg>
                {!isCollapsed && <span className="truncate font-medium">Configuración</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Espaciador para el contenido principal */}
      <div className={`${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 transition-all duration-300`}></div>
    </>
  );
}