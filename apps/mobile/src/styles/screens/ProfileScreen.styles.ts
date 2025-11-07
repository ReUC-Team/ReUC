// apps/mobile/src/styles/screens/ProfileScreen.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../theme/colors'
import { spacing } from '../theme/spacing'
import { typography } from '../theme/typography'

export const createProfileScreenStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.background,
    },
    loadingText: {
      marginTop: spacing.sm,
      fontSize: typography.lg,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
  })