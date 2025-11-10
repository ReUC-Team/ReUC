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
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles } from '../hooks/useThemedStyles'
import { createLeftSidebarStyles } from '../styles/components/header/LeftSidebar.styles'

type Props = {
  isVisible: boolean
  onClose: () => void
  onNavigate?: (screen: string) => void
}

type MenuItem = {
  icon: string
  iconType: 'ionicons' | 'material'
  label: string
  screen: string
}

const menuItems: MenuItem[] = [
  { icon: 'list-outline',      iconType: 'ionicons', label: 'Solicitar un proyecto', screen: 'RequestProject' },
  { icon: 'search-outline',    iconType: 'ionicons', label: 'Explorar proyectos',    screen: 'ExploreProjects' },
  { icon: 'folder-outline',    iconType: 'ionicons', label: 'Mis proyectos',         screen: 'MyProjects' },
  { icon: 'star-outline',      iconType: 'ionicons', label: 'Mis favoritos',         screen: 'FavoriteProjects' },
  { icon: 'people-outline',    iconType: 'ionicons', label: 'Miembros',              screen: 'Members' },
  { icon: 'document-text-outline', iconType: 'ionicons', label: 'Documentos',        screen: 'Documents' },
  { icon: 'notifications-outline', iconType: 'ionicons', label: 'Notificaciones',    screen: 'Notifications' },
]

export default function LeftSidebar({ isVisible, onClose, onNavigate }: Props) {
  const styles = useThemedStyles(createLeftSidebarStyles)
  const navigation = useNavigation<any>() 
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width)).current

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

  const renderIcon = (item: MenuItem) => {
    if (item.iconType === 'ionicons') {
      return (
        <Ionicons
          name={item.icon as any}
          size={24}
          style={styles.menuIcon}
        />
      )
    }
    return (
      <MaterialIcons
        name={item.icon as any}
        size={24}
        style={styles.menuIcon}
      />
    )
  }

  const handleMenuPress = (item: MenuItem) => {
    if (onNavigate) {
      onNavigate(item.screen)
    } else {
      navigation.navigate(item.screen) 
    }
    onClose()
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
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
                <Text style={styles.logo}>
                  Re<Text style={{ color: styles.logoAccent.color }}>UC</Text>
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} style={styles.closeIcon} />
                </TouchableOpacity>
              </View>

              {/* Menu Items */}
              <ScrollView style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => handleMenuPress(item)}
                  >
                    <View style={styles.menuItemContent}>
                      {renderIcon(item)}
                      <Text style={styles.menuText}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}