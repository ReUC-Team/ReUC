// apps/mobile/src/styles/components/projects/UpdateDeadlineModal.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createUpdateDeadlineModalStyles = (palette: ColorPalette, fontMode: string) =>
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
    constraintsBox: {
      backgroundColor: '#ECFCCB',
      borderWidth: 1,
      borderColor: '#D9F99D',
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    constraintsTitle: {
      fontSize: typography.sm,
      fontWeight: '700',
      color: '#365314',
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    constraintItem: {
      fontSize: typography.sm,
      color: '#365314',
      marginBottom: spacing.xxs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    constraintLabel: {
      fontWeight: '700',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    datePickerContainer: {
      marginBottom: spacing.md,
    },
    datePickerLabel: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    datePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.background,
      borderWidth: 2,
      borderColor: palette.grayLight,
      borderRadius: 8,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.xs,
    },
    datePickerText: {
      fontSize: typography.base,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    errorBox: {
      backgroundColor: '#FEE2E2',
      borderWidth: 1,
      borderColor: '#FCA5A5',
      borderRadius: 12,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.xs,
      marginBottom: spacing.md,
    },
    errorText: {
      flex: 1,
      fontSize: typography.sm,
      color: '#991B1B',
      lineHeight: 18,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    successBox: {
      backgroundColor: '#ECFCCB',
      borderWidth: 1,
      borderColor: '#D9F99D',
      borderRadius: 12,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.md,
    },
    successText: {
      flex: 1,
      fontSize: typography.sm,
      color: '#365314',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    successBold: {
      fontWeight: '700',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
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
    buttonUpdate: {
      backgroundColor: '#84CC16',
    },
    buttonUpdateText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: '#FFFFFF',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    buttonDisabled: {
      opacity: 0.5,
    },

datePickerWrapper: {
  marginTop: spacing.md,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: spacing.md,
  borderWidth: 1,
  borderColor: palette.grayLight,
},
iosDatePicker: {
  width: '100%',
  height: 200,
},
doneButton: {
  marginTop: spacing.md,
  backgroundColor: '#84CC16',
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.lg,
  borderRadius: 8,
  alignItems: 'center',
},
doneButtonText: {
  fontSize: typography.base,
  fontWeight: '600',
  color: '#FFFFFF',
  fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
},
  })