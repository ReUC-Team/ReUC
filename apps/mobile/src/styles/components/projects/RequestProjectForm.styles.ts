import { StyleSheet } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createRequestProjectFormStyles = (palette: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    headerInScroll: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: palette.background,
    },
    titleInScroll: {
      marginLeft: spacing.lg,
      fontSize: typography.xl3,
      fontWeight: '700',
      color: palette.text,
    },
    titleAccentInScroll: {
      color: palette.primary,
    },
    helpBox: {
      backgroundColor: '#D1FAE5',
      borderWidth: 1,
      borderColor: '#6EE7B7',
      borderRadius: 8,
      padding: spacing.md,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    helpTitle: {
      fontSize: typography.base,
      fontWeight: '600',
      color: '#065F46',
      marginBottom: spacing.xs,
    },
    helpText: {
      fontSize: typography.sm,
      color: '#065F46',
      lineHeight: 20,
    },
    errorBox: {
      backgroundColor: palette.errorBg,
      borderWidth: 1,
      borderColor: palette.errorBorder,
      borderRadius: 8,
      padding: spacing.md,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    errorText: {
      fontSize: typography.base,
      color: palette.errorText,
    },
    form: {
      backgroundColor: palette.background,
      margin: spacing.md,
      padding: spacing.lg,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.xl,
      fontWeight: '700',
      color: palette.text,
      marginBottom: spacing.md,
    },
    field: {
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
    labelWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    input: {
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.grayLight,
      borderRadius: 8,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.base,
      color: palette.text,
    },
    textArea: {
      height: 120,
      textAlignVertical: 'top',
      paddingTop: spacing.sm,
    },
    infoBox: {
      backgroundColor: '#D1FAE5',
      borderWidth: 1,
      borderColor: '#6EE7B7',
      borderRadius: 8,
      padding: spacing.sm,
      marginBottom: spacing.md,
    },
    infoText: {
      fontSize: typography.sm,
      color: '#065F46',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    checkboxLabel: {
      fontSize: typography.base,
      color: palette.text,
      marginLeft: spacing.sm,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    clearButton: {
      flex: 1,
      backgroundColor: palette.graybtn,
      paddingVertical: spacing.base,
      borderRadius: 8,
      alignItems: 'center',
    },
    clearButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onGBtn,
    },
    submitButton: {
      flex: 1,
      backgroundColor: palette.primary,
      paddingVertical: spacing.base,
      borderRadius: 8,
      alignItems: 'center',
    },
    submitButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
    },
  });