// apps/mobile/src/routes/AppNavigator.tsx

import React from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import PlainLayout     from '../layouts/PlainLayout'
import AuthLayout      from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'

import LandingPage   from '../features/landing/pages/LandingPage'
import LoginPage     from '../features/auth/pages/LoginPageNative'
import RegisterPage  from '../features/auth/pages/RegisterPageNative'
import DashboardMain from '../features/dashboard/external/pages/DashboardMain'
import ProfileScreen from '../features/profile/pages/ProfileScreen'


import ExploreProjects from '../features/projects/pages/ExploreProjects'
import MyProjects from '../features/projects/pages/MyProjects'
import FavoriteProjects from '../features/projects/pages/FavoriteProjects'
import ProjectDetails from '../features/projects/pages/ProjectDetails'
import RequestProject from '../features/projects/pages/RequestProject'

const Stack = createNativeStackNavigator()

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{ headerShown: false }}
    >
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

      {/* Dashboard flow */}
      <Stack.Screen name="Dashboard">
        {() => (
          <DashboardLayout>
            <DashboardMain />
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

      {/* RUTAS DE PROJECTS */}
      <Stack.Screen name="ExploreProjects">
        {() => (
          <DashboardLayout>
            <ExploreProjects />
          </DashboardLayout>
        )}
      </Stack.Screen>

      <Stack.Screen name="MyProjects">
        {() => (
          <DashboardLayout>
            <MyProjects />
          </DashboardLayout>
        )}
      </Stack.Screen>

      <Stack.Screen name="FavoriteProjects">
        {() => (
          <DashboardLayout>
            <FavoriteProjects />
          </DashboardLayout>
        )}
      </Stack.Screen>

      <Stack.Screen name="ProjectDetails">
        {() => (
          <DashboardLayout>
            <ProjectDetails />
          </DashboardLayout>
        )}
      </Stack.Screen>

      <Stack.Screen name="RequestProject">
        {() => (
          <DashboardLayout>
            <RequestProject />
          </DashboardLayout>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
)

export default AppNavigator