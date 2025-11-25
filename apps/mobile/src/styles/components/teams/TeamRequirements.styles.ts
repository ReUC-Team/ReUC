// apps/mobile/src/styles/components/teams/TeamRequirements.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createTeamRequirementsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: palette.primary + '15', 
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: palette.primary + '30',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    title: {
      flex: 1,
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    requirementsList: {
      gap: spacing.xs,
    },
    requirementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    requirementText: {
      flex: 1,
      fontSize: typography.sm,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    roleName: {
      fontWeight: '600',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    boldText: {
      fontWeight: '700',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    currentCount: {
      color: palette.primary,
      fontWeight: '700',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  })