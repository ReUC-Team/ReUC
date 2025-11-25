// apps/mobile/src/styles/components/projects/RollbackProjectModal.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createRollbackProjectModalStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modal: {
      backgroundColor: palette.background,
      borderRadius: 16,
      padding: spacing.lg,
      width: '100%',
      maxWidth: 500,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    title: {
      fontSize: typography.xl2,
      fontWeight: '700',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    warningBox: {
      backgroundColor: '#FEE2E2',
      borderWidth: 2,
      borderColor: '#FCA5A5',
      borderRadius: 12,
      padding: spacing.md,
      flexDirection: 'row',
      marginBottom: spacing.md,
    },
    warningIcon: {
      marginRight: spacing.sm,
      marginTop: 2,
    },
    warningContent: {
      flex: 1,
    },
    warningTitle: {
      fontSize: typography.sm,
      fontWeight: '700',
      color: '#991B1B',
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    warningList: {
      gap: spacing.xxs,
    },
    warningListItem: {
      fontSize: typography.sm,
      color: '#991B1B',
      lineHeight: 18,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    infoBox: {
      backgroundColor: palette.grayExtraLight,
      borderRadius: 8,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    infoLabel: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    infoValue: {
      fontWeight: '400',
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    inputContainer: {
      marginBottom: spacing.md,
    },
    inputLabel: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    inputLabelHighlight: {
      color: '#DC2626',
    },
    input: {
      backgroundColor: palette.background,
      borderWidth: 2,
      borderColor: palette.grayLight,
      borderRadius: 8,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.base,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    errorText: {
      fontSize: typography.sm,
      color: '#DC2626',
      marginTop: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.xs,
    },
    buttonCancel: {
      backgroundColor: palette.surface,
      borderWidth: 2,
      borderColor: palette.grayLight,
    },
    buttonCancelText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    buttonRollback: {
      backgroundColor: '#DC2626',
    },
    buttonRollbackText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: '#FFFFFF',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
  })