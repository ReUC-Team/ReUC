// apps/mobile/src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getSession } from '../features/auth/pages/authServiceNative'
import { tokenStorage } from '../features/auth/utils/tokenStorage'
import { AuthenticationError } from '../utils/errorHandler'

interface User {
  uuid: string
  email: string
  role: 'student' | 'professor' | 'outsider' | 'admin'
  roleDetails?: any
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  
  // Role helpers
  isStudent: boolean
  isProfessor: boolean
  isOutsider: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar usuario al iniciar la app
  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const token = await tokenStorage.getAccessToken()
      
      if (!token) {
        console.log('❌ No token found')
        setUser(null)
        setIsLoading(false)
        return
      }

      console.log(' Token found, loading user session...')

      // Usar getSession del authService (ya tiene todos los headers correctos)
      const userData = await getSession()
      
      console.log('✅ User session loaded:', userData)
      setUser(userData)
    } catch (error: any) {
      console.error('❌ Error loading user:', error)
      
      if (error instanceof AuthenticationError) {
        await tokenStorage.clearTokens()
      }
      
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (userData: User) => {
    console.log(' Setting user in AuthContext:', userData)
    setUser(userData)
  }

  const logout = async () => {
    console.log(' Logging out...')
    await tokenStorage.clearTokens()
    setUser(null)
  }

  const refreshUser = async () => {
    console.log(' Refreshing user session...')
    await loadUser()
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    
    // Role helpers
    isStudent: user?.role === 'student',
    isProfessor: user?.role === 'professor',
    isOutsider: user?.role === 'outsider',
    isAdmin: user?.role === 'admin',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}