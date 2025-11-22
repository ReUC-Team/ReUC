import React, { useRef, useEffect } from "react";

export default function MemberSearchResults({
  results,
  isOpen,
  selectedIndex,
  searchTerm,
  onSelect,
  onMouseEnter,
}) {
  const selectedRef = useRef(null);

  // Auto-scroll al elemento seleccionado
  useEffect(() => {
    if (selectedRef.current && selectedIndex >= 0) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  if (!isOpen || results.length === 0) {
    return null;
  }

  // Función para resaltar el texto coincidente
  const highlightMatch = (text, search) => {
    if (!search || !text) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={index} className="bg-lime-200 dark:bg-lime-700 font-semibold">
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
      {results.map((member, index) => {
        const fullName = `${member.firstName || ""} ${member.middleName || ""} ${member.lastName || ""}`.trim();
        const isSelected = index === selectedIndex;

        return (
          <button
            key={member.uuidUser}
            ref={isSelected ? selectedRef : null}
            onClick={() => onSelect(member)}
            onMouseEnter={() => onMouseEnter(index)}
            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              isSelected ? "bg-gray-100 dark:bg-gray-700" : ""
            } first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 dark:border-gray-700 last:border-b-0`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-lime-100 dark:bg-lime-900 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {highlightMatch(fullName, searchTerm)}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{highlightMatch(member.email, searchTerm)}</span>
              </div>
              {member.universityId && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  ID: {member.universityId}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}