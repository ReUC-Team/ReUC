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
    marginBottom: spacing.sm, // ⬅️ Reducido margen inferior
  },
  errorText: {
    fontSize: typography.base,
    color: palette.errorText,
  },
});