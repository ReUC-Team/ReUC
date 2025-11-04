// apps/mobile/src/components/LeftSidebar.tsx

import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Image,
} from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native' // ⬅️ IMPORTA useNavigation
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
  hasSubmenu?: boolean
}

const menuItems: MenuItem[] = [
  { icon: 'list-outline',      iconType: 'ionicons', label: 'Solicitar un proyecto', screen: 'RequestProject' },
  { icon: 'search-outline',    iconType: 'ionicons', label: 'Explorar proyectos',    screen: 'ExploreProjects' },
  { icon: 'folder-outline',    iconType: 'ionicons', label: 'Mis proyectos',         screen: 'MyProjects', hasSubmenu: true },
  { icon: 'star-outline',      iconType: 'ionicons', label: 'Mis favoritos',         screen: 'FavoriteProjects', hasSubmenu: true },
  { icon: 'people-outline',    iconType: 'ionicons', label: 'Miembros',              screen: 'Members',     hasSubmenu: true },
  { icon: 'document-text-outline', iconType: 'ionicons', label: 'Documentos',        screen: 'Documents' },
  { icon: 'notifications-outline', iconType: 'ionicons', label: 'Notificaciones',    screen: 'Notifications' },
]

export default function LeftSidebar({ isVisible, onClose, onNavigate }: Props) {
  const styles = useThemedStyles(createLeftSidebarStyles)
  const navigation = useNavigation<any>() // ⬅️ USA useNavigation
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width)).current
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

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

  const toggleSubmenu = (screen: string) => {
    setExpandedMenus(prev =>
      prev.includes(screen)
        ? prev.filter(s => s !== screen)
        : [...prev, screen]
    )
  }

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
    if (item.hasSubmenu) {
      toggleSubmenu(item.screen)
    } else {
      // ⬇️ USA navigation.navigate EN LUGAR DE SOLO onNavigate
      if (onNavigate) {
        onNavigate(item.screen)
      } else {
        navigation.navigate(item.screen) // ⬅️ Navega directamente
      }
      onClose()
    }
  }

  const renderSubmenuItems = (parentScreen: string) => {
    const submenuData: Record<string, Array<{ title: string; avatar?: any }>> = {
      MyProjects: [
        { title: 'Proyecto Alpha', avatar: require('../assets/avatar.png') },
        { title: 'Proyecto Beta', avatar: require('../assets/avatar.png') },
        { title: 'Proyecto Gamma', avatar: require('../assets/avatar.png') },
      ],
      FavoriteProjects: [
        { title: 'Proyecto Alpha', avatar: require('../assets/avatar.png') },
        { title: 'Proyecto Beta', avatar: require('../assets/avatar.png') },
        { title: 'Proyecto Gamma', avatar: require('../assets/avatar.png') },
      ],
      Members: [
        { title: 'Miembro 1', avatar: require('../assets/avatar.png') },
        { title: 'Miembro 2', avatar: require('../assets/avatar.png') },
        { title: 'Miembro 3', avatar: require('../assets/avatar.png') },
      ],
    }

    const items = submenuData[parentScreen] || []

    return items.map((subItem, index) => (
      <TouchableOpacity
        key={index}
        style={styles.submenuItem}
        onPress={() => {
          // ⬇️ USA navigation.navigate
          if (onNavigate) {
            onNavigate(`${parentScreen}/${subItem.title}`)
          } else {
            navigation.navigate(parentScreen) // ⬅️ Navega a la pantalla principal
          }
          onClose()
        }}
      >
        {subItem.avatar && (
          <Image source={subItem.avatar} style={styles.submenuAvatar} />
        )}
        <Text style={styles.submenuText}>{subItem.title}</Text>
      </TouchableOpacity>
    ))
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
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => handleMenuPress(item)}
                    >
                      <View style={styles.menuItemContent}>
                        {renderIcon(item)}
                        <Text style={styles.menuText}>{item.label}</Text>
                        {item.hasSubmenu && (
                          <Ionicons
                            name={expandedMenus.includes(item.screen) ? "chevron-up" : "chevron-down"}
                            size={20}
                            style={styles.chevronIcon}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    {item.hasSubmenu && expandedMenus.includes(item.screen) && (
                      <View style={styles.submenuContainer}>
                        {renderSubmenuItems(item.screen)}
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}