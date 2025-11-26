// apps/mobile/src/features/teams/hooks/useTeamData.ts

import { useState, useEffect, useCallback } from 'react'
import { getProjectDetails } from '../../projects/services/projectsService'
import type { TeamMemberDetailed } from '../../projects/types/project.types'

export default function useTeamData(projectUuid: string | undefined) {
  const [members, setMembers] = useState<TeamMemberDetailed[]>([])
  const [hasTeam, setHasTeam] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeam = useCallback(async () => {
    if (!projectUuid) {
      setError('UUID del proyecto no proporcionado')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const projectData = await getProjectDetails(projectUuid)

      const teamMembers = projectData.teamMembers || []

      // Mapear a formato esperado
      const mappedMembers: TeamMemberDetailed[] = teamMembers.map((member: any) => {
        const fullNameParts = member.fullName?.split(' ') || []
        return {
          uuidUser: member.uuid_user,
          firstName: fullNameParts[0] || '',
          middleName: '',
          lastName: fullNameParts.slice(1).join(' ') || '',
          email: member.email,
          universityId: member.universityId,
          roleName: member.role,
          roleId: member.roleId || 0,
        }
      })

      setMembers(mappedMembers)
      setHasTeam(mappedMembers.length > 0)
    } catch (err) {
      console.error('Error fetching team:', err)
      setMembers([])
      setHasTeam(false)
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }, [projectUuid])

  useEffect(() => {
    fetchTeam()
  }, [fetchTeam])

  return { members, hasTeam, isLoading, error, refreshTeam: fetchTeam }
}