// apps/mobile/src/utils/generateAvatar.ts

/**
 * Genera las iniciales del nombre completo para el avatar
 */
export const generateAvatarFromName = (firstName?: string, middleName?: string, lastName?: string): string => {
  // Si no hay ningún nombre, retornar valor por defecto
  if (!firstName && !middleName && !lastName) {
    return 'R'; // Default para "ReUC"
  }

  // Obtener primera letra del primer nombre
  const firstInitial = firstName?.[0]?.toUpperCase() || '';
  
  // Obtener primera letra del último apellido (que en tu caso es lastName)
  const lastInitial = lastName?.[0]?.toUpperCase() || '';
  
  // Si tenemos ambas iniciales, retornarlas juntas
  // Si solo tenemos una, retornar esa
  return firstInitial + lastInitial || firstInitial || 'R';
};

/**
 * Genera un color de fondo basado en el nombre (opcional para el futuro)
 */
export const getAvatarColor = (name: string): string => {
  // Por ahora usamos el color lime de ReUC
  return 'lime';
};