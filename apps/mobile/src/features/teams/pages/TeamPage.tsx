// apps/mobile/src/features/teams/pages/TeamPage.tsx

import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createTeamPageStyles } from '../../../styles/screens/TeamPage.styles'
import { spacing } from '../../../styles/theme/spacing'
import { useAuth } from '../../../context/AuthContext'
import useTeamData from '../hooks/useTeamData'
import useTeamMetadata from '../hooks/useTeamMetadata'
import useTeamManagement from '../hooks/useTeamManagement'
import TeamMemberCard from '../components/TeamMemberCard'
import EmptyTeamState from '../components/EmptyTeamState'
import AddMemberForm from '../components/AddMemberForm'
import SaveTeamButton from '../components/SaveTeamButton'
import TeamRequirements from '../components/TeamRequirements'
import ProjectStatusBadge from '../../projects/components/ProjectStatusBadge'
import { getProjectDetails } from '../../projects/services/projectsService'
import type { StatusObject } from '../../projects/types/project.types'

const TeamPage: React.FC = () => {
  const styles = useThemedStyles(createTeamPageStyles)
  const palette = useThemedPalette()
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { isProfessor } = useAuth()
  const { uuid } = route.params || {}

  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [projectStatus, setProjectStatus] = useState<StatusObject | null>(null)

  const { members, hasTeam, isLoading, error, refreshTeam } = useTeamData(uuid)
  const { roles, constraints } = useTeamMetadata(uuid)
  const { pendingMembers, addMember, removeMember, updateMemberRole, saveTeam, isSaving } =
    useTeamManagement(uuid, roles, constraints, members)

  const canEdit = isProfessor

  // Cargar estado del proyecto
  useEffect(() => {
    const loadProjectStatus = async () => {
      if (!uuid) return
      
      try {
        const projectData = await getProjectDetails(uuid)
        setProjectStatus(projectData.status)
      } catch (error) {
        console.error('Error loading project status:', error)
      }
    }

    loadProjectStatus()
  }, [uuid])

  // Calcular conteos actuales de roles
  const getCurrentCounts = (): Record<string, number> => {
    const counts: Record<string, number> = {}

    // Contar miembros existentes
    members.forEach((member) => {
      counts[member.roleName] = (counts[member.roleName] || 0) + 1
    })

    // Contar miembros pendientes
    pendingMembers.forEach((member) => {
      const role = roles.find((r) => r.id === member.roleId)
      if (role) {
        counts[role.name] = (counts[role.name] || 0) + 1
      }
    })

    return counts
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshTeam()
    setRefreshing(false)
  }

  const handleSaveTeam = async () => {
    const success = await saveTeam()
    if (success) {
      setShowAddForm(false)
      await refreshTeam()
    }
  }

  const handleTeamCreated = async () => {
    await refreshTeam()
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Equipo del <Text style={styles.titleAccent}>proyecto</Text>
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.loadingText}>Cargando equipo...</Text>
        </View>
      </View>
    )
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Equipo del <Text style={styles.titleAccent}>proyecto</Text>
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={palette.errorText} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Estado vacío - solo profesores pueden crear equipo
  if (!hasTeam && canEdit) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Equipo del <Text style={styles.titleAccent}>proyecto</Text>
          </Text>
          
          {/* Badge de estado */}
          {projectStatus && (
            <View style={{ marginTop: spacing.xs }}>
              <ProjectStatusBadge status={projectStatus} />
            </View>
          )}
        </View>

        {/* Requisitos del equipo */}
        {roles.length > 0 && (
          <View style={{ paddingHorizontal: spacing.md }}>
            <TeamRequirements
              roles={roles}
              constraints={constraints}
              currentCounts={getCurrentCounts()}
            />
          </View>
        )}

        <EmptyTeamState projectUuid={uuid} onTeamCreated={handleTeamCreated} />
      </ScrollView>
    )
  }

  // Estado vacío - outsider no puede crear equipo
  if (!hasTeam && !canEdit) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Equipo del <Text style={styles.titleAccent}>proyecto</Text>
          </Text>

          {/* Badge de estado */}
          {projectStatus && (
            <View style={{ marginTop: spacing.xs }}>
              <ProjectStatusBadge status={projectStatus} />
            </View>
          )}
        </View>

        {/* Requisitos del equipo */}
        {roles.length > 0 && (
          <View style={{ paddingHorizontal: spacing.md }}>
            <TeamRequirements
              roles={roles}
              constraints={constraints}
              currentCounts={getCurrentCounts()}
            />
          </View>
        )}

        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color={palette.textSecondary} />
          <Text style={styles.emptyTitle}>Este proyecto aún no tiene equipo</Text>
          <Text style={styles.emptySubtitle}>El equipo será asignado por un profesor</Text>
        </View>
      </View>
    )
  }

  // Estado con equipo existente
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Equipo del <Text style={styles.titleAccent}>proyecto</Text>
        </Text>

        {/* Badge de estado */}
        {projectStatus && (
          <View style={{ marginTop: spacing.xs }}>
            <ProjectStatusBadge status={projectStatus} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Requisitos del equipo */}
        {roles.length > 0 && (
          <TeamRequirements
            roles={roles}
            constraints={constraints}
            currentCounts={getCurrentCounts()}
          />
        )}

        {/* Lista de miembros existentes */}
        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Miembros del Equipo ({members.length})</Text>

          {members.map((member) => (
            <TeamMemberCard
              key={member.uuidUser}
              member={member}
              roles={roles}
              projectUuid={uuid}
              onRefresh={refreshTeam}
              canEdit={canEdit}
            />
          ))}
        </View>

        {/* Formulario para agregar más miembros (solo profesores) */}
        {canEdit && (
          <>
            {showAddForm ? (
              <View style={styles.addFormSection}>
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

                <TouchableOpacity
                  onPress={() => setShowAddForm(false)}
                  style={styles.cancelAddButton}
                >
                  <Text style={styles.cancelAddButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addMemberButton} onPress={() => setShowAddForm(true)}>
                <Ionicons name="person-add" size={20} color={palette.onPrimary} />
                <Text style={styles.addMemberButtonText}>Agregar más miembros</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  )
}

export default TeamPage