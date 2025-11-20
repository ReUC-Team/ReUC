// apps/mobile/src/features/projects/components/ExploreProjectsList.tsx

import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createExploreProjectsListStyles } from '../../../styles/components/projects/ExploreProjectsList.styles'
import useExploreApplications from '../hooks/useExploreApplications'
import ProjectCard from './ProjectCard'

interface ExploreProjectsListProps {
  scrollY: Animated.Value
}

const ExploreProjectsList: React.FC<ExploreProjectsListProps> = ({ scrollY }) => {
  const styles = useThemedStyles(createExploreProjectsListStyles)
  const palette = useThemedPalette()
  const navigation = useNavigation<any>()
  const [search, setSearch] = useState('')

  const {
    applications,
    faculties,
    selectedFacultyName,
    pagination,
    isLoading,
    error,
    handleFacultyFilter,
    handlePageChange,
  } = useExploreApplications()

  // Filtrar por búsqueda local
  const filteredApplications = applications.filter((app) => {
    const searchLower = search.toLowerCase()
    return (
      app.title.toLowerCase().includes(searchLower) ||
      app.shortDescription.toLowerCase().includes(searchLower)
    )
  })

  const handleProjectClick = (uuid: string) => {
    navigation.navigate('ApplicationDetails', { uuid })
  }

  if (isLoading && applications.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Cargando proyectos...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={palette.errorText} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <Animated.FlatList
      data={filteredApplications}
      keyExtractor={(item) => item.uuid_application}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      })}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          {/* Barra de búsqueda */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color={palette.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar proyectos..."
              placeholderTextColor={palette.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Filtros por facultad */}
          <View style={styles.filtersSection}>
            <View style={styles.filtersContainer}>
              {faculties.map((faculty) => {
                const displayName = faculty.abbreviation || faculty.name
                const isSelected = selectedFacultyName === displayName

                return (
                  <TouchableOpacity
                    key={faculty.faculty_id}
                    style={[styles.filterTag, isSelected && styles.filterTagActive]}
                    onPress={() => handleFacultyFilter(displayName)}
                  >
                    <Text style={[styles.filterTagText, isSelected && styles.filterTagTextActive]}>
                      {displayName}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={48} color={palette.textSecondary} />
          <Text style={styles.emptyTitle}>No se encontraron proyectos</Text>
          <Text style={styles.emptySubtitle}>
            {search
              ? 'Intenta con otros términos de búsqueda'
              : selectedFacultyName
              ? 'No hay proyectos disponibles para esta facultad'
              : 'Aún no hay proyectos publicados'}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <ProjectCard
            uuid={item.uuid_application}
            title={item.title}
            description={item.shortDescription}
            image={
              item.bannerUrl
                ? { uri: item.bannerUrl }
                : require('../../../../../web/src/assets/project.webp')
            }
            onDetailsClick={() => handleProjectClick(item.uuid_application)}
          />
        </View>
      )}
      ListFooterComponent={
        filteredApplications.length > 0 ? (
          <View>
            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    pagination.page === 1 && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <Text style={styles.paginationButtonText}>Anterior</Text>
                </TouchableOpacity>

                <Text style={styles.paginationText}>
                  Página {pagination.page} de {pagination.totalPages}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    pagination.page >= pagination.totalPages && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <Text style={styles.paginationButtonText}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Contador de resultados */}
            <Text style={styles.resultsText}>
              Mostrando {filteredApplications.length} de {pagination.filteredItems} proyectos
            </Text>
          </View>
        ) : null
      }
      contentContainerStyle={styles.listContent}
    />
  )
}

export default ExploreProjectsList