// apps/mobile/src/features/dashboard/student/components/ResumenTab.tsx

import React from 'react'
import { ScrollView, View } from 'react-native'
import { useThemedPalette } from '../../../../hooks/useThemedStyles'
import ActiveProjectsCards from './ActiveProjectsCards'
import ParticipationSummary from './ParticipationSummary'
import { spacing } from '../../../../styles/theme/spacing'

const ResumenTab: React.FC = () => {
  const palette = useThemedPalette()

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: palette.surface }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: spacing.xs  }}
    >
      {/* Proyectos Activos */}
      <ActiveProjectsCards />
      
      {/* Resumen de Participación */}
      <ParticipationSummary />
      
      <View style={{ height: spacing.lg }} />
    </ScrollView>
  )
}

export default ResumenTab