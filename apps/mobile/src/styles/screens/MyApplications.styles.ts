// apps/mobile/src/styles/screens/MyApplications.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../theme/colors'
import { spacing } from '../theme/spacing'
import { typography } from '../theme/typography'

export const createMyApplicationsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      alignItems: 'center',
    },
    title: {
      fontSize: typography.xl3,
      fontWeight: '700',
      color: palette.text,
    },
    titleAccent: {
      color: palette.primary,
    },
  })