import { StyleSheet } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createProfileHeaderStyles = (palette: ColorPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: palette.background,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    profileImageContainer: {
      marginBottom: spacing.md,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: palette.primary,
    },
    infoContainer: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    name: {
      fontSize: typography.xl2,
      fontWeight: '700',
      color: palette.text,
      marginBottom: spacing.xxs,
    },
    location: {
      fontSize: typography.lg,
      color: palette.textSecondary,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
      width: '100%',
    },
    button: {
      flex: 1,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editButton: {
      backgroundColor: palette.graybtn,
    },
    editButtonText: {
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.onGBtn,
    },
    contactButton: {
      backgroundColor: palette.primary,
    },
    contactButtonText: {
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.onPrimary,
    },
  });