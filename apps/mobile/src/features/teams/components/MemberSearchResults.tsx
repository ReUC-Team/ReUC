// apps/mobile/src/features/teams/components/MemberSearchResults.tsx

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createMemberSearchResultsStyles } from '../../../styles/components/teams/MemberSearchResults.styles'
import type { SearchUser } from '../../projects/types/project.types'

interface MemberSearchResultsProps {
  results: SearchUser[]
  isOpen: boolean
  searchTerm: string
  onSelect: (member: SearchUser) => void
}

const MemberSearchResults: React.FC<MemberSearchResultsProps> = ({
  results,
  isOpen,
  searchTerm,
  onSelect,
}) => {
  const styles = useThemedStyles(createMemberSearchResultsStyles)
  const palette = useThemedPalette()

  if (!isOpen || results.length === 0) {
    return null
  }

  // Función para resaltar el texto coincidente
  const highlightMatch = (text: string, search: string) => {
    if (!search || !text) return text

    const parts = text.split(new RegExp(`(${search})`, 'gi'))
    return (
      <Text>
        {parts.map((part, index) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <Text key={index} style={styles.highlightedText}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} nestedScrollEnabled>
        {results.map((member) => {
          const fullName = `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim()

          return (
            <TouchableOpacity
              key={member.uuidUser}
              style={styles.resultItem}
              onPress={() => onSelect(member)}
            >
              {/* Avatar */}
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color={palette.primary} />
              </View>

              {/* Info */}
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{highlightMatch(fullName, searchTerm)}</Text>
                <View style={styles.emailContainer}>
                  <Ionicons name="mail-outline" size={14} color={palette.textSecondary} />
                  <Text style={styles.email}>{highlightMatch(member.email, searchTerm)}</Text>
                </View>
                {member.universityId && (
                  <Text style={styles.universityId}>ID: {member.universityId}</Text>
                )}
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default MemberSearchResults