import React from "react";

export default function SaveTeamButton({ onClick, isLoading, disabled }) {
  return (
    <div className="flex justify-center pt-6">
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className="flex items-center gap-2 px-8 py-3 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
      >
        {isLoading ? (
          <>
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Guardando...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Guardar Equipo</span>
          </>
        )}
      </button>
    </div>
  );
}