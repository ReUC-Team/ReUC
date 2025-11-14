// apps/mobile/src/styles/screens/ComingSoon.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../theme/colors'
import { spacing } from '../theme/spacing'
import { typography } from '../theme/typography'

export const createComingSoonStyles = (palette: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      backgroundColor: palette.background,
    },
    title: {
      fontSize: typography.xl3,
      fontWeight: '700',
      color: palette.text,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: typography.xl,
      fontWeight: '600',
      color: palette.primary,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    description: {
      fontSize: typography.base,
      color: palette.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  })