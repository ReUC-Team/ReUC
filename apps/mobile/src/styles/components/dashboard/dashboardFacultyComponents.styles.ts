// apps/mobile/src/styles/components/dashboard/dashboardFacultyComponents.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

// PendingRequests Styles
export const createPendingRequestsStyles = (palette: ColorPalette, fontMode: string) =>
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
    },
    iconContainer: {
      marginRight: spacing.sm,
    },
    title: {
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    subtitle: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginTop: 2,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
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
    errorState: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
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
    },
    requestItem: {
      borderWidth: 1,
      borderColor: palette.grayLight,
      borderRadius: 8,
      padding: spacing.sm,
    },
    requestContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    requestLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginRight: spacing.sm,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: spacing.sm,
      marginTop: 4,
    },
    requestTitle: {
      fontSize: typography.base,
      fontWeight: '500',
      color: palette.text,
      marginBottom: 4,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    requestCompany: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    requestRight: {
      alignItems: 'flex-end',
    },
    priorityBadge: {
      paddingHorizontal: spacing.xs,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 4,
    },
    priorityText: {
      fontSize: typography.sm,
      fontWeight: '500',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    statusText: {
      fontSize: typography.sm,
      fontWeight: '500',
      marginBottom: 2,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    dateText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
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
    },
  })

  // LinkedStudents Styles
export const createLinkedStudentsStyles = (palette: ColorPalette, fontMode:string) =>
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
      flex: 1,
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    badge: {
      backgroundColor: '#D1FAE5',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 8,
    },
    badgeText: {
      fontSize: typography.sm,
      fontWeight: '500',
      color: '#065F46',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    studentItem: {
      borderWidth: 1,
      borderColor: palette.grayLight,
      borderRadius: 12,
      padding: spacing.sm,
    },
    studentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    studentName: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    studentTitle: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginTop: 2,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    statusBadge: {
      paddingHorizontal: spacing.xs,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: typography.sm,
      fontWeight: '500',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
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
      fontWeight: '500',
      color: palette.text,
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
    studentFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: palette.grayLight,
    },
    lastActivity: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    commentButton: {
      backgroundColor: palette.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 6,
    },
    commentButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.md,
    },
    modalContent: {
      backgroundColor: palette.background,
      borderRadius: 12,
      width: '100%',
      maxWidth: 500,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    modalTitle: {
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    modalSubtitle: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginTop: 2,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    modalBody: {
      padding: spacing.md,
    },
    commentInput: {
      height: 120,
      borderWidth: 1,
      borderColor: palette.grayLight,
      borderRadius: 8,
      padding: spacing.sm,
      fontSize: typography.base,
      color: palette.text,
      backgroundColor: palette.surface,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.sm,
      padding: spacing.md,
      borderTopWidth: 1,
      borderTopColor: palette.grayLight,
    },
    cancelButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: palette.grayLight,
      borderRadius: 8,
    },
    cancelButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    sendButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: palette.primary,
      borderRadius: 8,
      minWidth: 80,
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: palette.gray,
      opacity: 0.5,
    },
    sendButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
  })

  // UploadedLinks Styles
export const createUploadedLinksStyles = (palette: ColorPalette, fontMode: string) =>
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
      flex: 1,
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    badge: {
      backgroundColor: '#D1FAE5',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 8,
    },
    badgeText: {
      fontSize: typography.sm,
      fontWeight: '500',
      color: '#065F46',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    linkItem: {
      borderWidth: 1,
      borderColor: palette.grayLight,
      borderRadius: 12,
      padding: spacing.sm,
    },
    linkHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    linkIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: palette.grayLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    linkTitle: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginBottom: 2,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    linkUrl: {
      fontSize: typography.sm,
      color: '#3B82F6',
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    studentInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: 4,
    },
    studentText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      flex: 1,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    statusBadge: {
      paddingHorizontal: spacing.xs,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    statusText: {
      fontSize: typography.sm,
      fontWeight: '500',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    description: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginBottom: spacing.sm,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    metaInfo: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.sm,
    },
    metaText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.xs,
      flexWrap: 'wrap',
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: palette.grayLight,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 6,
      gap: 4,
    },
    primaryAction: {
      backgroundColor: '#DBEAFE',
    },
    primaryActionText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: '#1E40AF',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    secondaryAction: {
      backgroundColor: palette.grayLight,
    },
    secondaryActionText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    reviewAction: {
      backgroundColor: palette.primary,
    },
    reviewActionText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    viewCommentsAction: {
      backgroundColor: '#D1FAE5',
    },
    viewCommentsActionText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: '#065F46',
    },

    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: palette.background,
      borderRadius: 12,
      marginHorizontal: spacing.md,
      maxWidth: 600,
      alignSelf: 'center',
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    modalTitle: {
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    modalInfoLabel: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginBottom: 4,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    modalInfoBold: {
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    modalInfoUrl: {
      fontSize: typography.sm,
      color: '#3B82F6',
      marginBottom: 4,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    modalBody: {
      padding: spacing.md,
    },
    inputLabel: {
      fontSize: typography.base,
      fontWeight: '500',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    commentInput: {
      height: 120,
      borderWidth: 1,
      borderColor: palette.grayLight,
      borderRadius: 8,
      padding: spacing.sm,
      fontSize: typography.base,
      color: palette.text,
      backgroundColor: palette.surface,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.xs,
      padding: spacing.md,
      borderTopWidth: 1,
      borderTopColor: palette.grayLight,
      flexWrap: 'wrap',
    },
    cancelButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: palette.grayLight,
      borderRadius: 8,
    },
    cancelButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    rejectButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: '#EF4444',
      borderRadius: 8,
    },
    rejectButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: '#FFFFFF',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    changesButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: '#F59E0B',
      borderRadius: 8,
    },
    changesButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: '#FFFFFF',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    approveButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: palette.primary,
      borderRadius: 8,
    },
    approveButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
      
    },
  })