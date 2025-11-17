/**
 * Normaliza un string para búsqueda (sin acentos, lowercase)
 */
export const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Verifica si un término de búsqueda coincide con un texto
 */
export const matchesSearch = (text, searchTerm) => {
  const normalizedText = normalizeString(text);
  const normalizedSearch = normalizeString(searchTerm);
  return normalizedText.includes(normalizedSearch);
};

/**
 * Filtra las rutas del sidebar según el término de búsqueda
 */
export const filterRoutes = (routes, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return [];
  }

  return routes.filter(route => 
    matchesSearch(route.label, searchTerm) ||
    matchesSearch(route.path, searchTerm)
  );
};

/**
 * Resalta el texto coincidente en negrita
 */
export const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text;

  const normalizedText = normalizeString(text);
  const normalizedSearch = normalizeString(searchTerm);
  
  const index = normalizedText.indexOf(normalizedSearch);
  
  if (index === -1) return text;

  const start = index;
  const end = index + searchTerm.length;

  return (
    <>
      {text.substring(0, start)}
      <strong className="font-bold text-lime-600">
        {text.substring(start, end)}
      </strong>
      {text.substring(end)}
    </>
  );
};