import { StyleSheet } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createProjectsListStyles = (palette: ColorPalette, fontMode:string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.background,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: palette.grayLight,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    searchIcon: {
      marginRight: spacing.xs,
    },
    searchInput: {
      flex: 1,
      paddingVertical: spacing.sm,
      fontSize: typography.base,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    listContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl,
    },
  });