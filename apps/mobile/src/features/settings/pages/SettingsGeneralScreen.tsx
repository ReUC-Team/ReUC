// apps/mobile/src/features/settings/pages/SettingsGeneralScreen.tsx

import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createSettingsDetailStyles } from '../../../styles/screens/settings/SettingsDetail.styles'

export default function SettingsGeneralScreen() {
  const styles = useThemedStyles(createSettingsDetailStyles)
  const navigation = useNavigation<any>()
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Español')

  const languages = ['Español', 'English']

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>General</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IDIOMA</Text>
          <View style={styles.sectionContent}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language}
                style={styles.optionItem}
                onPress={() => setSelectedLanguage(language)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{language}</Text>
                {selectedLanguage === language && (
                  <Ionicons name="checkmark" size={24} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}