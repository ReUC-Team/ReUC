// apps/mobile/src/styles/components/projects/EditApplicationModal.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createEditApplicationModalStyles = (palette: ColorPalette, fontMode: string) =>
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
      maxHeight: '90%',
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
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.lg,
      fontWeight: '700',
      color: palette.text,
      marginBottom: spacing.sm,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: palette.grayLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: palette.primary,
      borderColor: palette.primary,
    },
    checkboxLabel: {
      flex: 1,
    },
    checkboxText: {
      fontSize: typography.base,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    checkboxSubtext: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    radio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: palette.grayLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: palette.primary,
    },
    radioDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: palette.primary,
    },
    radioText: {
      fontSize: typography.base,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    textInput: {
      backgroundColor: palette.background,
      borderWidth: 2,
      borderColor: palette.grayLight,
      borderRadius: 8,
      padding: spacing.sm,
      fontSize: typography.base,
      color: palette.text,
      marginTop: spacing.sm,
      minHeight: 80,
      textAlignVertical: 'top',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    constraintsBox: {
      backgroundColor: '#ECFCCB',
      borderRadius: 8,
      padding: spacing.sm,
      marginBottom: spacing.sm,
    },
    constraintsText: {
      fontSize: typography.sm,
      color: '#365314',
      marginBottom: spacing.xxs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surface,
      borderWidth: 2,
      borderColor: palette.grayLight,
      borderRadius: 8,
      padding: spacing.sm,
      gap: spacing.xs,
    },
    dateButtonText: {
      fontSize: typography.base,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    infoBox: {
      backgroundColor: '#FEF3C7',
      borderRadius: 8,
      padding: spacing.md,
      marginTop: spacing.md,
    },
    infoTitle: {
      fontSize: typography.base,
      fontWeight: '700',
      color: '#78350F',
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    infoText: {
      fontSize: typography.sm,
      color: '#78350F',
      marginBottom: spacing.xxs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    errorText: {
      fontSize: typography.sm,
      color: palette.errorText,
      marginTop: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSave: {
      backgroundColor: palette.surface,
      borderWidth: 2,
      borderColor: palette.primary,
    },
    buttonSaveText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.primary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    buttonApprove: {
      backgroundColor: palette.primary,
    },
    buttonApproveText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  })