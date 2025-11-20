// apps/mobile/src/components/LeftSidebar.tsx

import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles } from '../hooks/useThemedStyles'
import { createLeftSidebarStyles } from '../styles/components/header/LeftSidebar.styles'
import { useAuth } from '../context/AuthContext'
import { getSidebarProjectRoutes } from '../config/projectRoutesConfig'

type Props = {
  isVisible: boolean
  onClose: () => void
  onNavigate?: (screen: string) => void
}

type MenuItem = {
  icon: string
  label: string
  screen: string
}

const LeftSidebar: React.FC<Props> = ({ isVisible, onClose, onNavigate }) => {
  const styles = useThemedStyles(createLeftSidebarStyles)
  const navigation = useNavigation<any>()
  const { user } = useAuth()
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width)).current

  // Obtener rutas de proyectos según el rol del usuario
  const projectRoutes = getSidebarProjectRoutes(user?.role || 'outsider')

  // Construir menú dinámico basado en el rol
  const menuItems: MenuItem[] = [
    // Siempre mostrar Dashboard
    { icon: 'home-outline', label: 'Inicio', screen: 'Dashboard' },

    // Rutas de proyectos basadas en rol
    ...projectRoutes.map((route) => ({
      icon: route.icon,
      label: route.label,
      screen: route.screen,
    })),
  ]

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible])

  const handleMenuPress = (item: MenuItem) => {
    if (onNavigate) {
      onNavigate(item.screen)
    } else {
      navigation.navigate(item.screen)
    }
    onClose()
  }

  return (
    <Modal visible={isVisible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.sidebar,
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              {/* Header del Sidebar */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <Text style={styles.logo}>
                    Re<Text style={styles.logoAccent}>UC</Text>
                  </Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={28} style={styles.closeIcon} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Menu Items */}
              <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.menuSection}>
                  <Text style={styles.sectionTitle}>NAVEGACIÓN</Text>
                  {menuItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.menuItem}
                      onPress={() => handleMenuPress(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuItemContent}>
                        <View style={styles.iconContainer}>
                          <Ionicons name={item.icon as any} size={22} style={styles.menuIcon} />
                        </View>
                        <Text style={styles.menuText}>{item.label}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} style={styles.chevronIcon} />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default LeftSidebar