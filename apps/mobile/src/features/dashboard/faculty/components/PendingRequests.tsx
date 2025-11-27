// apps/mobile/src/features/dashboards/faculty/components/PendingRequests.tsx

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { createPendingRequestsStyles } from '../../../../styles/components/dashboard/dashboardFacultyComponents.styles'
import { getMyApplications } from '../../../projects/services/projectsService'

const PendingRequests: React.FC = () => {
  const styles = useThemedStyles(createPendingRequestsStyles)
  const palette = useThemedPalette()
  const navigation = useNavigation()
  
  const [applications, setApplications] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const { applications: apps } = await getMyApplications(1, 100)
      setApplications(apps)
    } catch (err: any) {
      console.error('Error fetching applications:', err)
      setError(err.message || 'Error al cargar solicitudes')
    } finally {
      setIsLoading(false)
    }
  }

  // Función para obtener el color del estado
  const getStatusColor = (slug: string | undefined) => {
    const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
      'in_review': {
        bg: '#FEF3C7',
        text: '#92400E',
        dot: '#F59E0B'
      },
      'approved': {
        bg: '#D1FAE5',
        text: '#065F46',
        dot: '#10B981'
      },
      'project_approved': {
        bg: '#D1FAE5',
        text: '#065F46',
        dot: '#10B981'
      },
      'rejected': {
        bg: '#FEE2E2',
        text: '#991B1B',
        dot: '#EF4444'
      }
    }
    return statusColors[slug || 'in_review'] || statusColors['in_review']
  }

  // Función para obtener el nombre legible del estado
  const getStatusName = (slug: string | undefined) => {
    const statusNames: Record<string, string> = {
      'in_review': 'En Revisión',
      'approved': 'Aprobada',
      'project_approved': 'Aprobada',
      'rejected': 'Rechazada'
    }
    return statusNames[slug || 'in_review'] || 'Desconocido'
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.surface }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <MaterialCommunityIcons 
                name="alert-circle-outline" 
                size={28} 
                color={palette.errorText}
              />
              <Text style={styles.title}>Error</Text>
            </View>
            
            <View style={styles.errorState}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchApplications}
                activeOpacity={0.7}
              >
                <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.surface }}>
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="file-document-multiple-outline" 
                size={28} 
                color={palette.text}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Mis Solicitudes</Text>
              <Text style={styles.subtitle}>
                {applications.length} solicitud{applications.length !== 1 ? 'es' : ''}
              </Text>
            </View>
            {isLoading && (
              <ActivityIndicator size="small" color={palette.primary} />
            )}
          </View>

          {/* Requests List */}
          {isLoading && applications.length === 0 ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={palette.primary} />
              <Text style={styles.loadingText}>Cargando solicitudes...</Text>
            </View>
          ) : applications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons 
                  name="file-outline" 
                  size={32} 
                  color={palette.textSecondary}
                />
              </View>
              <Text style={styles.emptyText}>No tienes solicitudes</Text>
            </View>
          ) : (
            <View style={{ marginTop: 8 }}>
              {applications.map((app, index) => {
                const statusColor = getStatusColor(app.status?.slug)
                const statusName = getStatusName(app.status?.slug)

                return (
                  <TouchableOpacity 
                    key={app.uuid_application} 
                    style={[
                      styles.requestItem,
                      { 
                        marginBottom: index < applications.length - 1 ? 12 : 0,
                        borderLeftColor: statusColor.dot
                      }
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      // ✅ Navegar a detalles de MI solicitud
                      navigation.navigate('MyApplicationDetails' as never, {
                        uuid: app.uuid_application
                      } as never)
                    }}
                  >
                    <View style={styles.requestContent}>
                      <View style={styles.requestLeft}>
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: statusColor.dot }
                          ]}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.requestTitle} numberOfLines={2}>
                            {app.title || 'Sin título'}
                          </Text>
                          <Text style={styles.requestDescription} numberOfLines={2}>
                            {app.shortDescription || 'Sin descripción'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.requestRight}>
                        {/* Badge de estado */}
                        <View 
                          style={[
                            styles.statusBadge,
                            { backgroundColor: statusColor.bg }
                          ]}
                        >
                          <Text 
                            style={[
                              styles.statusBadgeText,
                              { color: statusColor.text }
                            ]}
                          >
                            {statusName}
                          </Text>
                        </View>

                        {/* Fecha */}
                        <Text style={styles.dateText}>
                          {app.createdAt 
                            ? formatDistanceToNow(new Date(app.createdAt), { 
                                addSuffix: true, 
                                locale: es 
                              })
                            : ''}
                        </Text>

                        {/* Ícono de flecha */}
                        <View style={styles.viewButton}>
                          <MaterialCommunityIcons 
                            name="chevron-right" 
                            size={20} 
                            color={palette.textSecondary}
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          )}

          {/* Botón para ver todas */}
          {applications.length > 0 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('MyApplications' as never)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllButtonText}>
                Ver todas mis solicitudes
              </Text>
              <MaterialCommunityIcons 
                name="arrow-right" 
                size={18} 
                color={palette.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default PendingRequests