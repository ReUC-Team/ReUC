// apps/mobile/src/features/dashboard/pages/DashboardMain.tsx

import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DashboardTabs from './DashboardTabs'
import { useThemedStyles } from '../../../../hooks/useThemedStyles'
import { createDashboardMainStyles } from '../../../../styles/screens/DashboardMain.styles'
import { useProfileStatus } from '../../../profile/hooks/useProfileStatus'
import ProfileIncompleteModal from '../../../../components/ProfileIncompleteModal'

const DASHBOARD_MODAL_KEY = '@reuc:dashboardProfileModalShown'

export default function DashboardMain() {
  const styles = useThemedStyles(createDashboardMainStyles)
  const { isComplete, isLoading } = useProfileStatus()
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    const checkAndShowModal = async () => {
      try {
        const hasSeenModal = await AsyncStorage.getItem(DASHBOARD_MODAL_KEY)

        // Mostrar modal si:
        // 1. No está cargando
        // 2. El perfil NO está completo
        // 3. NO ha visto el modal antes (en esta sesión)
        if (!isLoading && !isComplete && !hasSeenModal) {
          setShowProfileModal(true)
          // Marcar como visto
          await AsyncStorage.setItem(DASHBOARD_MODAL_KEY, 'true')
        }
      } catch (error) {
        console.error('Error checking modal status:', error)
      }
    }

    checkAndShowModal()
  }, [isComplete, isLoading])

  const handleCloseModal = () => {
    setShowProfileModal(false)
  }

  return (
    <View style={styles.container}>
      <ProfileIncompleteModal
        isOpen={showProfileModal}
        onClose={handleCloseModal}
        showCloseButton={true}
        title="¡Completa tu perfil!"
        message="Para aprovechar al máximo la plataforma y poder solicitar proyectos, necesitas completar tu información de perfil."
        subMessage="Esto solo te tomará unos minutos y nos ayuda a conectarte con los mejores proyectos."
      />
      
      <DashboardTabs />
    </View>
  )
}