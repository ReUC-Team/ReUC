// apps/mobile/src/features/settings/pages/SettingsNotificationsScreen.tsx

import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createSettingsDetailStyles } from '../../../styles/screens/settings/SettingsDetail.styles'

export default function SettingsNotificationsScreen() {
  const styles = useThemedStyles(createSettingsDetailStyles)
  const navigation = useNavigation<any>()
  
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    reminders: true,
  })

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCIAS</Text>
          <View style={styles.sectionContent}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="phone-portrait-outline" size={22} style={styles.toggleIcon} />
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Notificaciones Push</Text>
                  <Text style={styles.toggleSubtitle}>
                    Recibe alertas en tu dispositivo
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.push}
                onValueChange={(value) => setNotifications((prev) => ({ ...prev, push: value }))}
                trackColor={{ false: styles.switchTrack.color, true: styles.switchTrackActive.color }}
                thumbColor={styles.switchThumb.color}
              />
            </View>

            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="mail-outline" size={22} style={styles.toggleIcon} />
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Notificaciones por Email</Text>
                  <Text style={styles.toggleSubtitle}>
                    Recibe actualizaciones en tu correo
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.email}
                onValueChange={(value) => setNotifications((prev) => ({ ...prev, email: value }))}
                trackColor={{ false: styles.switchTrack.color, true: styles.switchTrackActive.color }}
                thumbColor={styles.switchThumb.color}
              />
            </View>

            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="alarm-outline" size={22} style={styles.toggleIcon} />
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Recordatorios</Text>
                  <Text style={styles.toggleSubtitle}>
                    Recordatorios de tareas pendientes
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.reminders}
                onValueChange={(value) => setNotifications((prev) => ({ ...prev, reminders: value }))}
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