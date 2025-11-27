// apps/mobile/src/features/settings/pages/SettingsScreen.tsx

import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createSettingsScreenStyles } from '../../../styles/screens/settings/SettingsScreen.styles'

type SettingItem = {
  id: string
  title: string
  icon: string
  subtitle?: string
  navigateTo: string
  destructive?: boolean
}

type SettingSection = {
  title: string
  items: SettingItem[]
}

export default function SettingsScreen() {
  const styles = useThemedStyles(createSettingsScreenStyles)
  const navigation = useNavigation<any>()

  const settingsSections: SettingSection[] = [
    {
      title: 'AJUSTES',
      items: [
        {
          id: 'general',
          title: 'General',
          icon: 'person-outline',
          subtitle: 'Idioma y preferencias básicas',
          navigateTo: 'SettingsGeneral',
        },
        {
          id: 'accessibility',
          title: 'Accesibilidad',
          icon: 'accessibility-outline',
          subtitle: 'Tema, contraste y fuentes',
          navigateTo: 'SettingsAccessibility',
        },
        {
          id: 'notifications',
          title: 'Notificaciones',
          icon: 'notifications-outline',
          subtitle: 'Gestiona tus notificaciones',
          navigateTo: 'SettingsNotifications',
        },
        {
          id: 'privacy',
          title: 'Privacidad',
          icon: 'eye-outline',
          subtitle: 'Datos y cookies',
          navigateTo: 'SettingsPrivacy',
        },
      ],
    },
    {
      title: 'LEGAL',
      items: [
        {
          id: 'terms',
          title: 'Términos y Condiciones',
          icon: 'document-text-outline',
          navigateTo: 'SettingsTerms',
        },
        {
          id: 'privacy-policy',
          title: 'Política de Privacidad',
          icon: 'shield-outline',
          navigateTo: 'SettingsPrivacyPolicy',
        },
        {
          id: 'help',
          title: 'Ayuda y Soporte',
          icon: 'help-circle-outline',
          navigateTo: 'SettingsHelp',
        },
      ],
    },
    {
      title: 'CUENTA',
      items: [
        {
          id: 'logout',
          title: 'Cerrar Sesión',
          icon: 'log-out-outline',
          navigateTo: 'SettingsLogout',
          destructive: true,
        },
      ],
    },
  ]

  const handleItemPress = (item: SettingItem) => {
    navigation.navigate(item.navigateTo)
  }

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemLeft}>
        <View
          style={[
            styles.iconContainer,
            item.destructive && styles.iconContainerDestructive,
          ]}
        >
          <Ionicons
            name={item.icon as any}
            size={22}
            style={[styles.settingIcon, item.destructive && styles.settingIconDestructive]}
          />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, item.destructive && styles.settingTitleDestructive]}>
            {item.title}
          </Text>
          {item.subtitle && <Text style={styles.settingSubtitle}>{item.subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} style={styles.chevronIcon} />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => renderSettingItem(item))}
            </View>
          </View>
        ))}

        {/* Version info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  )
}