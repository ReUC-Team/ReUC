// apps/mobile/src/components/BannerSelector.tsx

import React from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../.././../hooks/useThemedStyles'
import { createBannerSelectorStyles } from '../../../styles/components/projects/BannerSelector.styles'

interface DefaultBanner {
  uuid: string
  url: string
  name: string
}

interface BannerSelectorProps {
  label: string
  defaultBanners: DefaultBanner[]
  selectedBannerUuid: string
  customBannerName: string
  onSelectBanner: (uuid: string) => void
  onPickCustomBanner: () => void
  error?: string
}

const BannerSelector: React.FC<BannerSelectorProps> = ({
  label,
  defaultBanners,
  selectedBannerUuid,
  customBannerName,
  onSelectBanner,
  onPickCustomBanner,
  error,
}) => {
  const styles = useThemedStyles(createBannerSelectorStyles)
  const palette = useThemedPalette()

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Botón para subir banner custom */}
      <TouchableOpacity style={styles.uploadButton} onPress={onPickCustomBanner}>
        <Ionicons name="cloud-upload-outline" size={20} color={palette.onPrimary} />
        <Text style={styles.uploadButtonText}>Subir banner personalizado</Text>
      </TouchableOpacity>

      {/* Mostrar info si hay banner custom seleccionado */}
      {customBannerName && (
        <View style={styles.customBannerInfo}>
          <Ionicons name="checkmark-circle" size={20} color="#065F46" />
          <Text style={styles.customBannerText}>
            Banner custom: {customBannerName}
          </Text>
        </View>
      )}

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>O selecciona uno predefinido</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Grid de banners predefinidos */}
      <View style={styles.bannersGrid}>
        {defaultBanners.map((banner) => (
          <TouchableOpacity
            key={banner.uuid}
            style={[
              styles.bannerItem,
              selectedBannerUuid === banner.uuid && styles.bannerItemSelected,
            ]}
            onPress={() => onSelectBanner(banner.uuid)}
          >
            <Image
              source={{ uri: banner.url }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerName}>
              <Text style={styles.bannerNameText}>{banner.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

export default BannerSelector