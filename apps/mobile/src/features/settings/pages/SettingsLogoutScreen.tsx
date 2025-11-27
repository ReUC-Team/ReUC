// apps/mobile/src/features/settings/pages/SettingsLogoutScreen.tsx

import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createSettingsDetailStyles } from '../../../styles/screens/settings/SettingsDetail.styles'
import useLogout from '../../auth/hooks/useLogout'

export default function SettingsLogoutScreen() {
  const styles = useThemedStyles(createSettingsDetailStyles)
  const navigation = useNavigation<any>()
  const { handleLogout, isLoading } = useLogout()

  const handleLogoutPress = () => {
    Alert.alert('¿Cerrar sesión?', '¿Estás seguro de que quieres salir?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Cerrar sesión',
        onPress: async () => {
          await handleLogout()
        },
        style: 'destructive',
      },
    ])
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cerrar Sesión</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningCard}>
          <Ionicons name="warning-outline" size={32} style={styles.warningIcon} />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>¿Estás seguro?</Text>
            <Text style={styles.warningText}>
              Al cerrar sesión, deberás ingresar tus credenciales nuevamente para acceder a tu cuenta.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, isLoading && { opacity: 0.6 }]}
          onPress={handleLogoutPress}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>
            {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}