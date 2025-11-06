// apps/mobile/src/styles/components/header/MainHeader.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createMainHeaderStyles = (palette: ColorPalette) => StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: palette.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    // Añadir sombra sutil en dark mode
    ...(palette.background === '#0F172A' && {
      borderBottomWidth: 1,
      borderBottomColor: palette.surface,
    }),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerBtn: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  hamburgerIcon: {
    color: palette.text,
  },
  logo: {
    fontSize: typography.xl2,
    fontWeight: '900',
    color: palette.primary,
  },
  profileBtn: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: spacing.xl,
    backgroundColor: palette.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    // Añadir borde en dark mode para mejor visibilidad
    ...(palette.background === '#0F172A' && {
      borderWidth: 1,
      borderColor: palette.grayLight,
    }),
  },
  searchIcon: {
    marginRight: spacing.sm,
    color: palette.textSecondary,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.base,
    color: palette.text,
  },
})