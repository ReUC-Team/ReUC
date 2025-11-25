// apps/mobile/src/styles/components/teams/PendingMemberCard.styles.ts 

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createPendingMemberCardStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.background,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: palette.grayLight,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: palette.grayExtraLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    avatarText: {
      fontSize: typography.lg,
      fontWeight: '700',
      color: palette.primary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    infoContainer: {
      flex: 1,
      marginRight: spacing.sm,
    },
    name: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xxs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    emailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
    },
    email: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      flex: 1,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    roleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.primary,
      borderRadius: 20,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      gap: spacing.xxs,
      marginRight: spacing.xs,
      maxWidth: 120,
    },
    roleButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    removeButton: {
      padding: spacing.xs,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: palette.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '50%',
      paddingBottom: spacing.xl,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    modalTitle: {
      fontSize: typography.xl,
      fontWeight: '700',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    rolesList: {
      padding: spacing.md,
    },
    roleOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: 12,
      backgroundColor: palette.grayExtraLight,
      marginBottom: spacing.xs,
      gap: spacing.sm,
    },
    roleOptionSelected: {
      backgroundColor: palette.primary,
    },
    roleOptionText: {
      flex: 1,
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    roleOptionTextSelected: {
      color: palette.onPrimary,
    },
  })