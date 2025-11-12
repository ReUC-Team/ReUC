// apps/mobile/src/styles/components/MultiSelectDropdown.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createMultiSelectDropdownStyles = (palette: ColorPalette) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xs,
    },
    optional: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontWeight: '400',
    },
    selectButton: {
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.grayLight,
      borderRadius: 8,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectButtonError: {
      borderColor: palette.error,
    },
    selectButtonText: {
      fontSize: typography.base,
      color: palette.text,
      flex: 1,
    },
    selectButtonTextPlaceholder: {
      color: palette.textSecondary,
    },
    errorText: {
      fontSize: typography.sm,
      color: palette.error,
      marginTop: spacing.xs,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: palette.surface,
      borderRadius: 12,
      width: '85%',
      maxHeight: '70%',
      overflow: 'hidden',
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
      fontSize: typography.lg,
      fontWeight: '700',
      color: palette.text,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    optionText: {
      fontSize: typography.base,
      color: palette.text,
      marginLeft: spacing.sm,
      flex: 1,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: palette.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxSelected: {
      backgroundColor: palette.primary,
    },
    doneButton: {
      backgroundColor: palette.primary,
      margin: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 8,
      alignItems: 'center',
    },
    doneButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
    },
  })