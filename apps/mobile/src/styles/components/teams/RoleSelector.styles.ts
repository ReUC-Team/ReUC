// apps/mobile/src/styles/components/teams/RoleSelector.styles.ts 

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createRoleSelectorStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.sm,
      textAlign: 'center',
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    scrollView: {
      flexGrow: 0,
    },
    rolesContainer: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    roleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.background,
      borderWidth: 2,
      borderColor: palette.primary,
      borderRadius: 20,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      gap: spacing.xs,
    },
    roleButtonSelected: {
      backgroundColor: palette.primary,
    },
    roleButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.primary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    roleButtonTextSelected: {
      color: palette.onPrimary,
    },
    countBadge: {
      backgroundColor: palette.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xxs,
    },
    countBadgeSelected: {
      backgroundColor: palette.onPrimary,
    },
    countBadgeText: {
      fontSize: typography.xs,
      fontWeight: '700',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    countBadgeTextSelected: {
      color: palette.primary,
    },
  })