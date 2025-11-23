// apps/mobile/src/features/search/components/SearchResultCard.tsx

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createSearchResultCardStyles } from '../../../styles/components/search/SearchResultCard.styles'
import { getHighlightParts } from '../utils/searchHelpers'

interface SearchResultCardProps {
  route: {
    screen: string
    label: string
    icon: string
  }
  searchTerm: string
  onSelect: () => void
  isSelected?: boolean
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  route,
  searchTerm,
  onSelect,
  isSelected = false,
}) => {
  const styles = useThemedStyles(createSearchResultCardStyles)
  const palette = useThemedPalette()

  const { before, match, after } = getHighlightParts(route.label, searchTerm)

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      {/* Icono */}
      <View style={styles.iconContainer}>
        <Ionicons name={route.icon as any} size={24} color={palette.primary} />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.label}>
          <Text style={styles.labelNormal}>{before}</Text>
          <Text style={styles.labelHighlight}>{match}</Text>
          <Text style={styles.labelNormal}>{after}</Text>
        </Text>
        <Text style={styles.screenName}>{route.screen}</Text>
      </View>

      {/* Flecha */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={isSelected ? palette.primary : palette.textSecondary}
      />
    </TouchableOpacity>
  )
}

export default SearchResultCard