// apps/mobile/src/features/projects/pages/MyProjects.tsx

import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createMyProjectsStyles } from '../../../styles/screens/MyProjects.styles'
import useMyProjects from '../hooks/useMyProjects'
import ProjectCard from '../components/ProjectCard'

const MyProjects: React.FC = () => {
  const styles = useThemedStyles(createMyProjectsStyles)
  const palette = useThemedPalette()
  const navigation = useNavigation<any>()
  const [search, setSearch] = useState('')

  const { projects, pagination, isLoading, error, handlePageChange } = useMyProjects()

  // Filtrar por búsqueda local
  const filteredProjects = projects.filter((project) => {
    const searchLower = search.toLowerCase()
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.shortDescription.toLowerCase().includes(searchLower)
    )
  })

  const handleProjectClick = (uuid: string) => {
    console.log('🔍 Navigating to project with UUID:', uuid)
    navigation.navigate('ProjectDetails', { uuid })
  }

  if (isLoading && projects.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Mis <Text style={styles.titleAccent}>proyectos</Text>
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.loadingText}>Cargando proyectos...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Mis <Text style={styles.titleAccent}>proyectos</Text>
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={palette.errorText} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Mis <Text style={styles.titleAccent}>proyectos</Text>
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={palette.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar proyectos..."
          placeholderTextColor={palette.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {filteredProjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={48} color={palette.textSecondary} />
          <Text style={styles.emptyTitle}>
            {search ? 'No se encontraron proyectos' : 'Aún no tienes proyectos'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {search ? 'Intenta con otros términos de búsqueda' : 'Tus proyectos aprobados aparecerán aquí'}
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredProjects}
            keyExtractor={(item) => item.uuid_project}
            renderItem={({ item }) => (
              <ProjectCard
                key={item.uuid_project}
                uuid={item.uuid_project}
                title={item.title}
                description={item.shortDescription}
                image={
                  item.bannerUrl
                    ? { uri: item.bannerUrl }
                    : require('../../../../../web/src/assets/project.webp')
                }
                status={item.status}  
                onDetailsClick={() => handleProjectClick(item.uuid_project)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {pagination.totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  pagination.page === 1 ? styles.paginationButtonDisabled : styles.paginationButtonActive,
                ]}
                onPress={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <Text style={styles.paginationButtonText}>Anterior</Text>
              </TouchableOpacity>

              <Text style={styles.paginationText}>
                Página {String(pagination.page)} de {String(pagination.totalPages)}
              </Text>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  pagination.page >= pagination.totalPages
                    ? styles.paginationButtonDisabled
                    : styles.paginationButtonActive,
                ]}
                onPress={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                <Text style={styles.paginationButtonText}>Siguiente</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.counterText}>
            Mostrando {String(filteredProjects.length)} de {String(pagination.filteredItems)} proyectos
          </Text>
        </>
      )}
    </View>
  )
}

export default MyProjects