// apps/mobile/src/features/dashboards/faculty/index.ts

export { default as DashboardFaculty } from './pages/DashboardFaculty'
export { default as DashboardTabs } from './pages/DashboardTabs'

// Components
export { default as FacultyProjectStats } from './components/FacultyProjectStats'
export { default as PendingRequests } from './components/PendingRequests'
export { default as LinkedStudents } from './components/LinkedStudents'
export { default as UploadedLinks } from './components/UploadedLinks'

// Hooks
export { useFacultyStats } from './hooks/useFacultyStats'
export { useLinkedStudents } from './hooks/useLinkedStudents'
export { usePendingRequests } from './hooks/usePendingRequests'
export { useUploadedLinks } from './hooks/useUploadedLinks'