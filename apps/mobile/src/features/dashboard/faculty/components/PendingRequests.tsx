// apps/mobile/src/features/dashboards/faculty/components/PendingRequests.tsx

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { createPendingRequestsStyles } from '../../../../styles/components/dashboard/dashboardFacultyComponents.styles'
import { usePendingRequests } from '../hooks/usePendingRequests'

const PendingRequests: React.FC = () => {
  const styles = useThemedStyles(createPendingRequestsStyles)
  const palette = useThemedPalette()
  
  const {
    loading,
    error,
    requestsData,
    statusConfig,
    priorityConfig,
    formatDate,
    getStatistics
  } = usePendingRequests()

  const stats = getStatistics()

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
                name="file-search-outline" 
                size={28} 
                color={palette.text}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Solicitudes por revisar</Text>
              <Text style={styles.subtitle}>
                {stats.total} proyecto{stats.total !== 1 ? 's' : ''} pendiente{stats.total !== 1 ? 's' : ''}
              </Text>
            </View>
            {loading && (
              <ActivityIndicator size="small" color={palette.primary} />
            )}
          </View>

          {/* Requests List */}
          {loading && requestsData.length === 0 ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={palette.primary} />
              <Text style={styles.loadingText}>Cargando solicitudes...</Text>
            </View>
          ) : (
            <View style={{ marginTop: 8 }}>
              {requestsData.map((request, index) => {
                const statusCfg = statusConfig[request.status]
                const priorityCfg = priorityConfig[request.priority]
                
                return (
                  <TouchableOpacity 
                    key={request.id} 
                    style={[
                      styles.requestItem,
                      { marginBottom: index < requestsData.length - 1 ? 12 : 0 }
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.requestContent}>
                      <View style={styles.requestLeft}>
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: statusCfg.color }
                          ]}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.requestTitle} numberOfLines={2}>
                            {request.title}
                          </Text>
                          <Text style={styles.requestCompany} numberOfLines={1}>
                            {request.company}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.requestRight}>
                        <View
                          style={[
                            styles.priorityBadge,
                            { 
                              backgroundColor: priorityCfg.color.includes('red') 
                                ? '#FEE2E2' 
                                : priorityCfg.color.includes('yellow') 
                                ? '#FEF3C7' 
                                : '#D1FAE5'
                            }
                          ]}
                        >
                          <Text style={styles.priorityText}>
                            {priorityCfg.icon} {request.priority}
                          </Text>
                        </View>
                        
                        <Text style={[styles.statusText, { color: statusCfg.textColor }]}>
                          {statusCfg.text}
                        </Text>
                        <Text style={styles.dateText}>
                          {formatDate(request.sendDate)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          )}

          {!loading && requestsData.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons 
                  name="folder-outline" 
                  size={32} 
                  color={palette.textSecondary}
                />
              </View>
              <Text style={styles.emptyText}>No hay solicitudes pendientes</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default PendingRequests