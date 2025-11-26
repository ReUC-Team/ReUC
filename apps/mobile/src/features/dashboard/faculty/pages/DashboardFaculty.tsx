// apps/mobile/src/features/dashboards/faculty/pages/DashboardFaculty.tsx

import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useThemedStyles } from '../../../../hooks/useThemedStyles'
import { useProfileStatus } from '../../../profile/hooks/useProfileStatus'
import { createDashboardMainStyles } from '../../../../styles/screens/DashboardMain.styles'
import DashboardTabs from './DashboardTabs'
import ProfileIncompleteModal from '@components/ProfileIncompleteModal'
import { useAuth } from '../../../../context/AuthContext'

export default function DashboardFaculty() {
  const styles = useThemedStyles(createDashboardMainStyles)
  const { isComplete, isLoading } = useProfileStatus()
  const { user } = useAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)

  // Key única por usuario
  const DASHBOARD_MODAL_KEY = `@reuc:dashboardProfileModalShown:${user?.uuid}`


  useEffect(() => {
    const checkAndShowModal = async () => {
      // No hacer nada si no hay usuario
      if (!user?.uuid) {
        console.log(' [DashboardFaculty] No user UUID available')
        return
      }
      
      try {
        const hasSeenModal = await AsyncStorage.getItem(DASHBOARD_MODAL_KEY)
        
        // Mostrar modal si:
        // 1. No está cargando
        // 2. El perfil NO está completo
        // 3. NO ha visto el modal antes (en esta sesión)
        const shouldShow = !isLoading && !isComplete && !hasSeenModal

        if (shouldShow) {
          setShowProfileModal(true)
          // Marcar como visto para esta sesión de este usuario
          await AsyncStorage.setItem(DASHBOARD_MODAL_KEY, 'true')
          console.log(' [DashboardFaculty] Modal flag saved to storage')
        } else {
          console.log(' [DashboardFaculty] NOT showing modal')
        }
      } catch (error) {
        console.error(' [DashboardFaculty] Error checking modal status:', error)
      }
    }
    
    checkAndShowModal()
  }, [isComplete, isLoading, user?.uuid])

  const handleCloseModal = () => {
    console.log(' [DashboardFaculty] Closing modal')
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