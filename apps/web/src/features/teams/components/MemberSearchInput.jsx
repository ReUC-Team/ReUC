import React from "react";
import MemberSearchResults from "./MemberSearchResults.jsx";

export default function MemberSearchInput({
  searchTerm,
  results,
  isSearching,
  isOpen,
  selectedIndex,
  onSearch,
  onSelect,
  onFocus,
  onMouseEnter,
}) {
  const isSearchTermTooShort = searchTerm.length > 0 && searchTerm.length < 3;
  
  return (
    <div className="relative">
      {/* Input */}
      <div className="relative">
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={onFocus}
          placeholder="Buscar por nombre o correo..."
          className={`w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 border ${
            isSearchTermTooShort 
              ? 'border-yellow-400 dark:border-yellow-500' 
              : 'border-gray-300 dark:border-gray-600'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
        />

        {isSearching && (
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 text-lime-600 w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
      </div>

      {/* Mensaje de ayuda cuando el término es muy corto */}
      {isSearchTermTooShort && (
        <div className="absolute z-40 w-full mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 flex items-start gap-2">
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            Escribe al menos 3 caracteres para buscar
          </p>
        </div>
      )}

      {/* Dropdown de Resultados */}
      <MemberSearchResults
        results={results}
        isOpen={isOpen && !isSearchTermTooShort}
        selectedIndex={selectedIndex}
        searchTerm={searchTerm}
        onSelect={onSelect}
        onMouseEnter={onMouseEnter}
      />
    </div>
  );
}