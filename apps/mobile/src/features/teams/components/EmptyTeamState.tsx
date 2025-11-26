// apps/mobile/src/features/teams/components/EmptyTeamState.tsx

import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createEmptyTeamStateStyles } from '../../../styles/components/teams/EmptyTeamState.styles'
import AddMemberForm from './AddMemberForm'
import SaveTeamButton from './SaveTeamButton'
import useTeamMetadata from '../hooks/useTeamMetadata'
import useTeamManagement from '../hooks/useTeamManagement'

interface EmptyTeamStateProps {
  projectUuid: string
  onTeamCreated: () => void
}

const EmptyTeamState: React.FC<EmptyTeamStateProps> = ({ projectUuid, onTeamCreated }) => {
  const styles = useThemedStyles(createEmptyTeamStateStyles)
  const palette = useThemedPalette()
  const [showForm, setShowForm] = useState(false)

  const { roles, constraints } = useTeamMetadata(projectUuid)
  const { pendingMembers, addMember, removeMember, updateMemberRole, saveTeam, isSaving } =
    useTeamManagement(projectUuid, roles, constraints)

  const handleSaveTeam = async () => {
    const success = await saveTeam()
    if (success) {
      onTeamCreated()
    }
  }

  if (showForm) {
    return (
      <View style={styles.formContainer}>
        <AddMemberForm
          roles={roles}
          constraints={constraints}
          pendingMembers={pendingMembers}
          onAddMember={addMember}
          onRemoveMember={removeMember}
          onUpdateMemberRole={updateMemberRole}
        />

        {pendingMembers.length > 0 && (
          <SaveTeamButton onClick={handleSaveTeam} isLoading={isSaving} disabled={isSaving} />
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Ionicons name="people-outline" size={64} color={palette.textSecondary} />
      <Text style={styles.title}>Este proyecto aún no tiene equipo</Text>
      <Text style={styles.subtitle}>Comienza agregando miembros al proyecto</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
        <Ionicons name="add" size={32} color={palette.onPrimary} />
      </TouchableOpacity>
    </View>
  )
}

export default EmptyTeamState