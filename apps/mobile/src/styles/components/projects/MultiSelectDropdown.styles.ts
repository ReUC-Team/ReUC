import { StyleSheet } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createMultiSelectDropdownStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    optional: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontWeight: '400',
    },
    selectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: palette.background,
      borderWidth: 1,
      borderColor: palette.grayLight,
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 48,
    },
    selectButtonError: {
      borderColor: palette.error,
      borderWidth: 2,
    },
    selectButtonText: {
      flex: 1,
      fontSize: typography.base,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    selectButtonTextPlaceholder: {
      color: palette.textSecondary,
    },
    errorText: {
      fontSize: typography.sm,
      color: palette.error,
      marginTop: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: palette.background,
      borderRadius: 16,
      width: '100%',
      maxHeight: '80%',
      padding: spacing.lg,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    modalTitle: {
      fontSize: typography.xl,
      fontWeight: '700',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: palette.grayLight,
      marginRight: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxSelected: {
      backgroundColor: palette.primary,
      borderColor: palette.primary,
    },
    optionText: {
      flex: 1,
      fontSize: typography.base,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    doneButton: {
      backgroundColor: palette.primary,
      paddingVertical: spacing.md,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: spacing.md,
    },
    doneButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  });