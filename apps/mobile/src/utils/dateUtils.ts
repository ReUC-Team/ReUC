// apps/mobile/src/utils/dateUtils.ts

/**
 * Convierte un string de fecha a Date
 * Maneja tanto formato YYYY-MM-DD como ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
export const parseDateLocal = (dateString: string | undefined): Date | null => {
  if (!dateString) return null
  
  try {
    // Si es formato ISO completo (con T y Z), usar directamente
    if (dateString.includes('T')) {
      const date = new Date(dateString)
      // Validar que la fecha sea válida
      if (isNaN(date.getTime())) return null
      return date
    }
    
    // Si es formato YYYY-MM-DD, parsear manualmente
    const [year, month, day] = dateString.split('-').map(Number)
    if (!year || !month || !day) return null
    
    return new Date(year, month - 1, day)
  } catch (error) {
    console.error('Error parsing date:', error)
    return null
  }
}

/**
 * Formatea una fecha local a string legible en español SIN día de la semana
 */
export const formatDateSpanish = (date: Date | null): string => {
  if (!date) return ''
  
  try {
    // Validar que sea una fecha válida
    if (isNaN(date.getTime())) return ''
    
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC' // ✅ Importante: usar UTC para fechas ISO
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Formatea un string de fecha a español SIN día de la semana
 */
export const formatDateStringSpanish = (dateString: string | undefined): string => {
  if (!dateString) return ''
  
  try {
    const date = parseDateLocal(dateString)
    if (!date) return ''
    
    return formatDateSpanish(date)
  } catch (error) {
    console.error('Error in formatDateStringSpanish:', error)
    return ''
  }
}

/**
 * Formatea una fecha local a string legible en español CON día de la semana
 */
export const formatDateSpanishWithWeekday = (date: Date | null): string => {
  if (!date) return ''
  
  try {
    if (isNaN(date.getTime())) return ''
    
    return date.toLocaleDateString('es-MX', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    })
  } catch (error) {
    console.error('Error formatting date with weekday:', error)
    return ''
  }
}

/**
 * Formatea un string de fecha a español CON día de la semana
 */
export const formatDateStringSpanishWithWeekday = (dateString: string | undefined): string => {
  if (!dateString) return ''
  
  try {
    const date = parseDateLocal(dateString)
    if (!date) return ''
    
    return formatDateSpanishWithWeekday(date)
  } catch (error) {
    console.error('Error in formatDateStringSpanishWithWeekday:', error)
    return ''
  }
}