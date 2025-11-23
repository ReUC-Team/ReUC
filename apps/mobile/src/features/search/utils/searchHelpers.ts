// apps/mobile/src/features/search/utils/searchHelpers.ts

/**
 * Normaliza un string para búsqueda (sin acentos, lowercase)
 */
export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Verifica si un término de búsqueda coincide con un texto
 */
export const matchesSearch = (text: string, searchTerm: string): boolean => {
  const normalizedText = normalizeString(text)
  const normalizedSearch = normalizeString(searchTerm)
  return normalizedText.includes(normalizedSearch)
}

/**
 * Filtra las rutas según el término de búsqueda
 */
export const filterRoutes = (routes: any[], searchTerm: string): any[] => {
  if (!searchTerm || searchTerm.trim() === '') {
    return []
  }

  return routes.filter((route) => matchesSearch(route.label, searchTerm))
}

/**
 * Resalta el texto coincidente
 * Retorna un objeto con partes: before, match, after
 */
export const getHighlightParts = (text: string, searchTerm: string) => {
  if (!searchTerm) {
    return { before: text, match: '', after: '' }
  }

  const normalizedText = normalizeString(text)
  const normalizedSearch = normalizeString(searchTerm)

  const index = normalizedText.indexOf(normalizedSearch)

  if (index === -1) {
    return { before: text, match: '', after: '' }
  }

  const start = index
  const end = index + searchTerm.length

  return {
    before: text.substring(0, start),
    match: text.substring(start, end),
    after: text.substring(end),
  }
}