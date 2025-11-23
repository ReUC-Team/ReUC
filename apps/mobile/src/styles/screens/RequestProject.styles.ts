import { StyleSheet } from 'react-native';
import { ColorPalette } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const createRequestProjectStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md, 
      paddingBottom: spacing.sm,
      backgroundColor: palette.background,
    },
    title: {
      marginLeft: spacing.lg,
      fontSize: typography.xl3, 
      fontWeight: '700',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    titleAccent: {
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
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    helpText: {
      fontSize: typography.sm,
      color: '#065F46',
      lineHeight: 20,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
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
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.background,
    },
    loadingText: {
      marginTop: spacing.md,
      fontSize: typography.base,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  });