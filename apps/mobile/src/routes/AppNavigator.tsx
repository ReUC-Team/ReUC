// apps/mobile/src/routes/AppNavigator.tsx

import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import PlainLayout from '../layouts/PlainLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'

import LandingPage from '../features/landing/pages/LandingPage'
import LoginPage from '../features/auth/pages/LoginPageNative'
import RegisterPage from '../features/auth/pages/RegisterPageNative'
import RoleDashboard from '../components/dashboard/RoleDashboard'
import ProfileScreen from '../features/profile/pages/ProfileScreen'

// Proyectos
import ExploreProjects from '../features/projects/pages/ExploreProjects'
import MyProjects from '../features/projects/pages/MyProjects'
import FavoriteProjects from '../features/projects/pages/FavoriteProjects'
import ProjectDetails from '../features/projects/pages/ProjectDetails'
import RequestProject from '../features/projects/pages/RequestProject'
import MyApplications from '../features/projects/pages/MyApplications'
import MyApplicationDetails from '../features/projects/pages/MyApplicationDetails'
import ApplicationDetails from '../features/projects/pages/ApplicationDetails'

// Teams
import TeamPage from '../features/teams/pages/TeamPage'

// Settings - TODAS LAS PANTALLAS
import SettingsScreen from '../features/settings/pages/SettingsScreen'
import SettingsGeneralScreen from '../features/settings/pages/SettingsGeneralScreen'
import SettingsAccessibilityScreen from '../features/settings/pages/SettingsAccessibilityScreen'
import SettingsNotificationsScreen from '../features/settings/pages/SettingsNotificationsScreen'
import SettingsPrivacyScreen from '../features/settings/pages/SettingsPrivacyScreen'
import SettingsTermsScreen from '../features/settings/pages/SettingsTermsScreen'
import SettingsPrivacyPolicyScreen from '../features/settings/pages/SettingsPrivacyPolicyScreen'
import SettingsHelpScreen from '../features/settings/pages/SettingsHelpScreen'
import SettingsLogoutScreen from '../features/settings/pages/SettingsLogoutScreen'

import { useAuth } from '../context/AuthContext'

const Stack = createNativeStackNavigator()

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
    {/* Landing page */}
    <Stack.Screen name="Landing">
      {() => (
        <PlainLayout>
          <LandingPage />
        </PlainLayout>
      )}
    </Stack.Screen>

    {/* Login & Register */}
    <Stack.Screen name="Login">
      {() => (
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )}
    </Stack.Screen>
    <Stack.Screen name="Register">
      {() => (
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      )}
    </Stack.Screen>
  </Stack.Navigator>
)

const DashboardStack = () => (
  <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
    {/* Dashboard flow */}
    <Stack.Screen name="Dashboard">
      {() => (
        <DashboardLayout>
          <RoleDashboard />
        </DashboardLayout>
      )}
    </Stack.Screen>

    <Stack.Screen name="Messages">
      {() => (
        <DashboardLayout>
          <View />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Notifications screen */}
    <Stack.Screen name="Notifications">
      {() => (
        <DashboardLayout>
          <View />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Profile screen */}
    <Stack.Screen name="Profile">
      {() => (
        <DashboardLayout>
          <ProfileScreen />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* ==================== */}
    {/* SETTINGS SCREENS     */}
    {/* ==================== */}

    {/* Settings Main */}
    <Stack.Screen name="Settings">
      {() => (
        <DashboardLayout>
          <SettingsScreen />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Settings - General */}
    <Stack.Screen name="SettingsGeneral">
      {() => (
        <DashboardLayout>
          <SettingsGeneralScreen />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Settings - Accessibility */}
    <Stack.Screen name="SettingsAccessibility">
      {() => (
        <DashboardLayout>
          <SettingsAccessibilityScreen />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Settings - Notifications */}
    <Stack.Screen name="SettingsNotifications">
      {() => (
        <DashboardLayout>
          <SettingsNotificationsScreen />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Settings - Privacy */}
    <Stack.Screen name="SettingsPrivacy">
      {() => (
        <DashboardLayout>
          <SettingsPrivacyScreen />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Settings - Terms */}
    <Stack.Screen name="SettingsTerms">
      {() => (
        <DashboardLayout>
          <SettingsTermsScreen />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Settings - Privacy Policy */}
    <Stack.Screen name="SettingsPrivacyPolicy">
      {() => (
        <DashboardLayout>
          <SettingsPrivacyPolicyScreen />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Settings - Help */}
    <Stack.Screen name="SettingsHelp">
      {() => (
        <DashboardLayout>
          <SettingsHelpScreen />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Settings - Logout */}
    <Stack.Screen name="SettingsLogout">
      {() => (
        <DashboardLayout>
          <SettingsLogoutScreen />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* ==================== */}
    {/* RUTAS DE PROYECTOS   */}
    {/* ==================== */}

    {/* Explorar proyectos (solo profesores) */}
    <Stack.Screen name="ExploreProjects">
      {() => (
        <DashboardLayout>
          <ExploreProjects />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Solicitar proyecto (todos) */}
    <Stack.Screen name="RequestProject">
      {() => (
        <DashboardLayout>
          <RequestProject />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Mis solicitudes (todos) */}
    <Stack.Screen name="MyApplications">
      {() => (
        <DashboardLayout>
          <MyApplications />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Detalles de MI solicitud (todos) */}
    <Stack.Screen name="MyApplicationDetails">
      {() => (
        <DashboardLayout>
          <MyApplicationDetails />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Detalles de aplicación pública (profesores) */}
    <Stack.Screen name="ApplicationDetails">
      {() => (
        <DashboardLayout>
          <ApplicationDetails />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Mis proyectos aprobados (todos) */}
    <Stack.Screen name="MyProjects">
      {() => (
        <DashboardLayout>
          <MyProjects />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Detalles de proyecto (todos) */}
    <Stack.Screen name="ProjectDetails">
      {() => (
        <DashboardLayout>
          <ProjectDetails />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Página de equipo del proyecto */}
    <Stack.Screen name="TeamPage">
      {() => (
        <DashboardLayout>
          <TeamPage />
        </DashboardLayout>
      )}
    </Stack.Screen>

    {/* Favoritos (estudiantes y profesores) */}
    <Stack.Screen name="FavoriteProjects">
      {() => (
        <DashboardLayout>
          <FavoriteProjects />
        </DashboardLayout>
      )}
    </Stack.Screen>
  </Stack.Navigator>
)

/**
 * Componente que maneja la navegación condicional
 * Si hay usuario → Dashboard
 * Si no hay usuario → Auth (Landing/Login/Register)
 * Mientras carga → Loading
 */
const AppNavigatorContent: React.FC = () => {
  const { user, isLoading } = useAuth()

  // Mostrar loading mientras se verifica la sesión
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    )
  }

  // Si hay usuario, mostrar dashboard; si no, mostrar auth stack
  return user ? <DashboardStack /> : <AuthStack />
}

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <AppNavigatorContent />
  </NavigationContainer>
)

export default AppNavigator