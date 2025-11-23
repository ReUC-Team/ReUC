// apps/mobile/src/styles/components/profile/OverviewTab.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createOverviewTabStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
      padding: spacing.md,
    },
    section: {
      backgroundColor: palette.background,
      borderRadius: 12,
      padding: spacing.lg,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: typography.xl,
      fontWeight: '700',
      color: palette.text,
      marginBottom: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    infoIcon: {
      marginTop: 2,
      marginRight: spacing.sm,
    },
    infoTextContainer: {
      flex: 1,
    },
    infoLabel: {
      fontSize: typography.sm,
      fontWeight: '500',
      color: palette.textSecondary,
      marginBottom: spacing.xxs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    infoValue: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    descriptionContainer: {
      backgroundColor: palette.background,
      borderRadius: 8,
      padding: spacing.md,
    },
    descriptionText: {
      fontSize: typography.base,
      lineHeight: 22,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  })