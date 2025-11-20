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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={{ marginTop: 16, fontSize: 14, color: palette.textSecondary }}>
            Cargando proyectos...
          </Text>
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Ionicons name="alert-circle-outline" size={48} color={palette.errorText} />
          <Text style={{ marginTop: 16, fontSize: 14, color: palette.errorText, textAlign: 'center' }}>
            {error}
          </Text>
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

      {/* Barra de búsqueda */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: palette.background,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: palette.grayLight,
          paddingHorizontal: 16,
          marginHorizontal: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Ionicons name="search-outline" size={20} color={palette.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 14,
            color: palette.text,
          }}
          placeholder="Buscar proyectos..."
          placeholderTextColor={palette.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Lista de proyectos */}
      {filteredProjects.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Ionicons name="folder-open-outline" size={48} color={palette.textSecondary} />
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: palette.text,
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            {search ? 'No se encontraron proyectos' : 'Aún no tienes proyectos'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: palette.textSecondary,
              textAlign: 'center',
            }}
          >
            {search
              ? 'Intenta con otros términos de búsqueda'
              : 'Tus proyectos aprobados aparecerán aquí'}
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredProjects}
            keyExtractor={(item) => item.uuid_application}
            renderItem={({ item }) => (
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
            )}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: pagination.page === 1 ? palette.gray : palette.primary,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  opacity: pagination.page === 1 ? 0.5 : 1,
                }}
                onPress={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: palette.onPrimary }}>Anterior</Text>
              </TouchableOpacity>

              <Text style={{ fontSize: 14, fontWeight: '500', color: palette.text }}>
                Página {pagination.page} de {pagination.totalPages}
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor:
                    pagination.page >= pagination.totalPages ? palette.gray : palette.primary,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  opacity: pagination.page >= pagination.totalPages ? 0.5 : 1,
                }}
                onPress={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: palette.onPrimary }}>Siguiente</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Contador de resultados */}
          <Text
            style={{
              fontSize: 12,
              color: palette.textSecondary,
              textAlign: 'center',
              paddingBottom: 16,
            }}
          >
            Mostrando {filteredProjects.length} de {pagination.filteredItems} proyectos
          </Text>
        </>
      )}
    </View>
  )
}

export default MyProjects