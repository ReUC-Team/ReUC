// apps/mobile/src/styles/theme/colors.ts

export const lightPalette = {
  primary:       '#65A30D',
  background:    '#FFFFFF',
  surface:       '#F3F4F6',
  text:          '#111827',
  textSecondary: '#6B7280',
  onPrimary:     '#FFFFFF',
  onGBtn:        '#374151',
  titleDescription: '#1F2937',

  // Errores
  error:         '#DC2626',
  errorBg:       '#FEF2F2',
  errorBorder:   '#FCA5A5',
  errorText:     '#B91C1C',

  // Neutros
  grayLight:     '#F3F4F6',
  graybtn:       '#E5E7EB',
  gray:          '#9CA3AF',
  grayExtraLight:'#F3F4F6',
}

export const darkPalette = {
  primary:       '#84CC16', // Verde más brillante para mejor contraste en dark mode
  background:    '#0F172A', // Fondo oscuro principal
  surface:       '#1E293B', // Superficie elevada en dark mode
  text:          '#F1F5F9', // Texto claro
  textSecondary: '#94A3B8', // Texto secundario más claro
  onPrimary:     '#1F2937', // Texto sobre primary en dark
  onGBtn:        '#E2E8F0',
  titleDescription: '#CBD5E1',

  // Errores
  error:         '#EF4444',
  errorBg:       '#450A0A',
  errorBorder:   '#991B1B',
  errorText:     '#FCA5A5',

  // Neutros
  grayLight:     '#334155',
  graybtn:       '#475569',
  gray:          '#64748B',
  grayExtraLight:'#1E293B',
}

export const highContrastPalette = {
  primary:       '#FFD600', // Amarillo vibrante
  background:    '#000000', // Negro puro
  surface:       '#262626', // Gris muy oscuro
  text:          '#FFFFFF', // Blanco puro
  textSecondary: '#FFD600', // Amarillo como contraste secundario
  onPrimary:     '#000000', // Texto negro sobre amarillo
  onGBtn:        '#FFFFFF',
  titleDescription: '#FFD600',

  // Errores
  error:         '#FF5252',
  errorBg:       '#2E0505',
  errorBorder:   '#FFD600',
  errorText:     '#FFD600',

  // Neutros
  grayLight:     '#1b1911ff',
  graybtn:       '#262626',
  gray:          '#FFD600',
  grayExtraLight:'#262626',
}


// Export palette as default (will be replaced by themed palette)
export const palette = lightPalette

// Type for palette
export type ColorPalette = typeof lightPalette