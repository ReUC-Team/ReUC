// apps/mobile/src/features/search/components/SearchModal.tsx

import React, { useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createSearchModalStyles } from '../../../styles/components/search/SearchModal.styles'
import { useSearch } from '../hooks/useSearch'
import SearchResultCard from './SearchResultCard'

interface SearchModalProps {
  visible: boolean
  onClose: () => void
}

const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
  const styles = useThemedStyles(createSearchModalStyles)
  const palette = useThemedPalette()
  const inputRef = useRef<TextInput>(null)

  const { searchTerm, results, selectedIndex, handleSearch, handleSelect, clearSearch } = useSearch()

  // Auto-focus cuando se abre el modal
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [visible])

  const handleClose = () => {
    clearSearch()
    onClose()
  }

  const handleSelectItem = (index: number) => {
    handleSelect(index)
    onClose()
  }

  const EmptyState = () => {
    if (searchTerm.trim() === '') {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={palette.textSecondary} />
          <Text style={styles.emptyTitle}>Busca páginas y funciones</Text>
          <Text style={styles.emptySubtitle}>Escribe para comenzar a buscar</Text>
        </View>
      )
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={palette.textSecondary} />
        <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
        <Text style={styles.emptySubtitle}>Intenta con otros términos de búsqueda</Text>
      </View>
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: palette.background }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={28} color={palette.text} />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={palette.textSecondary} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Buscar páginas..."
              placeholderTextColor={palette.textSecondary}
              value={searchTerm}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchTerm !== '' && (
              <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={palette.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Resultados */}
        <View style={styles.content}>
          {results.length > 0 ? (
            <>
              <FlatList
                data={results}
                keyExtractor={(item, index) => `${item.screen}-${index}`}
                renderItem={({ item, index }) => (
                  <SearchResultCard
                    route={item}
                    searchTerm={searchTerm}
                    onSelect={() => handleSelectItem(index)}
                    isSelected={selectedIndex === index}
                  />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />

              {/* Contador */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado
                  {results.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </>
          ) : (
            <EmptyState />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default SearchModal