// apps/mobile/src/features/dashboards/faculty/components/LinkedStudents.tsx

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { spacing } from '../../../../styles/theme/spacing'
import { createLinkedStudentsStyles } from '../../../../styles/components/dashboard/dashboardFacultyComponents.styles'
import { useLinkedStudents } from '../hooks/useLinkedStudents'
import Avatar from '../../../../components/Avatar'

const LinkedStudents: React.FC = () => {
  const styles = useThemedStyles(createLinkedStudentsStyles)
  const palette = useThemedPalette()

  const {
    selectedStudent,
    comment,
    showCommentModal,
    loading,
    studentsData,
    setComment,
    openCommentModal,
    closeCommentModal,
    handleSendComment
  } = useLinkedStudents()

  // Función para obtener color del badge según status
  const getStatusColor = (statusColor: string) => {
    if (statusColor.includes('blue')) return { bg: '#DBEAFE', text: '#1E40AF' }
    if (statusColor.includes('red')) return { bg: '#FEE2E2', text: '#991B1B' }
    if (statusColor.includes('yellow')) return { bg: '#FEF3C7', text: '#92400E' }
    if (statusColor.includes('lime')) return { bg: '#D1FAE5', text: '#065F46' }
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
              name="account-group" 
              size={28} 
              color={palette.text}
            />
            <Text style={styles.title}>Estudiantes vinculados</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{studentsData.length} estudiantes</Text>
            </View>
          </View>

          {/* Students List */}
          <View style={{ marginTop: 8 }}>
            {studentsData.map((student, index) => {
              const statusColor = getStatusColor(student.statusColor)
              
              return (
                <View 
                  key={student.id} 
                  style={[
                    styles.studentItem,
                    { marginBottom: index < studentsData.length - 1 ? 12 : 0 }
                  ]}
                >
                  {/* Student Info */}
                  <View style={styles.studentHeader}>
                    <Avatar
                      firstName={student.name.split(' ')[0]}
                      lastName={student.name.split(' ')[student.name.split(' ').length - 1]}
                      size="small"
                    />
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      <Text style={styles.studentName} numberOfLines={1}>
                        {student.name}
                      </Text>
                      <Text style={styles.studentTitle} numberOfLines={1}>
                        {student.title}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusColor.bg }
                      ]}
                    >
                      <Text style={[styles.statusText, { color: statusColor.text }]}>
                        {student.status}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progreso del proyecto</Text>
                      <Text style={styles.progressValue}>{student.progress}%</Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View 
                        style={[
                          styles.progressBarFill,
                          { width: `${student.progress}%` }
                        ]}
                      />
                    </View>
                  </View>

                  {/* Footer */}
                  <View style={styles.studentFooter}>
                    <Text style={styles.lastActivity}>{student.lastActivity}</Text>
                    <TouchableOpacity
                      onPress={() => openCommentModal(student)}
                      style={styles.commentButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.commentButtonText}>Enviar comentario</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>

      {/* Comment Modal */}
      {showCommentModal && selectedStudent && (
        <Modal
          visible={showCommentModal}
          transparent
          animationType="fade"
          onRequestClose={closeCommentModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>
                    Comentario para {selectedStudent.name}
                  </Text>
                  <Text style={styles.modalSubtitle}>{selectedStudent.title}</Text>
                </View>
                <TouchableOpacity onPress={closeCommentModal}>
                  <MaterialCommunityIcons 
                    name="close" 
                    size={24} 
                    color={palette.text}
                  />
                </TouchableOpacity>
              </View>

              {/* Comment Input */}
              <View style={styles.modalBody}>
                <TextInput
                  style={styles.commentInput}
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Escribe tu comentario o calificación parcial..."
                  placeholderTextColor={palette.textSecondary}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  editable={!loading}
                />
              </View>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={closeCommentModal}
                  style={styles.cancelButton}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSendComment}
                  style={[
                    styles.sendButton,
                    (!comment.trim() || loading) && styles.sendButtonDisabled
                  ]}
                  disabled={!comment.trim() || loading}
                  activeOpacity={0.7}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={palette.onPrimary} />
                  ) : (
                    <Text style={styles.sendButtonText}>Enviar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}

export default LinkedStudents