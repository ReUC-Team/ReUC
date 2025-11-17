import { useAccessibility } from '@/context/AccesibilityContext';
import { highlightMatch } from '../utils/searchHelpers.jsx';

const SearchResultCard = ({ route, searchTerm, onSelect, isSelected }) => {
  const { isDark, largeText, dyslexiaFont } = useAccessibility();

  // Iconos según el tipo de ruta
  const getIcon = () => {
    const iconClass = `text-2xl ${isDark ? 'text-lime-400' : 'text-lime-600'}`;
    
    const icons = {
      home: (
        <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 3s-6.186 5.34-9.643 8.232A1.04 1.04 0 0 0 2 12a1 1 0 0 0 1 1h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a1 1 0 0 0 1-1a.98.98 0 0 0-.383-.768C18.184 8.34 12 3 12 3"/>
        </svg>
      ),
      explore: (
        <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/>
        </svg>
      ),
      request: (
      <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 28 28">
        <path fill="currentColor" d="M8.5 11.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-1 8a1 1 0 1 1 2 0a1 1 0 0 1-2 0M3 6.75A3.75 3.75 0 0 1 6.75 3h14.5A3.75 3.75 0 0 1 25 6.75v14.5A3.75 3.75 0 0 1 21.25 25H6.75A3.75 3.75 0 0 1 3 21.25zm3 5.75a2.5 2.5 0 1 0 5 0a2.5 2.5 0 0 0-5 0M8.5 17a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5m4.5-4.75c0 .414.336.75.75.75h7.5a.75.75 0 0 0 0-1.5h-7.5a.75.75 0 0 0-.75.75m.75 6.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5zM6 6.75c0 .414.336.75.75.75h14.5a.75.75 0 0 0 0-1.5H6.75a.75.75 0 0 0-.75.75"/>
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
    favorites: (
      <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M17.562 21.56a1 1 0 0 1-.465-.115L12 18.765l-5.097 2.68a1 1 0 0 1-1.451-1.054l.973-5.676l-4.123-4.02a1 1 0 0 1 .554-1.705l5.699-.828l2.548-5.164a1.042 1.042 0 0 1 1.794 0l2.548 5.164l5.699.828a1 1 0 0 1 .554 1.706l-4.123 4.019l.973 5.676a1 1 0 0 1-.986 1.169"/>
      </svg>
    ),
    members: (
      <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor" fillRule="evenodd" d="M8 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8m-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4zm7.25-2.095c.478-.86.75-1.85.75-2.905a6 6 0 0 0-.75-2.906a4 4 0 1 1 0 5.811M15.466 20c.34-.588.535-1.271.535-2v-1a5.98 5.98 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2z" clipRule="evenodd"/>
      </svg>
    ),
      admin: (
        <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"/>
        </svg>
      ),
      default: (
        <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M10 17v-3H3v-4h7V7l5 5z"/>
        </svg>
      )
    };

    return icons[route.icon] || icons.default;
  };

  return (
    <button
      onClick={onSelect}
      className={`
        w-full flex items-center gap-4 p-4 
        rounded-lg transition-all duration-200
        ${isDark 
          ? isSelected 
            ? 'bg-gray-700 border-lime-500'
            : 'hover:bg-gray-700 bg-gray-800' 
          : isSelected
            ? 'bg-gray-100 border-lime-500'
            : 'hover:bg-gray-100 bg-white'
        }
        ${largeText ? 'text-lg' : 'text-base'}
        ${dyslexiaFont ? 'font-dyslexia' : ''}
        border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}
        ${isSelected ? 'border-lime-500 shadow-lg' : 'hover:border-lime-500 hover:shadow-md'} 
      `}
    >
      {/* Icono */}
      <div className="flex-shrink-0">
        {getIcon()}
      </div>

      {/* Contenido */}
      <div className="flex-1 text-left">
        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {highlightMatch(route.label, searchTerm)}
        </div>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {route.path}
        </div>
      </div>

      {/* Flecha */}
      <div className="flex-shrink-0">
        <svg 
          className={`text-xl ${
            isSelected 
              ? 'text-lime-500' 
              : isDark 
                ? 'text-gray-500' 
                : 'text-gray-400'
          }`} 
          xmlns="http://www.w3.org/2000/svg" 
          width="1em" 
          height="1em" 
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z"/>
        </svg>
      </div>
    </button>
  );
};

export default SearchResultCard;