// apps/mobile/src/features/teams/components/SaveTeamButton.tsx

import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createSaveTeamButtonStyles } from '../../../styles/components/teams/SaveTeamButton.styles'

interface SaveTeamButtonProps {
  onClick: () => void
  isLoading: boolean
  disabled: boolean
}

const SaveTeamButton: React.FC<SaveTeamButtonProps> = ({ onClick, isLoading, disabled }) => {
  const styles = useThemedStyles(createSaveTeamButtonStyles)
  const palette = useThemedPalette()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onClick}
        disabled={disabled || isLoading}
        style={[styles.button, (disabled || isLoading) && styles.buttonDisabled]}
      >
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color={palette.onPrimary} />
            <Text style={styles.buttonText}>Guardando...</Text>
          </>
        ) : (
          <>
            <Ionicons name="save-outline" size={20} color={palette.onPrimary} />
            <Text style={styles.buttonText}>Guardar Equipo</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default SaveTeamButton