// apps/mobile/src/features/teams/hooks/useSearchMembers.ts

import { useState, useEffect, useRef } from 'react'
import { searchMembers } from '../../projects/services/projectsService'
import { getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'
import type { SearchUser } from '../../projects/types/project.types'

export default function useSearchMembers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // Búsqueda con debounce
  useEffect(() => {
    // Limpiar resultados si el término es muy corto
    if (!searchTerm || searchTerm.trim().length < 3) {
      setResults([])
      setIsOpen(false)
      setIsSearching(false)
      return
    }

    // Limpiar timer anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Esperar 300ms antes de buscar
    debounceTimer.current = setTimeout(async () => {
      setIsSearching(true)

      try {
        const members = await searchMembers(searchTerm, 10)
        setResults(members)
        setIsOpen(members.length > 0)
        setSelectedIndex(-1)
      } catch (err: any) {
        console.error('Error searching members:', err)
        const errorMessage = getDisplayMessage(err)

        // No mostrar alerta si es error de validación (menos de 3 chars)
        if (!err.errorCode?.includes('VALIDATION')) {
          Toast.show({
            type: 'error',
            text1: 'Error en búsqueda',
            text2: errorMessage,
            position: 'bottom',
          })
        }

        setResults([])
        setIsOpen(false)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchTerm])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleSelect = (member: SearchUser) => {
    setSearchTerm('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    return member
  }

  const handleFocus = () => {
    if (results.length > 0 && searchTerm.trim().length >= 3) {
      setIsOpen(true)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  return {
    searchTerm,
    results,
    isSearching,
    isOpen,
    selectedIndex,
    handleSearch,
    handleSelect,
    handleFocus,
    clearSearch,
  }
}