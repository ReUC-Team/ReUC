// apps/mobile/src/styles/components/dashboard/dashboardComponents.styles.ts

import { StyleSheet } from 'react-native'
import { palette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'
import { ColorPalette } from '../../theme/colors'


export const createProjectStatsStyles = (palette: ColorPalette, fontMode: string) => StyleSheet.create({
  heroSection: {
    backgroundColor: palette.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: spacing.lg,
    borderBottomRightRadius: spacing.lg,
  },
  heroTitle: {
    fontSize: typography.xl3,
    fontWeight: 'bold',
    color: palette.onPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',

  },
  heroSubtitle: {
    fontSize: typography.lg,
    color: palette.onPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.9,
    lineHeight: typography.lg * 1.4,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',

  },
  heroButton: {
    backgroundColor: palette.background,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    
  },
  heroButtonText: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: palette.primary,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    
  },
  summarySection: {
    backgroundColor: palette.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: palette.text,
    marginBottom: spacing.xs,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  summarySubtitle: {
    fontSize: typography.sm,
    color: palette.textSecondary,
    marginBottom: spacing.md,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryStatNumber: {
    fontSize: typography.xl2,
    fontWeight: 'bold',
    color: palette.text,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',

  },
  summaryStatLabel: {
    fontSize: typography.sm,
    color: palette.textSecondary,
    marginTop: spacing.xxs,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',

  },
  summaryStatProgress: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: palette.primary,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: palette.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  horizontalScrollContainer: {
    paddingLeft: spacing.lg,
    paddingVertical: spacing.sm,
    paddingRight: spacing.xxl,
  },
  horizontalCard: {
    height: 180,
    backgroundColor: palette.background,
    borderRadius: spacing.lg,
    marginRight: spacing.md,
    padding: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: palette.grayExtraLight,
  },
  horizontalCardFirst: {
    marginLeft: 0,
  },
  floatingIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.primary + '15', // 15% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalCardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xs,
  },
  horizontalLabel: {
    fontSize: typography.base,
    fontWeight: '600',
    color: palette.text,
    marginBottom: spacing.sm,
    lineHeight: typography.base * 1.3,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  horizontalValue: {
    fontSize: typography.xl4,
    fontWeight: 'bold',
    color: palette.primary,
    letterSpacing: -1,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: palette.primary,
    borderBottomLeftRadius: spacing.lg,
    borderBottomRightRadius: spacing.lg,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  paginationDot: {
    width: spacing.xs,
    height: spacing.xs,
    borderRadius: spacing.xxs,
    marginHorizontal: spacing.xxs,
  },
  paginationDotActive: {
    backgroundColor: palette.primary,
    opacity: 1,
  },
  paginationDotInactive: {
    backgroundColor: palette.gray,
    opacity: 0.5,
  },
})


export const createRequestedProjectsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    borderRadius: spacing.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: palette.text,
    marginLeft: spacing.sm,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  subtitle: {
    fontSize: typography.sm,
    color: palette.textSecondary,
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    backgroundColor: palette.graybtn,
  },
  filterButtonActive: {
    backgroundColor: palette.primary,
  },
  filterButtonText: {
    fontSize: typography.sm,
    color: palette.textSecondary,
    fontWeight: '600',
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  filterButtonTextActive: {
    color: palette.onPrimary,
  },
  projectItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.grayLight,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  projectTitle: {
    fontSize: typography.base,
    fontWeight: '600',
    color: palette.text,
    marginRight: spacing.xs,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  statusDot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.sm / 2,
  },
  projectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectType: {
    fontSize: typography.sm,
    color: palette.textSecondary,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  projectDate: {
    fontSize: typography.sm,
    color: palette.textSecondary,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.xs,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: typography.sm,
    fontWeight: '600',
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    backgroundColor: palette.grayLight,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.base,
    color: palette.textSecondary,
  },
})

export const createProjectListStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    borderRadius: spacing.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  itemText: {
    fontSize: typography.base,
    color: palette.text,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  statusDot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.sm / 2,
  },
  separator: {
    height: 1,
    backgroundColor: palette.grayLight,
    marginVertical: spacing.sm,
  },
})

export const createRecentProjectsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    borderRadius: spacing.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: palette.text,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  project: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.base,
    fontWeight: '600',
    color: palette.text,
  },
  desc: {
    fontSize: typography.base,
    color: palette.textSecondary,
  },
  date: {
    fontSize: typography.sm,
    color: palette.gray,
    marginTop: spacing.xs,
  },
})

export const createRecentActivityStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    borderRadius: spacing.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerIcon: {
    marginRight: spacing.sm,
    color: palette.text,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: palette.text,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  timeline: {
    position: 'relative',
    paddingLeft: spacing.sm,
  },
  line: {
    position: 'absolute',
    left: spacing.sm / 2,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: palette.grayLight,
  },
  update: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  dot: {
    width: spacing.xs,
    height: spacing.xs,
    borderRadius: spacing.xs / 2,
    backgroundColor: palette.primary,
    marginRight: spacing.sm,
    marginTop: spacing.base / 2,
  },
  textContainer: {
    flex: 1,
  },
  time: {
    fontSize: typography.sm,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  text: {
    fontSize: typography.base,
    color: palette.text,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  footer: {
    marginTop: spacing.sm,
    alignItems: 'flex-end',
  },
  footerText: {
    fontSize: typography.base,
    color: palette.primary,
    fontWeight: '600',
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
    borderRadius: spacing.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarGradient: {
    backgroundColor: palette.primary,
  },
  avatarText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: palette.onPrimary,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: typography.base,
    color: palette.text,
    lineHeight: typography.base * 1.4,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  userName: {
    fontWeight: '600',
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  targetText: {
    fontWeight: '600',
  },
  projectText: {
    color: palette.textSecondary,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  activityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  timeAgo: {
    fontSize: typography.sm,
    color: palette.textSecondary,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    backgroundColor: palette.grayLight,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.base,
    color: palette.textSecondary,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  loadingState: {
    paddingVertical: spacing.xl,
  },
  errorState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  errorIcon: {
    width: 48,
    height: 48,
    backgroundColor: palette.errorBg,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: typography.base,
    color: palette.errorText,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  retryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: palette.primary,
    borderRadius: spacing.xs,
  },
  retryButtonText: {
    fontSize: typography.base,
    color: palette.onPrimary,
    fontWeight: '600',
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
})

export const createProjectSummaryStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    borderRadius: spacing.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: palette.text,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    justifyContent: 'space-between',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.sm / 2,
    marginRight: spacing.sm,
  },
  itemLabel: {
    fontSize: typography.base,
    color: palette.textSecondary,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  count: {
    fontSize: typography.base,
    color: palette.text,
    fontWeight: '600',
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  totalContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: palette.grayLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.base,
    fontWeight: '600',
    color: palette.text,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  totalValue: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: palette.text,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
})

export const createTimelineStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    borderRadius: spacing.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  bullet: {
    width: spacing.xs,
    height: spacing.xs,
    borderRadius: spacing.xs / 2,
    backgroundColor: palette.primary,
    marginRight: spacing.sm,
    marginTop: spacing.base / 2,
  },
  eventContent: {
    flex: 1,
  },
  eventTime: {
    fontSize: typography.sm,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
  eventText: {
    fontSize: typography.base,
    color: palette.text,
    fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
  },
})

export const createRecentProjectStyles = (palette: ColorPalette) =>
  StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    borderRadius: spacing.sm,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: palette.text,
  },
  subtitle: {
    fontSize: typography.base,
    color: palette.textSecondary,
    marginTop: 2,
  },
  
  // Project Item
  projectItem: {
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
    borderTopRightRadius: spacing.xs,
    borderBottomRightRadius: spacing.xs,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: palette.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Students Section - ACTUALIZADO
  studentsSection: {
    marginBottom: spacing.md,
  },
  studentsListContainer: {
    marginBottom: spacing.xs,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  studentAvatarText: {
    color: palette.onPrimary,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  studentName: {
    fontSize: typography.base,
    fontWeight: '500',
    color: palette.text,
    flex: 1,
  },
  moreStudentsIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  moreStudentsText: {
    fontSize: typography.sm,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  moreStudentsLabel: {
    fontSize: typography.sm,
    color: palette.textSecondary,
    fontStyle: 'italic',
    flex: 1,
  },
  studentsCount: {
    alignSelf: 'flex-start',
    backgroundColor: '#C7F9B4', // Lime light background
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.sm,
  },
  studentsCountText: {
    fontSize: typography.sm,
    color: '#4338CA', // Indigo text
    fontWeight: '500',
  },
  

})