// apps/mobile/src/features/settings/pages/SettingsAccessibilityScreen.tsx

import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createSettingsDetailStyles } from '../../../styles/screens/settings/SettingsDetail.styles'
import { useTheme } from '../../../context/ThemeContext'

export default function SettingsAccessibilityScreen() {
  const styles = useThemedStyles(createSettingsDetailStyles)
  const navigation = useNavigation<any>()
  const { themeMode, setThemeMode, fontMode, setFontMode } = useTheme()

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accesibilidad</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TEMA</Text>
          <View style={styles.sectionContent}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="moon-outline" size={22} style={styles.toggleIcon} />
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Modo Oscuro</Text>
                  <Text style={styles.toggleSubtitle}>
                    Reduce el brillo de la pantalla
                  </Text>
                </View>
              </View>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                trackColor={{ false: styles.switchTrack.color, true: styles.switchTrackActive.color }}
                thumbColor={styles.switchThumb.color}
              />
            </View>

            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="contrast-outline" size={22} style={styles.toggleIcon} />
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Alto Contraste</Text>
                  <Text style={styles.toggleSubtitle}>
                    Mejora la visibilidad del texto
                  </Text>
                </View>
              </View>
              <Switch
                value={themeMode === 'highContrast'}
                onValueChange={(value) => setThemeMode(value ? 'highContrast' : 'light')}
                trackColor={{ false: styles.switchTrack.color, true: styles.switchTrackActive.color }}
                thumbColor={styles.switchThumb.color}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FUENTES</Text>
          <View style={styles.sectionContent}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="text-outline" size={22} style={styles.toggleIcon} />
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Fuente Dislexia</Text>
                  <Text style={styles.toggleSubtitle}>
                    Fuente diseñada para facilitar la lectura
                  </Text>
                </View>
              </View>
              <Switch
                value={fontMode === 'dyslexic'}
                onValueChange={(value) => setFontMode(value ? 'dyslexic' : 'default')}
                trackColor={{ false: styles.switchTrack.color, true: styles.switchTrackActive.color }}
                thumbColor={styles.switchThumb.color}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}