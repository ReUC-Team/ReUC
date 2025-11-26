// apps/mobile/src/features/settings/pages/SettingsHelpScreen.tsx

import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createSettingsDetailStyles } from '../../../styles/screens/settings/SettingsDetail.styles'

export default function SettingsHelpScreen() {
  const styles = useThemedStyles(createSettingsDetailStyles)
  const navigation = useNavigation<any>()

  const handleEmailPress = () => {
    Linking.openURL('mailto:soporte@reuc.com')
  }

  const handleWebPress = () => {
    Linking.openURL('https://reuc.com/ayuda')
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayuda y Soporte</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.legalContent}>
          <Text style={styles.legalDescription}>
            Estamos aquí para ayudarte. Encuentra respuestas a tus preguntas o contáctanos directamente.
          </Text>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>Centro de Ayuda</Text>
            <Text style={styles.legalSectionContent}>
              Encuentra respuestas a las preguntas más frecuentes en nuestro centro de ayuda. Incluye guías
              paso a paso, tutoriales en video y documentación detallada.
            </Text>
            <TouchableOpacity style={styles.helpButton} onPress={handleWebPress} activeOpacity={0.7}>
              <Ionicons name="open-outline" size={20} style={styles.helpButtonIcon} />
              <Text style={styles.helpButtonText}>Visitar Centro de Ayuda</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>Preguntas Frecuentes</Text>
            <Text style={styles.legalSectionContent}>
              ¿Cómo creo un proyecto? ¿Cómo invito miembros a mi equipo? ¿Cómo cambio mi contraseña?
              Encuentra respuestas a estas y más preguntas en nuestro centro de ayuda.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>Contacto Directo</Text>
            <Text style={styles.legalSectionContent}>
              Si necesitas ayuda adicional o tienes una pregunta específica, nuestro equipo de soporte
              está disponible para ayudarte.
            </Text>
            <TouchableOpacity style={styles.helpButton} onPress={handleEmailPress} activeOpacity={0.7}>
              <Ionicons name="mail-outline" size={20} style={styles.helpButtonIcon} />
              <Text style={styles.helpButtonText}>Contactar Soporte</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>Reportar un Problema</Text>
            <Text style={styles.legalSectionContent}>
              ¿Encontraste un error o tienes sugerencias para mejorar la aplicación? Nos encantaría
              escucharte. Envíanos un correo a soporte@reuc.com
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>Horario de Atención</Text>
            <Text style={styles.legalSectionContent}>
              Nuestro equipo de soporte está disponible de lunes a viernes, de 9:00 AM a 6:00 PM.
              Responderemos tu mensaje en un plazo máximo de 24 horas.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>Información de la App</Text>
            <View style={styles.appInfoContainer}>
              <View style={styles.appInfoRow}>
                <Text style={styles.appInfoLabel}>Versión:</Text>
                <Text style={styles.appInfoValue}>1.0.0</Text>
              </View>
              <View style={styles.appInfoRow}>
                <Text style={styles.appInfoLabel}>Última actualización:</Text>
                <Text style={styles.appInfoValue}>{new Date().toLocaleDateString('es-ES')}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}