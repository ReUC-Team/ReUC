// apps/mobile/src/components/MultiSelectDropdown.tsx

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../hooks/useThemedStyles'
import { createMultiSelectDropdownStyles } from '../styles/components/projects/MultiSelectDropdown.styles'

interface Option {
  id: number
  label: string
}

interface MultiSelectDropdownProps {
  label: string
  options: Option[]
  selectedIds: number[]
  onChange: (selectedIds: number[]) => void
  placeholder?: string
  error?: string
  optional?: boolean
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selectedIds,
  onChange,
  placeholder = 'Seleccionar...',
  error,
  optional = false,
}) => {
  const styles = useThemedStyles(createMultiSelectDropdownStyles)
  const palette = useThemedPalette()
  const [modalVisible, setModalVisible] = useState(false)

  const handleToggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  const getSelectedLabels = () => {
    if (selectedIds.length === 0) return placeholder

    return options
      .filter((opt) => selectedIds.includes(opt.id))
      .map((opt) => opt.label)
      .join(', ')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {optional && <Text style={styles.optional}>(opcional)</Text>}
      </Text>

      <TouchableOpacity
        style={[styles.selectButton, error && styles.selectButtonError]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.selectButtonText,
            selectedIds.length === 0 && styles.selectButtonTextPlaceholder,
          ]}
          numberOfLines={1}
        >
          {getSelectedLabels()}
        </Text>
        <Ionicons name="chevron-down" size={20} color={palette.textSecondary} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={palette.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleToggle(item.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selectedIds.includes(item.id) && styles.checkboxSelected,
                    ]}
                  >
                    {selectedIds.includes(item.id) && (
                      <Ionicons name="checkmark" size={16} color={palette.onPrimary} />
                    )}
                  </View>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default MultiSelectDropdown