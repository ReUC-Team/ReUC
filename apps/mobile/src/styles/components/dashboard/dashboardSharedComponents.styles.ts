// apps/mobile/src/styles/components/dashboard/dashboardSharedComponents.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

// Projects Component Styles
export const createProjectsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: palette.background,
      borderRadius: 12,
      padding: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
      gap: spacing.sm,
    },
    title: {
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    subtitle: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginTop: 2,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    
    // Loading State
    loadingState: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    loadingText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginTop: spacing.sm,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    
    // Error State
    errorState: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    errorIcon: {
      marginBottom: spacing.sm,
    },
    errorText: {
      fontSize: typography.base,
      color: palette.errorText,
      textAlign: 'center',
      marginBottom: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    retryButton: {
      backgroundColor: palette.error,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 8,
    },
    retryButtonText: {
      color: palette.onPrimary,
      fontSize: typography.base,
      fontWeight: '600',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    
    // Empty State
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    emptyIcon: {
      marginBottom: spacing.sm,
    },
    emptyText: {
      fontSize: typography.base,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    
    // Project Card
    projectCard: {
      borderLeftWidth: 4,
      borderLeftColor: palette.primary,
      borderRadius: 8,
      padding: spacing.sm,
      backgroundColor: palette.background,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    
    // Students Section
    studentsSection: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    avatarsContainer: {
      flexDirection: 'row',
      marginRight: spacing.sm,
    },
    studentsInfo: {
      flex: 1,
    },
    studentItem: {
      marginBottom: 4,
    },
    studentItemBorder: {
      paddingTop: spacing.xs,
      marginTop: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: palette.grayLight,
    },
    studentName: {
      fontSize: typography.sm,
      fontWeight: '500',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    studentEmail: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    studentsBadge: {
      backgroundColor: '#D1FAE5',
      paddingHorizontal: spacing.xs,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: spacing.xs,
    },
    studentsBadgeText: {
      fontSize: typography.sm,
      fontWeight: '500',
      color: '#065F46',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    
    // Project Info
    projectInfo: {
      flex: 1,
    },
    projectHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    projectTitle: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginBottom: 4,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    projectDescription: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginBottom: 4,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    projectCompany: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    projectCompanyLabel: {
      fontWeight: '500',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.xs,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    statusText: {
      fontSize: typography.sm,
      fontWeight: '500',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    
    // Progress Section
    progressSection: {
      marginBottom: spacing.sm,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    progressLabel: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    progressValue: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: palette.grayLight,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: palette.primary,
      borderRadius: 4,
    },
    
    // Meta Info
    metaInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    metaText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    
    // Actions
    actions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: palette.grayLight,
    },
    actionButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 6,
    },
    detailsButton: {
      backgroundColor: '#E0E7FF',
    },
    detailsButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: '#3730A3',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    contactButton: {
      backgroundColor: '#D1FAE5',
    },
    contactButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: '#065F46',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    commentButton: {
      backgroundColor: '#FEF3C7',
    },
    commentButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: '#92400E',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    deliverablesButton: {
      backgroundColor: '#E9D5FF',
    },
    deliverablesButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: '#6B21A8',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
  })