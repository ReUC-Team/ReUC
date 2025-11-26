// apps/mobile/src/features/settings/pages/SettingsPrivacyPolicyScreen.tsx

import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createSettingsDetailStyles } from '../../../styles/screens/settings/SettingsDetail.styles'

export default function SettingsPrivacyPolicyScreen() {
  const styles = useThemedStyles(createSettingsDetailStyles)
  const navigation = useNavigation<any>()

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidad</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.legalContent}>
          <Text style={styles.legalDescription}>
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </Text>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>1. Información que Recopilamos</Text>
            <Text style={styles.legalSectionContent}>
              Recopilamos información que usted nos proporciona directamente, incluyendo información de cuenta
              (nombre, email, contraseña), datos de perfil y preferencias, contenido que crea o comparte, y
              comunicaciones con nuestro equipo de soporte.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>2. Cómo Utilizamos su Información</Text>
            <Text style={styles.legalSectionContent}>
              Utilizamos su información para proporcionar y mejorar nuestros servicios, personalizar su experiencia,
              comunicarnos con usted sobre el servicio, y garantizar la seguridad de la plataforma.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>3. Compartir Información</Text>
            <Text style={styles.legalSectionContent}>
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto con su
              consentimiento explícito, para cumplir con obligaciones legales, con proveedores de servicios
              que nos ayudan a operar, o en caso de fusión o adquisición empresarial.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>4. Seguridad de los Datos</Text>
            <Text style={styles.legalSectionContent}>
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal
              contra acceso no autorizado, alteración, divulgación o destrucción.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>5. Sus Derechos</Text>
            <Text style={styles.legalSectionContent}>
              Usted tiene derecho a acceder, rectificar y eliminar sus datos personales, oponerse al procesamiento
              de sus datos, solicitar la limitación del procesamiento, y la portabilidad de datos.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>6. Cookies y Tecnologías Similares</Text>
            <Text style={styles.legalSectionContent}>
              Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso del servicio
              y personalizar el contenido.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>7. Cambios a esta Política</Text>
            <Text style={styles.legalSectionContent}>
              Podemos actualizar esta política de privacidad periódicamente. Le notificaremos sobre cambios
              significativos publicando la nueva política en esta página.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.legalSectionTitle}>8. Contacto</Text>
            <Text style={styles.legalSectionContent}>
              Si tiene preguntas sobre esta política de privacidad, contáctenos en privacidad@reuc.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}