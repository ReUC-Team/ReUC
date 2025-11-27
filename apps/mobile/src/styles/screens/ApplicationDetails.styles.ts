// apps/mobile/src/styles/screens/ApplicationDetails.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../theme/colors'
import { spacing } from '../theme/spacing'
import { typography } from '../theme/typography'

export const createApplicationDetailsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
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
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      backgroundColor: palette.background,
    },
    errorIcon: {
      marginBottom: spacing.md,
    },
    errorText: {
      fontSize: typography.base,
      color: palette.errorText,
      textAlign: 'center',
      marginBottom: spacing.lg,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    backButton: {
      backgroundColor: palette.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
    },
    backButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      alignItems: 'center',
      backgroundColor: palette.background,
    },
    title: {
      fontSize: typography.xl3,
      fontWeight: '700',
      color: palette.text,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    titleAccent: {
      color: palette.primary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: 20,
      marginTop: spacing.sm,
      gap: spacing.xs,
    },
    statusBadgeText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.xl,
      fontWeight: '600',
      color: palette.text,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    attachmentsTitle: {
      fontSize: typography.xl,
      fontWeight: '600',
      color: palette.text,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    actionsContainer: {
      marginTop: spacing.lg,
      gap: spacing.sm,
    },
    approveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      gap: spacing.xs,
    },
    approveButtonDisabled: {
      backgroundColor: palette.gray,
      opacity: 0.5,
    },
    approveButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    downloadAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.onGBtn,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      gap: spacing.xs,
    },
    downloadAllButtonDisabled: {
      backgroundColor: palette.gray,
      opacity: 0.5,
    },
    downloadAllButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    contactButton: {
      backgroundColor: palette.surface,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: palette.primary,
    },
    contactButtonDisabled: {
      opacity: 0.5,
    },
    contactButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.primary,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },

    deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    gap: spacing.xs,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
},

editButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: palette.onGBtn,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  borderRadius: 8,
  gap: spacing.xs,
  marginTop: spacing.xs-1,
  marginBottom: spacing.xs,
},
editButtonDisabled: {
  opacity: 0.5,
},
editButtonText: {
  fontSize: typography.base,
  fontWeight: '600',
  color: palette.onPrimary,
  fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
},

infoBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: palette.grayExtraLight,
  padding: spacing.md,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: palette.grayLight,
  gap: spacing.xs,
  marginTop: spacing.sm,
},
infoText: {
  flex: 1,
  fontSize: typography.sm,
  color: palette.textSecondary,
  fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
},

  })