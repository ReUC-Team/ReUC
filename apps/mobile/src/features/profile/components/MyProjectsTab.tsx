// apps/mobile/src/features/profile/components/MyProjectsTab.tsx

import React from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createMyProjectsTabStyles } from '../../../styles/components/profile/MyProjectsTab.styles'
import useMyProjects from '../../projects/hooks/useMyProjects'
import ProjectCard from '../../projects/components/ProjectCard'

const MyProjectsTab: React.FC = () => {
  const styles = useThemedStyles(createMyProjectsTabStyles)
  const palette = useThemedPalette()
  const navigation = useNavigation<any>()
  const { projects, pagination, isLoading, error, handlePageChange } = useMyProjects()

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Cargando proyectos...</Text>
      </View>
    )
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={palette.errorText} />
        <Text style={styles.errorTitle}>Error al cargar proyectos</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="folder-open-outline" size={64} color={palette.textSecondary} />
        <Text style={styles.emptyTitle}>Aún no tienes proyectos aprobados</Text>
        <Text style={styles.emptyText}>
          Tus solicitudes aprobadas aparecerán aquí como proyectos activos
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate('MyApplications')}
        >
          <Text style={styles.emptyButtonText}>Ver mis solicitudes</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Grid de proyectos */}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.uuid_project}
        renderItem={({ item }) => (
          <ProjectCard
            uuid={item.uuid_project}
            title={item.title}
            description={item.shortDescription}
            image={
              item.bannerUrl
                ? { uri: item.bannerUrl }
                : require('../../../../../web/src/assets/project.webp')
            }
            onDetailsClick={() =>
              navigation.navigate('ProjectDetails', { uuid: item.uuid_project })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
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

            {/* Contador */}
            <Text style={styles.counterText}>
              Mostrando {projects.length} de {pagination.filteredItems} proyectos
            </Text>
          </>
        }
      />
    </View>
  )
}

export default MyProjectsTab