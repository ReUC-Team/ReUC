import { useAccessibility } from '@/context/AccesibilityContext';
import { useEffect, useRef } from 'react';
import SearchResultCard from './SearchResultCard';

const SearchDropdown = ({ results, searchTerm, onSelect, isOpen, selectedIndex, onMouseEnter }) => {
  const { isDark, largeText, dyslexiaFont } = useAccessibility();
  const selectedRef = useRef(null); // referencia al elemento seleccionado

  // Auto-scroll al elemento seleccionado
  useEffect(() => {
    if (selectedRef.current && selectedIndex >= 0) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className={`
        absolute top-full left-0 right-0 mt-2
        rounded-lg shadow-2xl overflow-hidden
        animate-slideDown z-50
        ${isDark ? 'bg-gray-800' : 'bg-white'}
        border ${isDark ? 'border-gray-700' : 'border-gray-200'}
      `}
      style={{
        maxHeight: '500px',
        overflowY: 'auto',
      }}
    >
      {results.length > 0 ? (
        <div className="p-2 space-y-2">
          {results.map((route, index) => (
            <div
              key={`${route.path}-${index}`}
              ref={selectedIndex === index ? selectedRef : null} // referencia al seleccionado
              onMouseEnter={() => onMouseEnter(index)} // actualizar selección con hover
            >
              <SearchResultCard
                route={route}
                searchTerm={searchTerm}
                onSelect={() => onSelect(index)}
                isSelected={selectedIndex === index} // pasar si está seleccionado
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={`
          p-8 text-center
          ${largeText ? 'text-lg' : 'text-base'}
          ${dyslexiaFont ? 'font-dyslexia' : ''}
        `}>
          <svg 
            className={`mx-auto mb-4 text-6xl ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
            xmlns="http://www.w3.org/2000/svg" 
            width="1em" 
            height="1em" 
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/>
          </svg>
          <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            No se encontraron resultados
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}

      {/* Indicador de resultados */}
      {results.length > 0 && (
        <div className={`
          px-4 py-2 text-sm border-t
          ${isDark 
            ? 'bg-gray-900 border-gray-700 text-gray-400' 
            : 'bg-gray-50 border-gray-200 text-gray-600'
          }
        `}>
          {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
          {/* Mostrar ayuda de teclado */}
          <span className="ml-2 text-xs opacity-75">
            (↑↓ navegar • Enter seleccionar • Esc cerrar)
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;