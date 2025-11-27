// apps/mobile/src/features/dashboard/student/pages/DashboardTabs.tsx

import React from 'react'
import { useWindowDimensions } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { createDashboardTabsStyles } from '../../../../styles/components/dashboard/DashboardTabs.styles'

// Componentes de Student Dashboard
import StudentProjectStats from '../components/StudentProjectStats'
import ResumenTab from '../components/ResumenTab'
import Projects from '../../shared/components/Projects'

type TabParamList = {
  Inicio: undefined
  Resumen: undefined
  Proyectos: undefined
}

const Tab = createMaterialTopTabNavigator<TabParamList>()

const DashboardTabs: React.FC = () => {
  const layout = useWindowDimensions()
  const styles = useThemedStyles(createDashboardTabsStyles)
  const palette = useThemedPalette()

  // Handler para Projects
  const handleProjectClick = (project: any) => {
    console.log('🔍 Ver detalles del proyecto:', project)
    // TODO: Navegar a pantalla de detalles usando navigation
    // navigation.navigate('ProjectDetails', { uuid: project.uuid_project })
  }

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: false,
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
        component={StudentProjectStats}
        options={{
          tabBarLabel: 'Inicio',
          tabBarAccessibilityLabel: 'Ver estadísticas generales'
        }}
      />

      <Tab.Screen
        name="Resumen"
        component={ResumenTab}
        options={{
          tabBarLabel: 'Resumen',
          tabBarAccessibilityLabel: 'Ver proyectos activos y resumen de participación'
        }}
      />

      <Tab.Screen
        name="Proyectos"
        options={{
          tabBarLabel: 'Proyectos',
          tabBarAccessibilityLabel: 'Ver lista completa de proyectos'
        }}
      >
        {() => (
          <Projects
            dashboardType="student"
            onProjectClick={handleProjectClick}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

export default DashboardTabs