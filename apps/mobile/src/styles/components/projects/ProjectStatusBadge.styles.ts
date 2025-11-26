// apps/mobile/src/styles/components/projects/ProjectStatusBadge.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createProjectStatusBadgeStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: 20,
      gap: spacing.xs,
      alignSelf: 'flex-start',
    },
    badgeText: {
      fontSize: typography.sm,
      fontWeight: '600',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  })