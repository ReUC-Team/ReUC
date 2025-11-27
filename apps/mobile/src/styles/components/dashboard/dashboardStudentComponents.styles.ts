// apps/mobile/src/styles/components/dashboard/dashboardStudentComponents.styles.ts

import { StyleSheet, Dimensions } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

const { width: screenWidth } = Dimensions.get('window')
const cardWidth = screenWidth * 0.7 // 👈 Cambiado de 0.85 a 0.7 como Faculty

// StudentProjectStats Component Styles (similar a Faculty)
export const createStudentProjectStatsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.surface,
    },
    
    // Hero Section (igual que Faculty)
    heroSection: {
      backgroundColor: palette.background,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
      marginBottom: spacing.lg,
    },
    heroTitle: {
      fontSize: typography.xl3,
      fontWeight: 'bold',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    heroSubtitle: {
      fontSize: typography.base,
      color: palette.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.lg,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    heroButton: {
      backgroundColor: palette.primary,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.lg,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: palette.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    heroButtonText: {
      fontSize: typography.base,
      fontWeight: 'bold',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    
    // Resumen General Section (igual que Faculty)
    summarySection: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    summaryTitle: {
      fontSize: typography.xl,
      fontWeight: 'bold',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    summarySubtitle: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginBottom: spacing.lg,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    summaryStats: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    summaryStatItem: {
      flex: 1,
      backgroundColor: palette.background,
      borderRadius: 16,
      padding: spacing.lg,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: palette.grayLight,
    },
    summaryStatNumber: {
      fontSize: typography.xl3,
      fontWeight: 'bold',
      color: palette.primary,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    summaryStatProgress: {
      fontSize: typography.xl3,
      fontWeight: 'bold',
      color: palette.primary,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    summaryStatLabel: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    
    // Section Title
    sectionTitle: {
      fontSize: typography.xl,
      fontWeight: 'bold',
      color: palette.text,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    
    // Loading State
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xl * 2,
    },
    loadingText: {
      fontSize: typography.base,
      color: palette.textSecondary,
      marginTop: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    
    // Error State
    errorContainer: {
      backgroundColor: palette.errorBg,
      borderWidth: 1,
      borderColor: palette.errorBorder,
      borderRadius: 12,
      padding: spacing.lg,
      margin: spacing.md,
      alignItems: 'center',
    },
    errorText: {
      fontSize: typography.base,
      color: palette.errorText,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    
    // Horizontal Cards (igual que Faculty)
    horizontalScrollContainer: {
      paddingRight: spacing.md,
      marginBottom: spacing.lg,
    },
    horizontalCard: {
      backgroundColor: palette.background,
      borderRadius: 20,
      padding: spacing.lg,
      marginRight: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: palette.grayLight,
      position: 'relative',
      overflow: 'hidden',
    },
    horizontalCardFirst: {
      marginLeft: spacing.lg,
    },
    floatingIcon: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: palette.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    horizontalCardContent: {
      paddingTop: spacing.sm,
    },
    horizontalLabel: {
      fontSize: typography.sm,
      fontWeight: '500',
      color: palette.textSecondary,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    horizontalValue: {
      fontSize: typography.xl3,
      fontWeight: 'bold',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    gradientOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: palette.primary,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    
    // Pagination Dots
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.md,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    paginationDotActive: {
      backgroundColor: palette.primary,
      width: 24,
    },
    paginationDotInactive: {
      backgroundColor: palette.gray,
    },
  })

// ActiveProjectsCards Component Styles (nuevo componente para tab Resumen)
export const createActiveProjectsCardsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: palette.surface,
      paddingVertical: spacing.md,
    },
    
    sectionTitle: {
      fontSize: typography.xl,
      fontWeight: 'bold',
      color: palette.text,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    
    horizontalScrollContainer: {
      paddingRight: spacing.md,
      marginBottom: spacing.lg,
    },
    
    projectCard: {
      width: screenWidth * 0.85,
      backgroundColor: palette.background,
      borderRadius: 16,
      padding: spacing.lg,
      marginRight: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: palette.grayLight,
    },
    projectCardFirst: {
      marginLeft: spacing.lg,
    },
    
    projectCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    projectIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: palette.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 12,
    },
    statusText: {
      fontSize: typography.xs,
      fontWeight: '600',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    
    projectCardContent: {
      flex: 1,
    },
    projectTitle: {
      fontSize: typography.lg,
      fontWeight: 'bold',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    projectDescription: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      lineHeight: 18,
      marginBottom: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    
    projectCardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: palette.grayLight,
    },
    daysContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    daysText: {
      fontSize: typography.xs,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
  })

// ParticipationSummary Component Styles 
export const createParticipationSummaryStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: palette.background,
      borderRadius: 12,
      padding: spacing.lg,
      marginHorizontal: spacing.sm,
      marginVertical: spacing.md - 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: palette.grayLight,
    },
    
    loadingState: {
      paddingVertical: spacing.xl,
    },
    loadingBar: {
      height: 16,
      backgroundColor: palette.grayLight,
      borderRadius: 8,
      marginBottom: spacing.md,
    },
    loadingBarSmall: {
      height: 12,
      backgroundColor: palette.grayLight,
      borderRadius: 6,
      marginBottom: spacing.sm,
    },
    
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    title: {
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    
    progressSection: {
      marginBottom: spacing.lg,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    progressLabel: {
      fontSize: typography.sm,
      fontWeight: '500',
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    progressValue: {
      fontSize: typography.sm,
      fontWeight: 'bold',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: palette.grayLight,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 4,
    },
    progressBarActive: {
      backgroundColor: palette.primary,
    },
    progressBarCompleted: {
      backgroundColor: '#3B82F6',
    },
    
    deadlineSection: {
      marginTop: spacing.lg,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: palette.grayLight,
    },
    deadlineLabel: {
      fontSize: typography.xs,
      fontWeight: '500',
      color: palette.textSecondary,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    deadlineTitle: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    deadlineDate: {
      fontSize: typography.xs,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
  })