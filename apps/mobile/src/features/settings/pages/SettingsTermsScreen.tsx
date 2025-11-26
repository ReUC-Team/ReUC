// apps/mobile/src/features/settings/pages/SettingsTermsScreen.tsx

import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createSettingsDetailStyles } from '../../../styles/screens/settings/SettingsDetail.styles'

export default function SettingsTermsScreen() {
  const styles = useThemedStyles(createSettingsDetailStyles)
  const navigation = useNavigation<any>()

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.legalContent}>
          <Text style={styles.legalDescription}>
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </Text>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>1. Aceptación de los Términos</Text>
            <Text style={styles.legalSectionContent}>
              Al acceder y utilizar este servicio, usted acepta cumplir con estos términos y condiciones.
              Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>2. Uso del Servicio</Text>
            <Text style={styles.legalSectionContent}>
              Nuestro servicio está destinado para uso personal y comercial legítimo. Usted se compromete a
              utilizar el servicio de manera responsable, no violar ninguna ley o regulación aplicable,
              respetar los derechos de otros usuarios, y no intentar acceder a áreas restringidas del sistema.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>3. Cuenta de Usuario</Text>
            <Text style={styles.legalSectionContent}>
              Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Debe notificarnos
              inmediatamente sobre cualquier uso no autorizado de su cuenta.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>4. Limitación de Responsabilidad</Text>
            <Text style={styles.legalSectionContent}>
              El servicio se proporciona "tal como está" sin garantías de ningún tipo. No seremos responsables
              por daños indirectos, incidentales o consecuentes.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>5. Modificaciones</Text>
            <Text style={styles.legalSectionContent}>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán
              en vigor inmediatamente después de su publicación.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}