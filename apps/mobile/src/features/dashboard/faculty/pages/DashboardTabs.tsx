// apps/mobile/src/features/dashboards/faculty/pages/DashboardTabs.tsx

import React from 'react'
import { useWindowDimensions } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { createDashboardTabsStyles } from '../../../../styles/components/dashboard/DashboardTabs.styles'

// Componentes de Faculty Dashboard
import FacultyProjectStats from '../components/FacultyProjectStats'
import PendingRequests from '../components/PendingRequests'
import LinkedStudents from '../components/LinkedStudents'
import UploadedLinks from '../components/UploadedLinks'
import Projects from '../../shared/components/Projects'

type TabParamList = {
  Inicio: undefined
  Solicitudes: undefined
  Estudiantes: undefined
  Proyectos: undefined
  Enlaces: undefined
}

const Tab = createMaterialTopTabNavigator<TabParamList>()

const DashboardTabs: React.FC = () => {
  const layout = useWindowDimensions()
  const styles = useThemedStyles(createDashboardTabsStyles)
  const palette = useThemedPalette()

  // Handlers para Projects
  const handleProjectClick = (project: any) => {
    console.log('Ver detalles del proyecto:', project)
    // TODO: Navegar a pantalla de detalles
  }

  const handleContactStudents = (project: any) => {
    console.log('Contactar estudiantes:', project)
    // TODO: Abrir modal de contacto o navegar
  }

  const handleUploadComment = (project: any) => {
    console.log('Subir comentario:', project)
    // TODO: Abrir modal de comentario
  }

  const handleCheckDeliverables = (project: any) => {
    console.log('Revisar entregables:', project)
    // TODO: Navegar a entregables
  }

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: styles.indicator,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textSecondary,
        tabBarPressColor: palette.primary + '20',
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={FacultyProjectStats}
        options={{
          tabBarLabel: 'Inicio',
          tabBarAccessibilityLabel: 'Ver estadísticas del panel'
        }}
      />

      <Tab.Screen
        name="Solicitudes"
        component={PendingRequests}
        options={{
          tabBarLabel: 'Solicitudes',
          tabBarAccessibilityLabel: 'Ver solicitudes pendientes'
        }}
      />

      <Tab.Screen
        name="Estudiantes"
        component={LinkedStudents}
        options={{
          tabBarLabel: 'Estudiantes',
          tabBarAccessibilityLabel: 'Ver estudiantes vinculados'
        }}
      />

      <Tab.Screen
        name="Proyectos"
        options={{
          tabBarLabel: 'Proyectos',
          tabBarAccessibilityLabel: 'Ver proyectos recientes'
        }}
      >
        {() => (
          <Projects
            dashboardType="faculty"
            onProjectClick={handleProjectClick}
            onContactStudents={handleContactStudents}
            onUploadComment={handleUploadComment}
            onCheckDeliverables={handleCheckDeliverables}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Enlaces"
        component={UploadedLinks}
        options={{
          tabBarLabel: 'Enlaces',
          tabBarAccessibilityLabel: 'Ver enlaces subidos'
        }}
      />
    </Tab.Navigator>
  )
}

export default DashboardTabs