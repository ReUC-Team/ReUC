// apps/mobile/src/styles/components/profile/EditProfileModal.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createEditProfileModalStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modal: {
      backgroundColor: palette.background,
      borderTopLeftRadius: spacing.md,
      borderTopRightRadius: spacing.md,
      maxHeight: '90%',
      paddingBottom: spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    title: {
      fontSize: typography.xl,
      fontWeight: 'bold',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    form: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      maxHeight: '75%',
    },
    fieldContainer: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    input: {
      borderWidth: 1,
      borderColor: palette.graybtn,
      borderRadius: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      fontSize: typography.lg,
      color: palette.text,
      backgroundColor: palette.background,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    inputError: {
      borderColor: palette.error,
    },
    textArea: {
      minHeight: 100,
      paddingTop: spacing.sm,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: palette.graybtn,
      borderRadius: spacing.xs,
      overflow: 'hidden',
      backgroundColor: palette.background,
    },
    pickerIconContainer: {
      paddingRight: spacing.sm,
      paddingTop: spacing.sm,
    },
    // Estilos para PhoneInput
    phoneInputContainer: {
      borderWidth: 1,
      borderColor: palette.graybtn,
      borderRadius: spacing.xs,
      padding: spacing.sm,
      overflow: 'hidden',
    },
    phoneContainer: {
      width: '100%',
      backgroundColor: palette.background,
      borderWidth: 0,
    },
    phoneTextContainer: {
      backgroundColor: palette.background,
      paddingVertical: 0,
    },
    phoneTextInput: {
      fontSize: typography.lg,
      color: palette.text,
      backgroundColor: palette.background,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    phoneCodeText: {
      fontSize: typography.lg,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    phoneFlagButton: {
      backgroundColor: palette.background,
    },
    errorText: {
      color: palette.error,
      fontSize: typography.sm,
      marginTop: spacing.xxs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      gap: spacing.sm,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.base,
      borderRadius: spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: palette.graybtn,
    },
    cancelButtonText: {
      color: palette.text,
      fontSize: typography.lg,
      fontWeight: '600',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    saveButton: {
      backgroundColor: palette.primary,
    },
    saveButtonText: {
      color: palette.onPrimary,
      fontSize: typography.lg,
      fontWeight: '600',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  })