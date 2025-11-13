// apps/mobile/src/features/dashboards/shared/index.ts

// Components
export { default as Projects } from './components/Projects'

// Hooks
export { useProjects } from './hooks/useProjects'
export type { Project, Student } from './hooks/useProjects'

// Utils
export { projectUtils, statusConfig, dashboardConfig } from './utils/ProjectsUtils'
export type { ProjectStatus, DashboardType, DashboardConfig } from './utils/ProjectsUtils'