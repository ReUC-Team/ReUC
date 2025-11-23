// apps/mobile/src/features/projects/components/MyApplicationsList.tsx

import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createMyApplicationsListStyles } from '../../../styles/components/projects/MyApplicationsList.styles'
import useMyApplications from '../hooks/useMyApplications'
import ProjectCard from './ProjectCard'

const MyApplicationsList: React.FC = () => {
  const styles = useThemedStyles(createMyApplicationsListStyles)
  const palette = useThemedPalette()
  const navigation = useNavigation<any>()
  const [search, setSearch] = useState('')

  const { applications, pagination, isLoading, error, handlePageChange } = useMyApplications()

  // Filtrar por búsqueda local
  const filteredApplications = applications.filter((app) => {
    const searchLower = search.toLowerCase()
    return (
      app.title.toLowerCase().includes(searchLower) ||
      app.shortDescription.toLowerCase().includes(searchLower)
    )
  })

  const handleApplicationClick = (uuid: string) => {
    navigation.navigate('MyApplicationDetails', { uuid })
  }

  const handleCreateNew = () => {
    navigation.navigate('RequestProject')
  }

  // ✅ Componente del header que se renderiza dentro del FlatList
  const ListHeaderComponent = () => (
    <>
      {/* Título */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Mis <Text style={styles.titleAccent}>solicitudes</Text>
        </Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={palette.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar en mis solicitudes..."
          placeholderTextColor={palette.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </>
  )

  // ✅ Componente del footer para paginación
  const ListFooterComponent = () => {
    if (filteredApplications.length === 0) return null

    return (
      <>
        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, pagination.page === 1 && styles.paginationButtonDisabled]}
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
          Mostrando {filteredApplications.length} de {pagination.filteredItems} solicitudes
        </Text>
      </>
    )
  }

  // ✅ Componente de estado vacío
  const ListEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.loadingText}>Cargando solicitudes...</Text>
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
      <View style={styles.emptyContainer}>
        <Ionicons name="folder-open-outline" size={48} color={palette.textSecondary} />
        <Text style={styles.emptyTitle}>
          {search ? 'No se encontraron solicitudes' : 'Aún no has creado solicitudes'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {search ? 'Intenta con otros términos de búsqueda' : 'Crea tu primera solicitud de proyecto'}
        </Text>
        {!search && (
          <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
            <Text style={styles.createButtonText}>Crear solicitud</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <FlatList
      data={filteredApplications}
      keyExtractor={(item) => item.uuid_application}
      renderItem={({ item }) => (
        <ProjectCard
          uuid={item.uuid_application}
          title={item.title}
          description={item.shortDescription}
          image={item.bannerUrl ? { uri: item.bannerUrl } : require('../../../../../web/src/assets/project.webp')}
          onDetailsClick={() => handleApplicationClick(item.uuid_application)}
        />
      )}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default MyApplicationsList