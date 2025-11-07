// apps/mobile/src/context/ProfileContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { getProfile } from '../features/profile/services/profileServiceNative'
import { AuthenticationError } from '../utils/errorHandler'

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
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const refreshProfile = useCallback(async () => {
    try {
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
  }, []) // ← SE MANTIENE ESTABLE

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, refreshProfile }}>
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
