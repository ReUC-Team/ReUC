// apps/mobile/src/features/search/hooks/useSearch.ts

import { useState, useEffect, useMemo } from 'react' 
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../../context/AuthContext'
import { getSearchRoutesByRole } from '../../../config/projectRoutesConfig'
import { filterRoutes } from '../utils/searchHelpers'

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const navigation = useNavigation<any>()
  const { role } = useAuth()

  const availableRoutes = useMemo(() => {
    return getSearchRoutesByRole(role || 'outsider')
  }, [role]) // Solo recalcula cuando cambia el rol

  // Buscar cuando cambia el término
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([])
      setSelectedIndex(-1)
      return
    }

    const filtered = filterRoutes(availableRoutes, searchTerm)
    setResults(filtered)
    setSelectedIndex(-1)
  }, [searchTerm, availableRoutes]) 

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleSelect = (index: number) => {
    if (index >= 0 && index < results.length) {
      const route = results[index]
      setSearchTerm('')
      setResults([])
      setSelectedIndex(-1)
      navigation.navigate(route.screen)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setResults([])
    setSelectedIndex(-1)
  }

  return {
    searchTerm,
    results,
    selectedIndex,
    handleSearch,
    handleSelect,
    clearSearch,
  }
}