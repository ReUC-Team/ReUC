// apps/mobile/src/styles/components/teams/AddMemberForm.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createAddMemberFormStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    pendingSection: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.xl,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    searchSection: {
      marginBottom: spacing.lg,
    },
    searchInputContainer: {
      width: '100%',
    },
    roleSelectorContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
    },
    hideButton: {
      alignItems: 'center',
      paddingVertical: spacing.md,
      marginTop: spacing.md,
    },
    hideButtonText: {
      fontSize: typography.md,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    addButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.lg,
    },
    addButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: palette.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 8,
    },
  })