// apps/mobile/src/components/dashboard/RoleDashboard.tsx

import React from 'react'
import { useAuth } from '../../context/AuthContext'
import DashboardMain from '../../features/dashboard/external/pages/DashboardMain'
import DashboardStudent from '../../features/dashboard/student/pages/DashboardStudent'
import DashboardFaculty from '../../features/dashboard/faculty/pages/DashboardFaculty'
import DashboardAdmin from '../../features/dashboard/admin/pages/DashboardAdmin'

export default function RoleDashboard() {
  const { user, isProfessor, isStudent, isOutsider, isAdmin } = useAuth() 

  if (isAdmin) {
    return <DashboardAdmin />
  }

  if (isProfessor) {
    return <DashboardFaculty />
  }

  if (isStudent) {
    return <DashboardStudent />
  }

  if (isOutsider) {
    return <DashboardMain />
  }

  return <DashboardMain />
}