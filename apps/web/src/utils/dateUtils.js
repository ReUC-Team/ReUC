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