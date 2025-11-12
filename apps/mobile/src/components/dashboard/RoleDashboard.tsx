// apps/mobile/src/components/dashboard/RoleDashboard.tsx

import React from 'react'
import { useAuth } from '../../context/AuthContext'
import DashboardMain from '../../features/dashboard/external/pages/DashboardMain'
import DashboardStudent from '../../features/dashboard/student/pages/DashboardStudent'
import DashboardFaculty from '../../features/dashboard/faculty/pages/DashboardFaculty'
import DashboardAdmin from '../../features/dashboard/admin/pages/DashboardAdmin'

export default function RoleDashboard() {
  const { user } = useAuth()

  switch (user?.role) {
    case 'outsider':
      return <DashboardMain />
    case 'student':
      return <DashboardStudent />
    case 'professor':
      return <DashboardFaculty />
    case 'admin':
      return <DashboardAdmin />
    default:
      return <DashboardMain />
  }
}