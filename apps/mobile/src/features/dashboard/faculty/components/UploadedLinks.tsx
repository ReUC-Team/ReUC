// apps/mobile/src/features/dashboards/faculty/components/UploadedLinks.tsx

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { createUploadedLinksStyles } from '../../../../styles/components/dashboard/dashboardFacultyComponents.styles'
import { useUploadedLinks, getLinkIcon } from '../hooks/useUploadedLinks'
import Avatar from '../../../../components/Avatar'
import { spacing } from '../../../../styles/theme/spacing'

const UploadedLinks: React.FC = () => {
  const styles = useThemedStyles(createUploadedLinksStyles)
  const palette = useThemedPalette()

  const {
    linksData,
    selectedLink,
    showReviewModal,
    reviewComment,
    pendingCount,
    setReviewComment,
    openReviewModal,
    closeReviewModal,
    handleReviewSubmit,
    openLink,
    copyLink
  } = useUploadedLinks()

  // Función para obtener color del status badge
  const getStatusColor = (statusColor: string) => {
    if (statusColor.includes('yellow')) return { bg: '#FEF3C7', text: '#92400E' }
    if (statusColor.includes('lime')) return { bg: '#D1FAE5', text: '#065F46' }
    if (statusColor.includes('red')) return { bg: '#FEE2E2', text: '#991B1B' }
    if (statusColor.includes('blue')) return { bg: '#DBEAFE', text: '#1E40AF' }
    return { bg: palette.grayLight, text: palette.text }
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
            <MaterialCommunityIcons 
              name="link-variant" 
              size={28} 
              color={palette.text}
            />
            <Text style={styles.title}>Enlaces Subidos</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingCount} pendientes</Text>
            </View>
          </View>

          {/* Links List */}
          <View style={{ marginTop: 8 }}>
            {linksData.map((link, index) => {
              const statusColor = getStatusColor(link.statusColor)
              
              return (
                <View 
                  key={link.id} 
                  style={[
                    styles.linkItem,
                    { marginBottom: index < linksData.length - 1 ? 12 : 0 }
                  ]}
                >
                  {/* Link Header */}
                  <View style={styles.linkHeader}>
                    <View style={styles.linkIconContainer}>
                      <MaterialCommunityIcons
                        name={getLinkIcon(link.linkType) as any}
                        size={24}
                        color={palette.primary}
                      />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text style={styles.linkTitle} numberOfLines={1}>
                        {link.linkTitle}
                      </Text>
                      <TouchableOpacity onPress={() => openLink(link)}>
                        <Text style={styles.linkUrl} numberOfLines={1}>
                          {link.url}
                        </Text>
                      </TouchableOpacity>
                      
                      {/* Student Info */}
                      <View style={styles.studentInfo}>
                        <Avatar
                          firstName={link.name.split(' ')[0]}
                          lastName={link.name.split(' ')[link.name.split(' ').length - 1]}
                          size="small"
                          style={{ width: 24, height: 24 }}
                        />
                        <Text style={styles.studentText} numberOfLines={1}>
                          {link.name} • {link.title}
                        </Text>
                      </View>
                    </View>

                    {/* Status Badge */}
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusColor.bg }
                      ]}
                    >
                      <Text style={[styles.statusText, { color: statusColor.text }]}>
                        {link.statusText}
                      </Text>
                    </View>
                  </View>

                  {/* Description */}
                  {link.description && (
                    <Text style={styles.description} numberOfLines={2}>
                      {link.description}
                    </Text>
                  )}

                  {/* Meta Info */}
                  <View style={styles.metaInfo}>
                    <Text style={styles.metaText}>🔗 {link.linkType}</Text>
                    <Text style={styles.metaText}>🗓️ {link.uploadTime}</Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => openLink(link)}
                      style={[styles.actionButton, styles.primaryAction]}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons 
                        name="open-in-new" 
                        size={16} 
                        color="#1E40AF"
                      />
                      <Text style={styles.primaryActionText}>Abrir</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => copyLink(link)}
                      style={[styles.actionButton, styles.secondaryAction]}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons 
                        name="content-copy" 
                        size={16} 
                        color={palette.text}
                      />
                      <Text style={styles.secondaryActionText}>Copiar</Text>
                    </TouchableOpacity>

                    {link.status === 'pending' ? (
                      <TouchableOpacity
                        onPress={() => openReviewModal(link)}
                        style={[styles.actionButton, styles.reviewAction]}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.reviewActionText}>Revisar</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => openReviewModal(link)}
                        style={[styles.actionButton, styles.viewCommentsAction]}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.viewCommentsActionText}>Ver comentarios</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>

      {/* Review Modal */}
      {showReviewModal && selectedLink && (
        <Modal
          visible={showReviewModal}
          transparent
          animationType="fade"
          onRequestClose={closeReviewModal}
        >
          <View style={styles.modalOverlay}>
            <ScrollView 
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing.md }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>Revisar enlace</Text>
                    <View style={{ marginTop: spacing.sm }}>
                      <Text style={styles.modalInfoLabel}>
                        <Text style={styles.modalInfoBold}>Enlace:</Text> {selectedLink.linkTitle}
                      </Text>
                      <TouchableOpacity onPress={() => openLink(selectedLink)}>
                        <Text style={styles.modalInfoUrl} numberOfLines={1}>
                          <Text style={styles.modalInfoBold}>URL:</Text> {selectedLink.url}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.modalInfoLabel}>
                        <Text style={styles.modalInfoBold}>Estudiante:</Text> {selectedLink.name}
                      </Text>
                      <Text style={styles.modalInfoLabel}>
                        <Text style={styles.modalInfoBold}>Proyecto:</Text> {selectedLink.title}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={closeReviewModal}>
                    <MaterialCommunityIcons 
                      name="close" 
                      size={24} 
                      color={palette.text}
                    />
                  </TouchableOpacity>
                </View>

                {/* Comment Input */}
                <View style={styles.modalBody}>
                  <Text style={styles.inputLabel}>Comentarios de revisión</Text>
                  <TextInput
                    style={styles.commentInput}
                    value={reviewComment}
                    onChangeText={setReviewComment}
                    placeholder="Escribe tus comentarios sobre el enlace..."
                    placeholderTextColor={palette.textSecondary}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>

                {/* Modal Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    onPress={closeReviewModal}
                    style={styles.cancelButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleReviewSubmit('reject')}
                    style={styles.rejectButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.rejectButtonText}>Rechazar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleReviewSubmit('request-changes')}
                    style={styles.changesButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.changesButtonText}>Cambios</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleReviewSubmit('approve')}
                    style={styles.approveButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.approveButtonText}>Aprobar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  )
}

export default UploadedLinks