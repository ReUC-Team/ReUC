import { StyleSheet } from 'react-native';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: typography.xl3,
    fontWeight: '700',
    color: palette.text,
  },
  titleAccent: {
    color: palette.primary,
  },
});