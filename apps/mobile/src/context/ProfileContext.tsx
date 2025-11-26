// apps/mobile/src/context/ProfileContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { getProfile } from '../features/profile/services/profileServiceNative'
import { AuthenticationError } from '../utils/errorHandler'
import { useAuth } from './AuthContext'

interface Profile {
  firstName?: string
  middleName?: string
  lastName?: string
  email?: string
  organizationName?: string
  phoneNumber?: string
  location?: string
  description?: string
}

interface ProfileContextType {
  profile: Profile
  isLoading: boolean
  error: any
  refreshProfile: () => Promise<void>
  clearProfile: () => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const { user, isAuthenticated } = useAuth()

  const refreshProfile = useCallback(async () => {
    // Si no hay usuario autenticado, limpiar perfil
    if (!isAuthenticated || !user) {
      console.log(' [ProfileContext] No authenticated user, clearing profile')
      setProfile({})
      setIsLoading(false)
      return
    }

    try {
      console.log(' [ProfileContext] Refreshing profile for user:', user.uuid)
      setIsLoading(true)
      setError(null)
      const data = await getProfile()
      setProfile(data.profile || {})
    } catch (err: any) {
      if (!(err instanceof AuthenticationError)) {
        setError(err)
      }
      setProfile({})
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const clearProfile = useCallback(() => {
    setProfile({})
    setError(null)
    setIsLoading(false)
  }, [])

  // Efecto que escucha cambios en el usuario
  useEffect(() => {
    
    if (isAuthenticated && user) {
      // Si hay usuario, cargar su perfil
      refreshProfile()
    } else {
      // Si no hay usuario, limpiar perfil
      clearProfile()
    }
  }, [user?.uuid, isAuthenticated]) // Depende del UUID del usuario

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, refreshProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}