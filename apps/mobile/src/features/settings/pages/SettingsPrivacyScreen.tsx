// apps/mobile/src/features/settings/pages/SettingsPrivacyScreen.tsx

import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createSettingsDetailStyles } from '../../../styles/screens/settings/SettingsDetail.styles'

export default function SettingsPrivacyScreen() {
  const styles = useThemedStyles(createSettingsDetailStyles)
  const navigation = useNavigation<any>()
  
  const [privacy, setPrivacy] = useState({
    shareUsageData: true,
    analyticalCookies: true,
  })

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidad</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS</Text>
          <View style={styles.sectionContent}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="analytics-outline" size={22} style={styles.toggleIcon} />
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Compartir Datos de Uso</Text>
                  <Text style={styles.toggleSubtitle}>
                    Ayúdanos a mejorar la app
                  </Text>
                </View>
              </View>
              <Switch
                value={privacy.shareUsageData}
                onValueChange={(value) => setPrivacy((prev) => ({ ...prev, shareUsageData: value }))}
                trackColor={{ false: styles.switchTrack.color, true: styles.switchTrackActive.color }}
                thumbColor={styles.switchThumb.color}
              />
            </View>

            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="pie-chart-outline" size={22} style={styles.toggleIcon} />
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Cookies Analíticas</Text>
                  <Text style={styles.toggleSubtitle}>
                    Permiten analizar el uso de la app
                  </Text>
                </View>
              </View>
              <Switch
                value={privacy.analyticalCookies}
                onValueChange={(value) => setPrivacy((prev) => ({ ...prev, analyticalCookies: value }))}
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