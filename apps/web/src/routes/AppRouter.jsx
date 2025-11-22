import { Routes, Route } from 'react-router-dom'
// LANDING
import LandingPage from '@/features/landing/pages/LandingPage'
// AUTH
import RegisterPage from '@/features/auth/pages/RegisterPage'
import LoginPage from '@/features/auth/pages/LoginPage'
// ADMIN
import AdminLayout from '@/features/admin/layouts/AdminLayout'
import AdminTablePageWrapper from '@/features/admin/pages/AdminTablePageWrapper'
// DASHBOARD
import DashboardExternal from '@/features/dashboards/external/pages/DashboardExternal'
import DashboardStudent from '@/features/dashboards/student/pages/DashboardStudent'
import DashboardFaculty from '@/features/dashboards/faculty/pages/DashboardFaculty'
// PROFILE
import ProfilePage from '@/features/profile/pages/ProfilePage'
// PROJECTS
import RequestProject from '@/features/projects/pages/RequestProject'
import ExploreProjects from '@/features/projects/pages/ExploreProjects'
import ApplicationDetails from '@/features/projects/pages/ApplicationDetails'
import ProjectDetails from '@/features/projects/pages/ProjectDetails'
import MyProjects from '@/features/projects/pages/MyProjects';
import FavoriteProjects from '@/features/projects/pages/FavoriteProjects';
// APPLICATIONS
import MyApplications from "@/features/projects/pages/MyApplications";
import MyApplicationDetails from "@/features/projects/pages/MyApplicationDetails";
// TEAMS
import TeamPage from '@/features/teams/pages/TeamPage'; // NUEVA IMPORTACIÓN
// MEMBERS
import Members from '@/features/members/pages/Members'
//SETTINGS
import Settings from '@/features/settings/pages/Settings'
// LAYOUTS
import PlainLayout from '@/layouts/PlainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
// ERROR
import NotFound from '@/pages/404'

const AppRouter = () => {
  return (
    <Routes>
      {/* Landing page */}
      <Route element={<PlainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Rutas Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Rutas Dashboard (protegidas) */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardExternal />} />
        <Route path="/dashboard/student" element={<DashboardStudent />} />
        <Route path="/dashboard/faculty" element={<DashboardFaculty />} />
        
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* PROJECTS */}
        <Route path="/request-project" element={<RequestProject />} />

        {/* Explorar proyectos (Applications) */}
        <Route path="/explore-projects" element={<ExploreProjects />} />
        <Route path="/application/:uuid" element={<ApplicationDetails />} />

        {/* Mis solicitudes (Applications del usuario) */}
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/my-applications/:uuid" element={<MyApplicationDetails />} />

        {/* Mis proyectos (Projects aprobados) */}
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/my-projects/:uuid" element={<ProjectDetails />} />
        <Route path="/my-projects/:uuid/team" element={<TeamPage />} /> {/* NUEVA RUTA */}

        <Route path="/explore-projects/project-details" element={<ApplicationDetails />} />
        <Route path="/favorite-projects" element={<FavoriteProjects />} />
        <Route path="/members" element={<Members />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Rutas de administrador */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path=":tableName" element={<AdminTablePageWrapper />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter