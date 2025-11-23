// apps/mobile/src/styles/components/search/SearchResultCard.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createSearchResultCardStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surface,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: 12,
      marginBottom: spacing.sm,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    containerSelected: {
      borderColor: palette.primary,
      backgroundColor: palette.background,
      shadowColor: palette.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    iconContainer: {
      marginRight: spacing.md,
    },
    content: {
      flex: 1,
    },
    label: {
      fontSize: typography.lg,
      marginBottom: spacing.xxs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    labelNormal: {
      color: palette.text,
      fontWeight: '500',
    },
    labelHighlight: {
      color: palette.primary,
      fontWeight: '700',
    },
    screenName: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  })