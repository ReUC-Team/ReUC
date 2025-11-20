// apps/mobile/src/styles/screens/ExploreProjects.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../theme/colors'
import { spacing } from '../theme/spacing'
import { typography } from '../theme/typography'

export const createExploreProjectsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    headerContainer: {
      backgroundColor: palette.background,
      overflow: 'hidden',
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
      textAlign: 'center', 
    },
    titleAccent: {
      color: palette.primary,
    },
  })