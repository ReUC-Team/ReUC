// apps/mobile/src/features/teams/components/AddMemberForm.tsx

import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createAddMemberFormStyles } from '../../../styles/components/teams/AddMemberForm.styles'
import MemberSearchInput from './MemberSearchInput'
import RoleSelector from './RoleSelector'
import PendingMemberCard from './PendingMemberCard'
import useSearchMembers from '../hooks/useSearchMembers'
import type {
  TeamRole,
  TeamRoleConstraint,
  PendingTeamMember,
  SearchUser,
} from '../../projects/types/project.types'

interface AddMemberFormProps {
  roles: TeamRole[]
  constraints: Record<string, TeamRoleConstraint>
  pendingMembers: PendingTeamMember[]
  onAddMember: (user: SearchUser, roleId: number) => boolean
  onRemoveMember: (id: number) => void
  onUpdateMemberRole: (id: number, roleId: number) => boolean
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({
  roles,
  constraints,
  pendingMembers,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
}) => {
  const styles = useThemedStyles(createAddMemberFormStyles)
  const palette = useThemedPalette()
  const [selectedRole, setSelectedRole] = useState<number | null>(roles[0]?.id || null)
  const [showInput, setShowInput] = useState(false)

  const { searchTerm, results, isSearching, isOpen, handleSearch, handleSelect, handleFocus, clearSearch } =
    useSearchMembers()

  const handleMemberSelect = (member: SearchUser) => {
    const selected = handleSelect(member)

    if (selectedRole) {
      const success = onAddMember(selected, selectedRole)
      if (success) {
        setShowInput(true)
      }
    }
  }

  const handleAddClick = () => {
    setShowInput(true)
  }

  const handleHideInput = () => {
    setShowInput(false)
    clearSearch()
  }

  // Actualizar selectedRole cuando cambien los roles disponibles
  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0].id)
    }
  }, [roles, selectedRole])

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Miembros Pendientes */}
      {pendingMembers.length > 0 && (
        <View style={styles.pendingSection}>
          <Text style={styles.sectionTitle}>Miembros a Agregar ({pendingMembers.length})</Text>

          {pendingMembers.map((member) => (
            <PendingMemberCard
              key={member.id}
              member={member}
              roles={roles}
              onRemove={onRemoveMember}
              onUpdateRole={onUpdateMemberRole}
            />
          ))}
        </View>
      )}

     
      {showInput && (
        <View style={styles.searchSection}>
          {/* Input de Búsqueda - ARRIBA y ocupa todo el ancho */}
          <View style={styles.searchInputContainer}>
            <MemberSearchInput
              searchTerm={searchTerm}
              results={results}
              isSearching={isSearching}
              isOpen={isOpen}
              onSearch={handleSearch}
              onSelect={handleMemberSelect}
              onFocus={handleFocus}
            />
          </View>

          {/* Selector de Rol - ABAJO y CENTRADO */}
          <View style={styles.roleSelectorContainer}>
            <RoleSelector
              roles={roles}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              constraints={constraints}
              pendingMembers={pendingMembers}
            />
          </View>

          {/* Botón para ocultar input */}
          <TouchableOpacity onPress={handleHideInput} style={styles.hideButton}>
            <Text style={styles.hideButtonText}>Ocultar búsqueda</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botón + para mostrar input */}
      {!showInput && (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddClick}>
            <Ionicons name="add" size={32} color={palette.onPrimary} />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

export default AddMemberForm