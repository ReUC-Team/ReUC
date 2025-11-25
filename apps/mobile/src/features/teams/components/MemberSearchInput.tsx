// apps/mobile/src/features/teams/components/MemberSearchInput.tsx

import React from 'react'
import { View, TextInput, Text, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createMemberSearchInputStyles } from '../../../styles/components/teams/MemberSearchInput.styles'
import MemberSearchResults from './MemberSearchResults'
import type { SearchUser } from '../../projects/types/project.types'

interface MemberSearchInputProps {
  searchTerm: string
  results: SearchUser[]
  isSearching: boolean
  isOpen: boolean
  onSearch: (value: string) => void
  onSelect: (member: SearchUser) => void
  onFocus: () => void
}

const MemberSearchInput: React.FC<MemberSearchInputProps> = ({
  searchTerm,
  results,
  isSearching,
  isOpen,
  onSearch,
  onSelect,
  onFocus,
}) => {
  const styles = useThemedStyles(createMemberSearchInputStyles)
  const palette = useThemedPalette()

  const isSearchTermTooShort = searchTerm.length > 0 && searchTerm.length < 3

  return (
    <View style={styles.container}>
      {/* Input */}
      <View style={[styles.inputContainer, isSearchTermTooShort && styles.inputContainerWarning]}>
        <Ionicons name="search-outline" size={20} color={palette.textSecondary} style={styles.searchIcon} />

        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre o correo..."
          placeholderTextColor={palette.textSecondary}
          value={searchTerm}
          onChangeText={onSearch}
          onFocus={onFocus}
        />

        {isSearching && (
          <ActivityIndicator size="small" color={palette.primary} style={styles.loadingIcon} />
        )}
      </View>

      {/* Mensaje de ayuda cuando el término es muy corto */}
      {isSearchTermTooShort && (
        <View style={styles.warningContainer}>
          <Ionicons name="information-circle" size={20} color={palette.error} />
          <Text style={styles.warningText}>Escribe al menos 3 caracteres para buscar</Text>
        </View>
      )}

      {/* Dropdown de Resultados */}
      <MemberSearchResults
        results={results}
        isOpen={isOpen && !isSearchTermTooShort}
        searchTerm={searchTerm}
        onSelect={onSelect}
      />
    </View>
  )
}

export default MemberSearchInput