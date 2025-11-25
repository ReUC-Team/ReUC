// apps/mobile/src/features/teams/hooks/useTeamMetadata.ts

import { useState, useEffect } from 'react'
import { getTeamMetadata } from '../../projects/services/projectsService'
import { getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'
import type { TeamRole, TeamRoleConstraint } from '../../projects/types/project.types'

export default function useTeamMetadata(projectUuid: string | undefined) {
  const [roles, setRoles] = useState<TeamRole[]>([])
  const [constraints, setConstraints] = useState<Record<string, TeamRoleConstraint>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectUuid) {
      setError('UUID del proyecto no proporcionado')
      setIsLoading(false)
      return
    }

    const fetchMetadata = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const metadata = await getTeamMetadata(projectUuid)

        const allowedRoles = metadata.metadata?.allowedRoles || []

        if (allowedRoles.length === 0) {
          setRoles([])
          setConstraints({})
          setIsLoading(false)
          return
        }

        // Construir array de roles
        const rolesArray = allowedRoles.map((role: any) => ({
          id: role.teamRoleId,
          name: role.name,
        }))

        // Construir objeto de constraints por nombre de rol
        const constraintsObj: Record<string, TeamRoleConstraint> = {}
        allowedRoles.forEach((role: any) => {
          constraintsObj[role.name] = {
            min: role.minCount ?? 0,
            max: role.maxCount ?? null,
          }
        })

        setRoles(rolesArray)
        setConstraints(constraintsObj)
      } catch (err: any) {
        console.error('Error fetching team metadata:', err)
        const errorMessage = getDisplayMessage(err)
        setError(errorMessage)
        Toast.show({
          type: 'error',
          text1: 'Error al cargar metadata',
          text2: errorMessage,
          position: 'bottom',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetadata()
  }, [projectUuid])

  return { roles, constraints, isLoading, error }
}