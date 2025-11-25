/**
 * Convierte un string de fecha YYYY-MM-DD a Date en zona horaria local
 * Evita problemas de zona horaria con new Date(string)
 */
export const parseDateLocal = (dateString) => {
  if (!dateString) return null;
  
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Formatea una fecha local a string legible en español SIN día de la semana
 */
export const formatDateSpanish = (date) => {
  if (!date) return '';
  
  return date.toLocaleDateString('es-MX', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Formatea un string de fecha YYYY-MM-DD a español SIN día de la semana
 */
export const formatDateStringSpanish = (dateString) => {
  const date = parseDateLocal(dateString);
  return date ? formatDateSpanish(date) : '';
};

/**
 * Formatea fechas ISO del backend (con timestamp) a español
 * Maneja correctamente la zona horaria para evitar el bug de +1 día
 */
export const formatISODateSpanish = (isoString) => {
  if (!isoString) return '';
  
  // Si la fecha viene con timestamp (formato ISO completo)
  if (isoString.includes('T')) {
    // Crear objeto Date que automáticamente convierte UTC a local
    const date = new Date(isoString);
    
    // Extraer componentes en zona horaria local
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Crear nueva fecha con componentes locales
    const localDate = new Date(year, month, day);
    return formatDateSpanish(localDate);
  }
  
  // Si es solo fecha YYYY-MM-DD, usar parseDateLocal
  return formatDateStringSpanish(isoString);
};

/**
 * Formatea una fecha local a string legible en español CON día de la semana
 */
export const formatDateSpanishWithWeekday = (date) => {
  if (!date) return '';
  
  return date.toLocaleDateString('es-MX', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Formatea un string de fecha YYYY-MM-DD a español CON día de la semana
 */
export const formatDateStringSpanishWithWeekday = (dateString) => {
  const date = parseDateLocal(dateString);
  return date ? formatDateSpanishWithWeekday(date) : '';
};