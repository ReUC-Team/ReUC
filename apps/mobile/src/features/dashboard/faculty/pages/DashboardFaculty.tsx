// apps/mobile/src/features/dashboard/faculty/pages/DashboardFaculty.tsx

import React from 'react'
import { View, Text } from 'react-native'
import { useThemedStyles } from '../../../../hooks/useThemedStyles'
import { createComingSoonStyles } from '../../../../styles/screens/ComingSoon.styles'

export default function DashboardFaculty() {
  const styles = useThemedStyles(createComingSoonStyles)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard de Profesor</Text>
      <Text style={styles.subtitle}>Próximamente disponible</Text>
      <Text style={styles.description}>
        Estamos trabajando en esta sección. Pronto podrás acceder a todas las funcionalidades para profesores.
      </Text>
    </View>
  )
}