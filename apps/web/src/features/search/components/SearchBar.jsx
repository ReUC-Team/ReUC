import { useAccessibility } from '@/context/AccesibilityContext';
import { useSearch } from '../hooks/useSearch';
import SearchDropdown from './SearchDropdown';

const SearchBar = () => {
  const { isDark, largeText, dyslexiaFont } = useAccessibility();
  const {
    searchTerm,
    results,
    isOpen,
    selectedIndex, 
    searchRef,
    handleSearch,
    handleSelect,
    handleFocus,
    handleMouseEnter,
  } = useSearch();

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Input de búsqueda */}
      <div className={`
        relative
        transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? 'scale-[1.01]' : 'scale-100'}
      `}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
            />
          </svg>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleFocus}
          placeholder="Buscar páginas..."
          className={`
            w-full pl-12 pr-12 py-3
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isDark
              ? 'bg-gray-800 text-white placeholder-gray-500'
              : 'bg-white text-gray-900 placeholder-gray-400'
            }
            ${isOpen 
              ? 'rounded-2xl shadow-lg' 
              : 'rounded-full shadow-md'
            }
            border
            ${isOpen
              ? 'border-lime-500'
              : isDark
              ? 'border-gray-700 focus:border-lime-500'
              : 'border-gray-300 focus:border-lime-500'
            }
            focus:outline-none
            ${largeText ? 'text-lg' : 'text-base'}
            ${dyslexiaFont ? 'font-dyslexia' : ''}
          `}
        />

        {/* Botón para limpiar */}
        {searchTerm && (
          <button
            onClick={() => handleSearch('')}
            className={`
              absolute inset-y-0 right-0 pr-4 flex items-center
              ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}
              transition-colors
            `}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown con resultados */}
      <SearchDropdown
        results={results}
        searchTerm={searchTerm}
        onSelect={handleSelect}
        isOpen={isOpen}
        selectedIndex={selectedIndex}
        onMouseEnter={handleMouseEnter}
      />
    </div>
  );
};

export default SearchBar;