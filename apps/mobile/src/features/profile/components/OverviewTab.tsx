// apps/mobile/src/features/profile/components/OverviewTab.tsx

import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createOverviewTabStyles } from '../../../styles/components/profile/OverviewTab.styles'
interface OverviewTabProps {
  profile: any
}

const OverviewTab: React.FC<OverviewTabProps> = ({ profile }) => {
  const styles = useThemedStyles(createOverviewTabStyles)
  const palette = useThemedPalette()

  const firstName = profile?.firstName || 'Sin nombre'
  const middleName = profile?.middleName || ''
  const lastName = profile?.lastName || ''
  const fullName = `${firstName} ${middleName} ${lastName}`.trim()
  const location = profile?.location || 'Sin ubicación'
  const organizationName = profile?.organizationName || 'Sin organización'
  const phoneNumber = profile?.phoneNumber || 'Sin teléfono'
  const description = profile?.description || 'Sin descripción'
  const email = profile?.email || 'Sin correo'

  const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={styles.infoItem}>
      <Ionicons name={icon as any} size={20} color={palette.primary} style={styles.infoIcon} />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Información Personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        
        <InfoItem icon="person" label="Nombre completo" value={fullName} />
        <InfoItem icon="mail" label="Correo electrónico" value={email} />
        <InfoItem icon="call" label="Teléfono de contacto" value={phoneNumber} />
        <InfoItem icon="location" label="Ubicación" value={location} />
      </View>

      {/* Información Organizacional */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Organizacional</Text>
        <InfoItem icon="business" label="Organización" value={organizationName} />
      </View>

      {/* Sobre mí */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre mí</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default OverviewTab