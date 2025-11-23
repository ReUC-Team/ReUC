import React, { useState, useEffect, useMemo } from 'react';
import { parseDateLocal, formatDateSpanish } from '@/utils/dateUtils';

export default function UpdateDeadlineModal({ 
  isOpen, 
  onClose, 
  project, 
  onConfirm, 
  isLoading 
}) {
  const [newDeadline, setNewDeadline] = useState('');
  const [validationError, setValidationError] = useState('');

  // Calcular fechas mínimas y máximas basadas en el tipo de proyecto
  const dateConstraints = useMemo(() => {
    if (!project?.createdAt || !project?.projectTypes?.[0]) {
      return null;
    }

    const projectType = project.projectTypes[0];
    const createdDate = parseDateLocal(project.createdAt.split('T')[0]);
    
    const minMonths = projectType.minEstimatedMonths || 0;
    // Calcular fechas mínima y máxima permitidas
    // Mínimo: Fecha de creación + meses mínimos del tipo de proyecto
    const minDate = new Date(createdDate);
    minDate.setMonth(minDate.getMonth() + minMonths);

    // Máximo: Regla de negocio específica -> 1 mes después de la fecha mínima
    const maxDate = new Date(minDate);
    maxDate.setMonth(maxDate.getMonth() + 1);

    return {
      minDate,
      maxDate,
      minDateString: minDate.toISOString().split('T')[0],
      maxDateString: maxDate.toISOString().split('T')[0],
      minMonths,
      maxMonths: minMonths + 1 // Ajustamos visualmente para reflejar la regla
    };
  }, [project]);

  // Inicializar con la fecha actual del proyecto o la mínima permitida
  useEffect(() => {
    if (isOpen && project?.estimatedDate && dateConstraints) {
      const currentDeadline = project.estimatedDate.split('T')[0];
      
      // Si la fecha actual es menor a la mínima permitida se usa la mínima
      if (new Date(currentDeadline) < dateConstraints.minDate) {
        setNewDeadline(dateConstraints.minDateString);
      } else {
        setNewDeadline(currentDeadline);
      }
      setValidationError('');
    }
  }, [isOpen, project, dateConstraints]);

  // Valida la fecha en tiempo real
  useEffect(() => {
    if (!newDeadline || !dateConstraints) {
      setValidationError('');
      return;
    }

    const selectedDate = parseDateLocal(newDeadline);
    
    // Normalizar a medianoche para comparar solo fechas sin horas
    const selectedTime = new Date(selectedDate).setHours(0, 0, 0, 0);
    const minTime = new Date(dateConstraints.minDate).setHours(0, 0, 0, 0);
    const maxTime = new Date(dateConstraints.maxDate).setHours(0, 0, 0, 0);
    
    if (selectedTime < minTime) {
      setValidationError(
        `La fecha seleccionada (${formatDateSpanish(selectedDate)}) es anterior al mínimo permitido: ${formatDateSpanish(dateConstraints.minDate)}`
      );
    } else if (selectedTime > maxTime) {
      setValidationError(
        `La fecha seleccionada (${formatDateSpanish(selectedDate)}) excede el límite permitido: ${formatDateSpanish(dateConstraints.maxDate)}`
      );
    } else {
      setValidationError('');
    }
  }, [newDeadline, dateConstraints]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!validationError && newDeadline && !isLoading) {
      // formato YYYY-MM-DD
      onConfirm(newDeadline);
    }
  };

  const isValid = !validationError && newDeadline;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Actualizar Fecha Límite
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Información del proyecto */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-semibold">Proyecto:</span> {project?.title || 'Sin título'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Tipo:</span> {dateConstraints?.projectTypeName || 'No especificado'}
            </p>
          </div>

          {/* Restricciones */}
          {dateConstraints && (
            <div className="p-4 bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-lg">
              <p className="text-sm font-semibold text-lime-800 dark:text-lime-300 mb-2">
                Restricciones del tipo de proyecto:
              </p>
              <ul className="text-sm text-lime-700 dark:text-lime-400 space-y-1">
                <li>
                  <span className="font-semibold">Mínimo:</span> {formatDateSpanish(dateConstraints.minDate)} 
                  <span className="text-xs ml-1">({dateConstraints.minMonths} meses)</span>
                </li>
                <li>
                  <span className="font-semibold">Máximo:</span> {formatDateSpanish(dateConstraints.maxDate)}
                  <span className="text-xs ml-1">({dateConstraints.maxMonths} meses)</span>
                </li>
              </ul>
            </div>
          )}

          {/* Campo de fecha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nueva Fecha Límite
            </label>
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-lime-500 dark:focus:border-lime-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Error de validación */}
          {validationError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{validationError}</span>
              </p>
            </div>
          )}

          {/* Vista previa */}
          {isValid && (
            <div className="p-3 bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-lg">
              <p className="text-sm text-lime-700 dark:text-lime-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  Nueva fecha límite: <span className="font-semibold">{formatDateSpanish(parseDateLocal(newDeadline))}</span>
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid || isLoading}
            className="flex-1 px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Actualizando...</span>
              </>
            ) : (
              'Actualizar Fecha'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}